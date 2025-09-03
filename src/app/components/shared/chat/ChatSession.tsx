"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/ui/button";
import { Card, CardHeader, CardContent } from "@/ui/card";
import { useToast } from "@/ui/use-toast";

type Segment = "guard" | "professional" | "guide";

type ChatSessionProps = {
  segment: Segment;
};

type Scenario = {
  id: string;
  title: string;
  scenario_text: string;
  expected_response: string | null;
  cultural_context: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
};

type LearningSession = {
  id: string;
  user_id: string;
  scenario_id: string;
};

type Msg = { role: "user" | "assistant" | "system"; content: string };

export default function ChatSession({ segment }: ChatSessionProps) {
  const supabase = React.useMemo(() => createClient(), []);
  const sp = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const sessionId = sp.get("session") ?? "";

  const [loading, setLoading] = React.useState(true);
  const [session, setSession] = React.useState<LearningSession | null>(null);
  const [scenario, setScenario] = React.useState<Scenario | null>(null);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Msg[]>([]);

  // Load user, validate session ownership, load scenario
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!sessionId) {
          toast({
            title: "Missing session",
            description: "No session id provided.",
            variant: "destructive",
          });
          router.replace(
            segment === "guard"
              ? "/guards/dashboard"
              : "/professionals/dashboard"
          );
          return;
        }

        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes?.user;
        if (!user) {
          router.replace(
            `/auth/signin?type=${
              segment === "guard" ? "guard" : "professional"
            }`
          );
          return;
        }

        // Validate session belongs to current user
        const { data: lsRows, error: lsErr } = await supabase
          .from("learning_sessions")
          .select("id, user_id, scenario_id")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .limit(1);

        if (lsErr) {
          throw new Error(lsErr.message ?? "Failed to load session");
        }
        if (!lsRows || lsRows.length === 0) {
          toast({
            title: "Session not found",
            description:
              "This session does not exist or you don’t have access.",
            variant: "destructive",
          });
          router.replace(
            segment === "guard"
              ? "/guards/dashboard"
              : "/professionals/dashboard"
          );
          return;
        }

        const ls: LearningSession = lsRows[0];

        // Load scenario
        const { data: scRows, error: scErr } = await supabase
          .from("scenarios")
          .select(
            "id, title, scenario_text, expected_response, cultural_context, difficulty"
          )
          .eq("id", ls.scenario_id)
          .limit(1);

        if (scErr) throw new Error(scErr.message ?? "Failed to load scenario");
        if (!scRows || scRows.length === 0)
          throw new Error("Scenario not found.");

        const sc: Scenario = scRows[0];

        if (!active) return;

        setSession(ls);
        setScenario(sc);

        // Seed chat with intro
        setMessages([
          {
            role: "system",
            content:
              "You are a helpful Arabic/English practice partner for security staff and professionals.",
          },
          {
            role: "assistant",
            content: `Scenario: ${sc.title}\n\n${sc.scenario_text}`,
          },
        ]);
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        console.error("[ChatSession init]", err);
        toast({
          title: "Couldn’t open chat",
          description: err.message,
          variant: "destructive",
        });
        router.replace(
          segment === "guard" ? "/guards/dashboard" : "/professionals/dashboard"
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [sessionId, segment, supabase, router, toast]);

  const sendMessage = React.useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    // Stubbed assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `I heard: "${text}".\n\n(Stubbed reply) Try responding with a polite greeting appropriate to the scenario. ` +
            (scenario?.expected_response
              ? `Example: ${scenario.expected_response}`
              : ""),
        },
      ]);
    }, 350);
  }, [input, scenario?.expected_response]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              <div className="h-64 w-full bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !scenario) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Chat unavailable</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We couldn’t load this session. Please return to your dashboard and
              try again.
            </p>
            <div className="mt-4">
              <Button
                onClick={() =>
                  router.replace(
                    segment === "guard"
                      ? "/guards/dashboard"
                      : "/professionals/dashboard"
                  )
                }
              >
                Back to dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{scenario.title}</h1>
          <p className="text-sm text-muted-foreground">
            Difficulty: {scenario.difficulty}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              segment === "guard"
                ? "/guards/dashboard"
                : "/professionals/dashboard"
            )
          }
        >
          Exit
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          {/* Messages */}
          <div
            className="h-[60vh] overflow-y-auto space-y-3 pr-2"
            role="log"
            aria-live="polite"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={[
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  ].join(" ")}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {m.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="mt-4 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message…"
              className="w-full min-h-[44px] max-h-40 border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={sendMessage} disabled={!input.trim()}>
              Send
            </Button>
          </div>

          {/* Scenario helper */}
          {(scenario.cultural_context || scenario.expected_response) && (
            <div className="mt-4 text-xs text-muted-foreground space-y-1">
              {scenario.cultural_context && (
                <p>
                  <span className="font-medium">Cultural note:</span>{" "}
                  {scenario.cultural_context}
                </p>
              )}
              {scenario.expected_response && (
                <p>
                  <span className="font-medium">Example reply:</span>{" "}
                  {scenario.expected_response}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
