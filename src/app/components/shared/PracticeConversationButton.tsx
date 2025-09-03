"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/button";
import { useToast } from "@/ui/use-toast";
import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Segment = "guard" | "professional";

type PracticeConversationButtonProps = {
  /** Required: user_profiles.id (UUID == auth.uid()) */
  userId: string;
  /** User segment to pick a relevant scenario if none supplied */
  segment: Segment;
  /** Optional: force a specific scenario to use (UUID or slug/title) */
  scenarioId?: string;
  /** Where to navigate after creating a session. If omitted, defaults by segment */
  chatHrefBase?: string; // e.g. "/guards/chat" or "/professionals/chat"
  /** Optional: called after session is created */
  onCreated?: (sessionId: string) => void;

  /** UI customisations */
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
  className?: string;
  disabled?: boolean;
};

function isUuid(v: string | undefined | null): boolean {
  return (
    !!v &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      v
    )
  );
}

/** Try to resolve a scenario UUID from a candidate which might be a UUID or a slug/title */
async function resolveScenarioId(
  supabase: ReturnType<typeof createClient>,
  candidate: string | undefined,
  segment: Segment
): Promise<string> {
  // 1) If candidate is already a UUID, use it directly
  if (isUuid(candidate)) return candidate as string;

  // 2) If candidate is a slug/title string, try exact title match
  if (candidate) {
    // Exact title
    {
      const { data, error } = await supabase
        .from("scenarios")
        .select("id")
        .eq("title", candidate)
        .limit(1);
      if (error)
        throw new Error(`[scenarios] ${error.message ?? "query failed"}`);
      if (data?.length) return data[0].id as string;
    }
    // Relaxed: hyphens -> spaces, case-insensitive contains
    const relaxed = candidate.replace(/-/g, " ");
    {
      const { data, error } = await supabase
        .from("scenarios")
        .select("id, title")
        .ilike("title", `%${relaxed}%`)
        .order("created_at", { ascending: false })
        .limit(1);
      if (error)
        throw new Error(`[scenarios] ${error.message ?? "query failed"}`);
      if (data?.length) return data[0].id as string;
    }
  }

  // 3) Fallback: latest scenario for this segment
  {
    const { data, error } = await supabase
      .from("scenarios")
      .select("id")
      .eq("segment", segment)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error)
      throw new Error(`[scenarios] ${error.message ?? "query failed"}`);
    if (data?.length) return data[0].id as string;
  }

  // 4) Last resort: any scenario
  {
    const { data, error } = await supabase
      .from("scenarios")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error)
      throw new Error(`[scenarios-any] ${error.message ?? "query failed"}`);
    if (data?.length) return data[0].id as string;
  }

  throw new Error("No scenarios exist. Please add one.");
}

export default function PracticeConversationButton({
  userId,
  segment,
  scenarioId,
  chatHrefBase,
  onCreated,
  icon: Icon = MessageCircle,
  title = "Practice Conversation",
  subtitle = "AI-powered chat",
  className = "",
  disabled,
}: PracticeConversationButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = React.useMemo(() => createClient(), []);

  const [loading, setLoading] = React.useState(false);

  const startSession = React.useCallback(async () => {
    if (!userId) {
      toast({
        title: "Missing user",
        description: "User ID is required to start a session.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // ---------- 1) Figure out the desired scenario (UUID or slug) ----------
      let candidate = scenarioId;

      if (!candidate) {
        // Try the user's learning path
        const { data: lp, error: lpErr } = await supabase
          .from("user_learning_paths")
          .select("current_scenario, recommended_scenarios")
          .eq("user_id", userId)
          .maybeSingle(); // safe if no row
        if (lpErr && lpErr.code !== "PGRST116") {
          console.warn("[user_learning_paths] read error:", lpErr);
        }

        if (lp?.current_scenario) {
          candidate = lp.current_scenario as string; // might be UUID or slug
        } else if (lp?.recommended_scenarios?.length) {
          candidate = (lp.recommended_scenarios[0] as string) ?? undefined; // might be UUID or slug
        }
      }

      const chosenScenarioId = await resolveScenarioId(
        supabase,
        candidate,
        segment
      );

      // ---------- 2) Create learning session ----------
      const { data: rows, error: sessErr } = await supabase
        .from("learning_sessions")
        .insert({
          user_id: userId,
          scenario_id: chosenScenarioId, // ✅ always a UUID now
          session_duration: 0,
          completion_rate: 0,
          pronunciation_score: null,
        })
        .select("id"); // returns array

      if (sessErr) {
        throw new Error(
          `[learning_sessions] ${sessErr.message ?? "insert blocked"}`
        );
      }

      const sessionId = rows?.[0]?.id as string | undefined;
      if (!sessionId) {
        throw new Error("Session created but no id returned.");
      }

      onCreated?.(sessionId);

      // ---------- 3) Navigate ----------
      const base =
        chatHrefBase ??
        (segment === "guard" ? "/guards/chat" : "/professionals/chat");
      router.push(`${base}?session=${encodeURIComponent(sessionId)}`);
    } catch (e: unknown) {
      const err = e as Error;
      console.error("[PracticeConversationButton]", e);
      toast({
        title: "Couldn’t start conversation",
        description: String(
          err.message ?? e ?? "Please try again in a moment."
        ),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    scenarioId,
    segment,
    chatHrefBase,
    onCreated,
    supabase,
    router,
    toast,
  ]);

  return (
    <Button
      onClick={startSession}
      variant="outline"
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={title}
      className={[
        "h-20 w-full",
        "flex flex-col items-center justify-center gap-2",
        "border-purple-300 hover:bg-purple-50",
        "transition-colors",
        loading ? "opacity-80 cursor-wait" : "",
        className,
      ].join(" ")}
      title={title}
    >
      <Icon className="w-6 h-6 text-purple-600" />
      <span className="font-medium">{title}</span>
      <span className="text-xs text-gray-600">
        {loading ? "Starting…" : subtitle}
      </span>
    </Button>
  );
}
