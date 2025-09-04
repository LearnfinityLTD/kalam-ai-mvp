"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/ui/button";
import { Card, CardHeader, CardContent } from "@/ui/card";
import { useToast } from "@/ui/use-toast";
import { Loader2, Send, RotateCcw, BookOpen } from "lucide-react";

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

type UserProfile = {
  english_level?: string;
  dialect?: string;
  full_name?: string;
};

type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
};

export default function ChatSession({ segment }: ChatSessionProps) {
  const supabase = React.useMemo(() => createClient(), []);
  const sp = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const sessionId = sp.get("session") ?? "";

  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [session, setSession] = React.useState<LearningSession | null>(null);
  const [scenario, setScenario] = React.useState<Scenario | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(
    null
  );
  const [conversationId, setConversationId] = React.useState<string | null>(
    null
  );
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [showHelp, setShowHelp] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

        // Get user profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("english_level, dialect, full_name")
          .eq("id", user.id)
          .single();

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
              "This session does not exist or you don't have access.",
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

        // Check if conversation already exists or create new one
        const { data: existingConv } = await supabase
          .from("chat_conversations")
          .select("id, conversation_data")
          .eq("learning_session_id", sessionId)
          .eq("user_id", user.id)
          .single();

        let convId: string;

        if (existingConv) {
          // Load existing conversation
          convId = existingConv.id;
          const savedMessages = existingConv.conversation_data || [];

          if (savedMessages.length > 0) {
            setMessages([
              {
                role: "assistant",
                content: `Welcome back! Let's continue with: ${sc.title}\n\n${sc.scenario_text}`,
                timestamp: new Date().toISOString(),
              },
              ...savedMessages,
            ]);
          } else {
            // Empty conversation, start fresh
            setMessages([
              {
                role: "assistant",
                content: `Scenario: ${sc.title}\n\n${sc.scenario_text}\n\nHow would you respond in this situation?`,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        } else {
          // Create new conversation
          const { data: newConv, error: convErr } = await supabase
            .from("chat_conversations")
            .insert({
              learning_session_id: sessionId,
              user_id: user.id,
              scenario_id: sc.id,
              conversation_data: [],
            })
            .select("id")
            .single();

          if (convErr) throw convErr;

          convId = newConv.id;

          // Seed chat with intro
          setMessages([
            {
              role: "assistant",
              content: `Scenario: ${sc.title}\n\n${sc.scenario_text}\n\nHow would you respond in this situation?`,
              timestamp: new Date().toISOString(),
            },
          ]);
        }

        if (!active) return;

        setSession(ls);
        setScenario(sc);
        setUserProfile(profile);
        setConversationId(convId);
      } catch (e: unknown) {
        const err = e as Error;
        console.error("[ChatSession init]", err);
        toast({
          title: "Couldn't open chat",
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

  const sendMessage = React.useCallback(async () => {
    const text = input.trim();
    if (!text || sending || !conversationId || !scenario) return;

    setSending(true);
    setInput("");

    const userMessage: Msg = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId,
          scenarioId: scenario.id,
          userLevel: userProfile?.english_level || "A1",
          userDialect: userProfile?.dialect || "gulf",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Msg = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Connection Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }, [input, sending, conversationId, scenario, messages, userProfile, toast]);

  const resetConversation = React.useCallback(async () => {
    if (!conversationId || !scenario) return;

    try {
      await supabase
        .from("chat_conversations")
        .update({
          conversation_data: [],
          total_messages: 0,
        })
        .eq("id", conversationId);

      setMessages([
        {
          role: "assistant",
          content: `Let's start fresh! Scenario: ${scenario.title}\n\n${scenario.scenario_text}\n\nHow would you respond in this situation?`,
          timestamp: new Date().toISOString(),
        },
      ]);

      toast({
        title: "Conversation Reset",
        description: "Starting a new conversation for this scenario.",
      });
    } catch (error) {
      console.error("Error resetting conversation:", error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset conversation. Please try again.",
        variant: "destructive",
      });
    }
  }, [conversationId, scenario, supabase, toast]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="text-lg font-semibold">Chat unavailable</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t load this session. Please return to your
              dashboard and try again.
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
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{scenario.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Difficulty: {scenario.difficulty}</span>
            <span>Level: {userProfile?.english_level || "A1"}</span>
            <span>
              Messages: {messages.filter((m) => m.role !== "system").length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Help
          </Button>
          <Button variant="outline" size="sm" onClick={resetConversation}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
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
      </div>

      {/* Help Panel */}
      {showHelp &&
        (scenario.cultural_context || scenario.expected_response) && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="text-sm space-y-2">
                <h3 className="font-medium text-blue-900">Scenario Guidance</h3>
                {scenario.cultural_context && (
                  <p>
                    <span className="font-medium text-blue-800">
                      Cultural note:
                    </span>{" "}
                    <span className="text-blue-700">
                      {scenario.cultural_context}
                    </span>
                  </p>
                )}
                {scenario.expected_response && (
                  <p>
                    <span className="font-medium text-blue-800">
                      Example response:
                    </span>{" "}
                    <span className="text-blue-700">
                      {scenario.expected_response}
                    </span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Chat Interface */}
      <Card className="h-[70vh] flex flex-col">
        <CardContent className="flex-1 flex flex-col pt-4">
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4"
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
                    "max-w-[80%] rounded-lg px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  ].join(" ")}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {m.content}
                  </pre>
                  {m.timestamp && (
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t pt-4">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your response in English..."
                className="flex-1 min-h-[60px] max-h-32 border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={sending}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                size="lg"
                className="px-4 py-3"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Quick tips */}
            <div className="mt-2 text-xs text-muted-foreground">
              Press Enter to send • Shift+Enter for new line • AI will provide
              feedback and corrections
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
