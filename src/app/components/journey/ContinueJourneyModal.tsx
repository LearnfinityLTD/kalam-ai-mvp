// components/journey/ContinueJourneyModal.tsx - Fixed Version
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Clock,
  Target,
  CheckCircle,
  Lock,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Headphones,
  Users,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase";

interface ContinueJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userLevel: string;
  onScenarioStart: (scenarioId: string) => void;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  estimated_duration: number;
  order_index: number;
  status?: "completed" | "available" | "locked";
}

interface UserProgress {
  user_id: string;
  scenario_id: string;
  completion_status: "completed" | "in_progress" | "not_started";
  started_at?: string;
  completed_at?: string;
  score?: number;
}

interface DebugInfo {
  connectionTest?: unknown;
  connectionError?: unknown;
  allowedDifficulties?: string[];
  progressData?: UserProgress[] | null;
  progressError?: unknown;
  scenariosData?: number;
  scenariosError?: unknown;
  sampleDifficulties?: string[];
  error?: string;
}

export function ContinueJourneyModal({
  isOpen,
  onClose,
  userId,
  userLevel,
  onScenarioStart,
}: ContinueJourneyModalProps) {
  const { t } = useI18n();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      loadJourneyData();
    }
  }, [isOpen, userId]);

  // Convert user level to allowed difficulties
  const getLevelDifficulties = (level: string) => {
    const levelMap: Record<string, string[]> = {
      A1: ["a1"],
      A2: ["a1", "a2"],
      B1: ["a1", "a2", "b1"],
      B2: ["a1", "a2", "b1", "b2"],
      C1: ["a1", "a2", "b1", "b2", "c1"],
    };
    return levelMap[level] || ["a1"];
  };

  const loadJourneyData = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Loading journey data for:", { userId, userLevel });

      const allowedDifficulties = getLevelDifficulties(userLevel);
      console.log("📊 Allowed difficulties:", allowedDifficulties);

      // Test database connection first
      const { data: connectionTest, error: connectionError } = await supabase
        .from("scenarios")
        .select("count")
        .limit(1);

      console.log("📡 Database connection test:", {
        connectionTest,
        connectionError,
      });
      setDebugInfo((prev) => ({
        ...prev,
        connectionTest,
        connectionError,
        allowedDifficulties,
      }));

      if (connectionError) {
        throw new Error(
          `Database connection failed: ${connectionError.message}`
        );
      }

      // Get user's progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);

      console.log("📊 User progress:", { progressData, progressError });
      setDebugInfo((prev) => ({ ...prev, progressData, progressError }));

      if (progressError) {
        console.warn("Progress error (might be expected):", progressError);
      }

      // Get available scenarios for user's allowed difficulty levels
      const { data: scenariosData, error: scenariosError } = await supabase
        .from("scenarios")
        .select("*")
        .eq("segment", "guard")
        .in("difficulty", allowedDifficulties)
        .order("order_index");

      console.log("🎯 Scenarios data:", {
        scenariosData: scenariosData?.length,
        scenariosError,
        sampleScenario: scenariosData?.[0],
      });
      setDebugInfo((prev) => ({
        ...prev,
        scenariosData: scenariosData?.length,
        scenariosError,
        sampleDifficulties: scenariosData?.map((s) => s.difficulty),
      }));

      if (scenariosError) {
        throw new Error(`Failed to load scenarios: ${scenariosError.message}`);
      }

      // Process scenarios with progress status
      const completedScenarioIds =
        progressData?.map((p) => p.scenario_id) || [];
      const processedScenarios = (scenariosData || []).map((scenario) => ({
        ...scenario,
        status: completedScenarioIds.includes(scenario.id)
          ? ("completed" as const)
          : ("available" as const), // For now, make all non-completed scenarios available
      }));

      console.log("✅ Processed scenarios:", processedScenarios.length);
      setScenarios(processedScenarios);
      setUserProgress(progressData as UserProgress[] | null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load journey data";
      console.error("❌ Error loading journey data:", error);
      setError(errorMessage);
      setDebugInfo((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleStartScenario = async (scenarioId: string) => {
    try {
      // Update progress in database
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          scenario_id: scenarioId,
          completion_status: "in_progress" as const,
          started_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,scenario_id",
        }
      );

      if (error) {
        setError(error.message || "Failed to load journey data");
      }

      onScenarioStart(scenarioId);
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error starting scenario:", errorMessage);
      setError(errorMessage);
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return <MessageCircle className="w-5 h-5" />;
      case "listening":
        return <Headphones className="w-5 h-5" />;
      case "vocabulary":
        return <BookOpen className="w-5 h-5" />;
      case "cultural":
        return <Users className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  // Find the next recommended scenario (first available one by order)
  const nextScenario = scenarios
    .filter((s) => s.status === "available")
    .sort((a, b) => a.order_index - b.order_index)[0];

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading your learning journey...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Target className="w-6 h-6 text-blue-600" />
            Continue Your Learning Journey
          </DialogTitle>
          <DialogDescription>
            Pick up where you left off and continue building your English skills
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error: {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === "development" && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-sm">Debug Info (Dev Only)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overall Progress</span>
                <Badge variant="outline">{userLevel} Level</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Scenarios Completed</span>
                  <span>
                    {scenarios.filter((s) => s.status === "completed").length} /{" "}
                    {scenarios.length}
                  </span>
                </div>
                <Progress
                  value={
                    scenarios.length > 0
                      ? (scenarios.filter((s) => s.status === "completed")
                          .length /
                          scenarios.length) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Next Recommended Scenario */}
          {nextScenario && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Play className="w-5 h-5" />
                  Next Recommended
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-blue-900 mb-2">
                      {nextScenario.title}
                    </h3>
                    <p className="text-blue-700 mb-3">
                      {nextScenario.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-blue-600">
                      <div className="flex items-center gap-1">
                        {getScenarioIcon(nextScenario.type)}
                        <span className="capitalize">{nextScenario.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{nextScenario.estimated_duration} min</span>
                      </div>
                      <Badge variant="secondary">
                        {nextScenario.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartScenario(nextScenario.id)}
                    className="ml-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Start Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Scenarios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Scenarios</h3>

            {scenarios.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">
                    No scenarios found for {userLevel} level
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Check that scenarios exist with the correct difficulty
                    levels.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`border transition-all ${
                      scenario.status === "completed"
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white hover:border-blue-300 cursor-pointer hover:shadow-md"
                    }`}
                    onClick={() => {
                      if (scenario.status === "available") {
                        handleStartScenario(scenario.id);
                      }
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {scenario.status === "completed" ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              getScenarioIcon(scenario.type)
                            )}
                            <h4 className="font-semibold">{scenario.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {scenario.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="capitalize">{scenario.type}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{scenario.estimated_duration} min</span>
                            </div>
                            <Badge variant="secondary">
                              {scenario.difficulty.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        {scenario.status === "available" && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartScenario(scenario.id);
                            }}
                            size="sm"
                            className="ml-4"
                          >
                            Start
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  // Navigate to the comprehensive learning path page
                  const params = new URLSearchParams({
                    userId: userId,
                    level: userLevel,
                  });
                  window.open(
                    `/guards/learning-path?${params.toString()}`,
                    "_blank"
                  );
                }}
              >
                View Full Learning Path
              </Button>
              {nextScenario && (
                <Button
                  onClick={() => handleStartScenario(nextScenario.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue Journey
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
