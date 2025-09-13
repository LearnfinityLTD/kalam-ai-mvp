// Enhanced Learning Path Page that integrates with your scenario database
// Replace your current /guards/learning-path/page.tsx

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase";
import {
  CheckCircle,
  Lock,
  Play,
  Clock,
  Target,
  MessageCircle,
  Headphones,
  BookOpen,
  Users,
  ArrowLeft,
} from "lucide-react";

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

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  scenarios: Scenario[];
  totalDuration: number;
  completedCount: number;
}

interface UserProgress {
  user_id: string;
  scenario_id: string;
  completion_status: "completed" | "in_progress" | "not_started";
  started_at?: string;
  completed_at?: string;
  score?: number;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function FullLearningPathPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const userId = searchParams.get("userId") || "";
  const userLevel = searchParams.get("level") || "A1";

  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    if (userId) {
      loadLearningPaths();
    }
  }, [userId, userLevel]);

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

  const loadLearningPaths = async () => {
    try {
      const allowedDifficulties = getLevelDifficulties(userLevel);

      // Get user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);

      setUserProgress(progressData || []);

      // Get all scenarios for allowed difficulties
      const { data: scenariosData } = await supabase
        .from("scenarios")
        .select("*")
        .eq("segment", "guard")
        .in("difficulty", allowedDifficulties)
        .order("order_index");

      if (scenariosData) {
        // Group scenarios by difficulty level to create learning paths
        const pathsMap: Record<string, Scenario[]> = {};

        scenariosData.forEach((scenario) => {
          const difficulty = scenario.difficulty;
          if (!pathsMap[difficulty]) {
            pathsMap[difficulty] = [];
          }

          // Determine scenario status
          const isCompleted = progressData?.some(
            (p) =>
              p.scenario_id === scenario.id &&
              p.completion_status === "completed"
          );

          // Unlock logic: A1 always available, others unlock when previous level completed
          const isAvailable =
            difficulty === "a1" ||
            pathsMap[getPreviousDifficulty(difficulty)]?.every(
              (s) => s.status === "completed"
            );

          pathsMap[difficulty].push({
            ...scenario,
            status: isCompleted
              ? "completed"
              : isAvailable
              ? "available"
              : "locked",
          });
        });

        // Convert to learning paths structure
        const paths: LearningPath[] = Object.entries(pathsMap).map(
          ([difficulty, scenarios]) => {
            const completedCount = scenarios.filter(
              (s) => s.status === "completed"
            ).length;
            const totalDuration = scenarios.reduce(
              (sum, s) => sum + s.estimated_duration,
              0
            );

            return {
              id: difficulty,
              title: getDifficultyTitle(difficulty),
              description: getDifficultyDescription(difficulty),
              difficulty,
              scenarios,
              totalDuration,
              completedCount,
            };
          }
        );

        setLearningPaths(
          paths.sort(
            (a, b) =>
              getDifficultyOrder(a.difficulty) -
              getDifficultyOrder(b.difficulty)
          )
        );
      }
    } catch (error) {
      console.error("Error loading learning paths:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPreviousDifficulty = (current: string): string => {
    const order = ["a1", "a2", "b1", "b2", "c1"];
    const index = order.indexOf(current);
    return index > 0 ? order[index - 1] : "";
  };

  const getDifficultyOrder = (difficulty: string): number => {
    const order = ["a1", "a2", "b1", "b2", "c1"];
    return order.indexOf(difficulty);
  };

  const getDifficultyTitle = (difficulty: string): string => {
    const titles = {
      a1: "Foundation Level",
      a2: "Elementary Level",
      b1: "Intermediate Level",
      b2: "Upper Intermediate Level",
      c1: "Advanced Level",
    };
    return (
      titles[difficulty as keyof typeof titles] || difficulty.toUpperCase()
    );
  };

  const getDifficultyDescription = (difficulty: string): string => {
    const descriptions = {
      a1: "Basic mosque security fundamentals and Islamic etiquette",
      a2: "Building confidence with visitor management and crowd control",
      b1: "Advanced communication and cultural sensitivity scenarios",
      b2: "Complex security situations and crisis management",
      c1: "Leadership, training, and expert-level responsibilities",
    };
    return descriptions[difficulty as keyof typeof descriptions] || "";
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return <MessageCircle className="w-4 h-4" />;
      case "listening":
        return <Headphones className="w-4 h-4" />;
      case "vocabulary":
        return <BookOpen className="w-4 h-4" />;
      case "cultural":
        return <Users className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const handleStartScenario = async (scenarioId: string) => {
    try {
      await supabase.from("user_progress").upsert(
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

      router.push(`/guards/scenarios/${scenarioId}`);
    } catch (error) {
      console.error("Error starting scenario:", error);
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Your Complete Learning Path
              </h1>
              <p className="text-gray-600">
                Progress through structured levels to master mosque security
                communication
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {userLevel} Level
            </Badge>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="space-y-8">
          {learningPaths.map((path, pathIndex) => {
            const isUnlocked =
              pathIndex === 0 ||
              learningPaths[pathIndex - 1]?.completedCount ===
                learningPaths[pathIndex - 1]?.scenarios.length;

            return (
              <Card
                key={path.id}
                className={`${!isUnlocked ? "opacity-60" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!isUnlocked && (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {path.title}
                          <Badge variant="secondary">
                            {path.difficulty.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{path.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {path.completedCount}/{path.scenarios.length} completed
                      </div>
                      <div className="text-sm text-gray-500">
                        {path.totalDuration} min total
                      </div>
                    </div>
                  </div>

                  <Progress
                    value={
                      path.scenarios.length > 0
                        ? (path.completedCount / path.scenarios.length) * 100
                        : 0
                    }
                    className="mt-4"
                  />
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {path.scenarios.map((scenario) => (
                      <Card
                        key={scenario.id}
                        className={`border transition-all ${
                          scenario.status === "completed"
                            ? "border-green-200 bg-green-50"
                            : scenario.status === "available"
                            ? "border-blue-200 hover:border-blue-300 cursor-pointer hover:shadow-md"
                            : "border-gray-200 bg-gray-50"
                        }`}
                        onClick={() => {
                          if (scenario.status === "available") {
                            handleStartScenario(scenario.id);
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {scenario.status === "completed" ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : scenario.status === "available" ? (
                                getScenarioIcon(scenario.type)
                              ) : (
                                <Lock className="w-5 h-5 text-gray-400" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight mb-2">
                                {scenario.title}
                              </h4>

                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <span className="capitalize">
                                  {scenario.type}
                                </span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>{scenario.estimated_duration}min</span>
                              </div>

                              {scenario.status === "available" && (
                                <Button
                                  size="sm"
                                  className="w-full mt-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartScenario(scenario.id);
                                  }}
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  Start
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FullLearningPathPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FullLearningPathPageContent />
    </Suspense>
  );
}
