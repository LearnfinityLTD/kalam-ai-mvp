import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Star,
  Play,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";

export interface PersonalizedUserProfile {
  id: string;
  user_type: string;
  full_name: string;
  english_level: string;
  assessment_score: number;
  strengths: string[];
  recommendations: string[];
  total_challenges_completed: number;
  average_challenge_score: number;
  current_streak?: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  estimated_hours: number;
  total_modules: number;
  specialization: string;
}

interface PersonalizedRecommendation {
  primaryPath: LearningPath;
  secondaryPaths: LearningPath[];
  priorityAreas: string[];
  estimatedTimeToComplete: number;
  confidence: number;
  reasoning: string;
}

interface AdaptiveRecommendation {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface UserProgress {
  scenarios_completed: number;
  total_scenarios: number;
  last_activity: string;
  journey_status: string;
}

interface DashboardProps {
  userData: PersonalizedUserProfile;
  userId: string;
  userType?: string;
}

export default function PersonalizedDashboard({
  userData,
  userId,
  userType,
}: DashboardProps) {
  const [recommendation, setRecommendation] =
    useState<PersonalizedRecommendation | null>(null);
  const [adaptiveRecs, setAdaptiveRecs] = useState<AdaptiveRecommendation[]>(
    []
  );
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setError(null);
      const response = await fetch("/api/learning-paths/user");

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      const data = await response.json();

      setProgress(data.progress);
      setRecommendation(data.recommendation);
      setAdaptiveRecs(data.recommendations || []);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
    }
  };

  const generatePersonalizedPath = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/learning-paths/generate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to generate path: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setRecommendation(data.recommendation);
        await fetchUserData();
      } else {
        throw new Error(data.error || "Failed to generate learning path");
      }
    } catch (error) {
      console.error("Failed to generate path:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate learning path"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const regeneratePath = async () => {
    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/learning-paths/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "performance_update" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to regenerate path: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setRecommendation(data.recommendation);
        await fetchUserData();
      } else {
        throw new Error(data.error || "Failed to regenerate learning path");
      }
    } catch (error) {
      console.error("Failed to regenerate path:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to regenerate learning path"
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const startLearningPath = async () => {
    if (!recommendation?.primaryPath) return;

    try {
      const response = await fetch("/api/learning-paths/update-progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathId: recommendation.primaryPath.id,
          status: "started",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start path: ${response.statusText}`);
      }

      window.location.href = "/scenarios";
    } catch (error) {
      console.error("Failed to start path:", error);
      setError("Failed to start learning path");
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading dashboard</span>
            </div>
            <p className="text-red-700 dark:text-red-400 mt-2">{error}</p>
            <Button
              onClick={fetchUserData}
              variant="outline"
              className="mt-4 border-red-300 text-red-800 hover:bg-red-100"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Personalized Learning Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            AI-powered recommendations based on your assessment and progress
          </p>
        </div>

        {recommendation && (
          <Button
            onClick={regeneratePath}
            disabled={isRegenerating}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
            />
            Update Path
          </Button>
        )}
      </div>

      {/* User Profile Summary */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <User className="w-5 h-5" />
            Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Role
              </div>
              <Badge variant="secondary" className="mt-1">
                {userData.user_type?.toUpperCase() || "GUARD"}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                English Level
              </div>
              <Badge variant="outline" className="mt-1">
                {userData.english_level || "A1"}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Assessment Score
              </div>
              <div className="text-2xl font-bold text-blue-600 mt-1">
                {userData.assessment_score || 0}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Challenges Completed
              </div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {userData.total_challenges_completed || 0}
              </div>
            </div>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Your Strengths
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.strengths.map((strength: string, index: number) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {strength}
                  </Badge>
                ))}
                {userData.strengths.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Complete more activities to identify strengths
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Focus Areas
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.recommendations.map((rec: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-orange-600 border-orange-300"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    {rec}
                  </Badge>
                ))}
                {userData.recommendations.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Focus areas will appear after assessment
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Recommendations */}
      {adaptiveRecs.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <TrendingUp className="w-5 h-5" />
              Real-time Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adaptiveRecs.map((rec, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === "high"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : rec.priority === "medium"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      className={`w-4 h-4 mt-0.5 ${
                        rec.priority === "high"
                          ? "text-red-500"
                          : rec.priority === "medium"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}
                    />
                    <div>
                      <div className="font-medium dark:text-white">
                        {rec.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {rec.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI-Generated Learning Path */}
      {recommendation ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Your AI-Generated Learning Path
              <Badge variant="secondary" className="ml-2">
                {recommendation.confidence}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Primary Path */}
              <div className="border-2 border-emerald-200 dark:border-emerald-700 rounded-lg p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-semibold dark:text-white">
                        Recommended: {recommendation.primaryPath.name}
                      </h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {recommendation.primaryPath.description}
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm dark:text-gray-300">
                          {recommendation.estimatedTimeToComplete} hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm dark:text-gray-300">
                          {recommendation.primaryPath.total_modules} modules
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-sm dark:text-gray-300">
                          {recommendation.primaryPath.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Priority Focus Areas:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.priorityAreas.map((area, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="dark:border-gray-600 dark:text-gray-300"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-sm">
                      <strong className="dark:text-white">AI Reasoning:</strong>
                      <span className="dark:text-gray-300 ml-1">
                        {recommendation.reasoning}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={startLearningPath}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning Path
                  </Button>
                  <Button
                    variant="outline"
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    View Full Curriculum
                  </Button>
                </div>
              </div>

              {/* Secondary Paths */}
              {recommendation.secondaryPaths.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Alternative Recommendations
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendation.secondaryPaths.map((path, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 dark:border-gray-700 dark:bg-gray-800/50"
                      >
                        <h5 className="font-medium mb-2 dark:text-white">
                          {path.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {path.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{path.estimated_hours}h</span>
                          <span>{path.total_modules} modules</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 dark:border-gray-600"
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Learn More
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Generate Your Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 dark:text-white">
                Ready to create your personalized learning journey?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our AI will analyze your assessment results, strengths, and
                learning goals to create a customized path just for you.
              </p>
              <Button
                onClick={generatePersonalizedPath}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Generate My Learning Path
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Progress */}
      {progress && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <TrendingUp className="w-5 h-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 dark:text-gray-300">
                  <span>Overall Progress</span>
                  <span>
                    {progress.scenarios_completed || 0}/
                    {progress.total_scenarios || 0} scenarios
                  </span>
                </div>
                <Progress
                  value={
                    progress.total_scenarios && progress.total_scenarios > 0
                      ? (progress.scenarios_completed /
                          progress.total_scenarios) *
                        100
                      : 0
                  }
                  className="h-3"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {progress.scenarios_completed || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Scenarios Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userData.average_challenge_score || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Score
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userData.current_streak || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Day Streak
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
