"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import VoiceRecorder from "@/components/shared/VoiceRecorder";
import { Button } from "@/ui/button";
import { toast } from "react-hot-toast";

/**
 * Scenario practice page (guards)
 * - Loads scenario by id
 * - Records + transcribes user speech
 * - Computes a simple pronunciation/completion score
 * - Logs learning session via Supabase RPC (or falls back to direct insert)
 * - Updates user_progress and lets streak trigger handle itself
 */
export default function ScenarioPage({ params }: { params: { id: string } }) {
  const supabase = useMemo(() => createClient(), []);
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [score, setScore] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Track elapsed time for session logging
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // auth
        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        if (!user) {
          toast.error("Please sign in to practice scenarios.");
          return;
        }
        setUserId(user.id);

        // scenario
        const { data, error } = await supabase
          .from("scenarios")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setScenario(data);
        startedAtRef.current = Date.now();
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to load scenario.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [params.id, supabase]);

  // Simple text similarity (Levenshtein-based) for MVP scoring
  function levenshtein(a: string, b: string) {
    const m = a.length,
      n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }
  function similarity(a: string, b: string) {
    const A = a.trim().toLowerCase();
    const B = b.trim().toLowerCase();
    if (!A && !B) return 1;
    const longer = A.length >= B.length ? A : B;
    const dist = levenshtein(A, B);
    return Math.max(0, (longer.length - dist) / Math.max(1, longer.length));
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      if (!audioBlob) return;
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Transcription failed");
      }

      const { transcription } = await res.json();
      setTranscription(transcription || "");
      toast.success(`You said: ${transcription || "(no speech detected)"}`);

      // MVP local scoring vs expected text
      const expected = scenario?.expected_response || "";
      const sim = similarity(expected, transcription || "");
      const computedScore = Math.round(sim * 100);
      setScore(computedScore);
    } catch (err: any) {
      toast.error(err?.message ?? "Could not process the recording.");
    }
  };

  const handleMarkComplete = async () => {
    if (!userId || !scenario) {
      toast.error("Missing user or scenario.");
      return;
    }
    setSaving(true);
    try {
      const seconds =
        startedAtRef.current != null
          ? Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000))
          : 60;

      const completionRate =
        score != null ? Math.min(1, Math.max(0, score / 100)) : 0.6;

      // Prefer RPC (log_learning_session) — will trigger streak update
      let rpcErr = null;
      const { error: rpcError } = await supabase.rpc("log_learning_session", {
        p_user_id: userId,
        p_scenario_id: scenario.id,
        p_session_duration: seconds,
        p_completion_rate: completionRate,
        p_pronunciation_score: score ?? null,
      });
      rpcErr = rpcError ?? null;

      // Fallback to direct insert if RPC not available
      if (rpcErr) {
        const { error: insertErr } = await supabase
          .from("learning_sessions")
          .insert({
            user_id: userId,
            scenario_id: scenario.id,
            session_duration: seconds,
            completion_rate: String(completionRate), // column is DECIMAL in SQL; Supabase typed as string
            pronunciation_score: score ?? null,
          });
        if (insertErr) throw insertErr;
      }

      // Upsert user_progress (mark completed)
      const { error: upErr } = await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          scenario_id: scenario.id,
          completion_status: "completed",
          score: score ?? null,
          attempts: 1,
          last_attempt: new Date().toISOString(),
        },
        { onConflict: "user_id,scenario_id" }
      );
      if (upErr) throw upErr;

      toast.success("Session saved and marked complete ✅");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save session.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading…</p>;
  if (!scenario) return <p className="p-6">Scenario not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{scenario.title}</h1>
      <p className="mb-6 text-gray-700">{scenario.scenario_text}</p>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">Target phrase:</p>
        <div className="p-3 rounded border bg-white">
          {scenario.expected_response || "—"}
        </div>
      </div>

      <VoiceRecorder
        expectedText={scenario.expected_response || ""}
        onRecordingComplete={handleRecordingComplete}
      />

      {transcription ? (
        <div className="mt-4 text-sm">
          <p className="text-gray-600">
            Your transcript:{" "}
            <span className="font-medium">{transcription}</span>
          </p>
          {score != null && (
            <p className="text-gray-700">
              Pronunciation/Similarity score:{" "}
              <span className="font-semibold">{score}</span>/100
            </p>
          )}
        </div>
      ) : null}

      <Button
        onClick={handleMarkComplete}
        disabled={saving}
        className="mt-6"
        title="Save this session and mark scenario as completed"
      >
        {saving ? "Saving…" : "Mark Complete"}
      </Button>
    </div>
  );
}
