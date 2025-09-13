"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, TrendingUp, AlertCircle } from "lucide-react";

interface ProgressData {
  completed: number;
  total: number;
  streak: number;
  weeklyGoal: number;
  completionRate: number; // % with score >= 70
  averageScore: number; // avg of user_progress.score
}

export default function ProgressTracker({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<ProgressData>({
    completed: 0,
    total: 0,
    streak: 0,
    weeklyGoal: 5,
    completionRate: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) TOTAL SCENARIOS (guards)
      const { count: totalCount, error: totalErr } = await supabase
        .from("scenarios")
        .select("id", { count: "exact", head: true })
        .eq("segment", "guard");
      if (totalErr) throw totalErr;

      // 2) COMPLETED PROGRESS FOR USER
      const { data: completedRows, error: compErr } = await supabase
        .from("user_progress")
        .select("score,last_attempt")
        .eq("user_id", userId)
        .eq("completion_status", "completed");
      if (compErr) throw compErr;

      const completed = completedRows?.length ?? 0;

      // Average score (ignore null)
      const numericScores =
        completedRows
          ?.map((r) => (typeof r.score === "number" ? r.score : null))
          .filter((s): s is number => s !== null) ?? [];
      const averageScore =
        numericScores.length > 0
          ? Math.round(
              (numericScores.reduce((a, b) => a + b, 0) /
                numericScores.length) *
                10
            ) / 10
          : 0;

      // Success rate = % of scores >= 70 among scored items
      const passing =
        numericScores.length > 0
          ? Math.round(
              (numericScores.filter((s) => s >= 70).length /
                numericScores.length) *
                100
            )
          : 0;

      // 3) WEEKLY COMPLETIONS (for weekly goal)
      const oneWeekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        // trim milliseconds because Postgres may store without them
        .replace(/\.\d{3}Z$/, "Z");

      const { error: weeklyErr } = await supabase
        .from("user_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completion_status", "completed")
        .gte("last_attempt", oneWeekAgoIso);
      if (weeklyErr) throw weeklyErr;

      // 4) STREAK
      const { data: streakRow } = await supabase
        .from("user_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle();
      const streak = streakRow?.current_streak ?? 0;

      setProgress({
        completed,
        total: totalCount ?? 0,
        streak,
        weeklyGoal: 5,
        completionRate: passing,
        averageScore,
      });
    } catch (e) {
      console.error(e);
      setError("Failed to load progress data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [supabase, userId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="ml-2 text-gray-600">Loading progress…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={fetchProgress}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Try Again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completionPct =
    progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  const weeklyProgress = Math.min(
    ((progress.completed ?? 0) / progress.weeklyGoal) * 100,
    100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Progress */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Completion
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {progress.completed}/{progress.total} scenarios
              </span>
            </div>
            <Progress value={completionPct} className="h-3" />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(completionPct)}% complete
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Weekly Goal
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.min(progress.completed, progress.weeklyGoal)}/
                {progress.weeklyGoal} this week
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {weeklyProgress >= 100
                ? "Goal achieved! 🎉"
                : `${Math.round(weeklyProgress)}% of weekly goal`}
            </p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {progress.averageScore}%
              </p>
              <p className="text-xs text-gray-500">Average Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {progress.completionRate}%
              </p>
              <p className="text-xs text-gray-500">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak & Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-orange-600 mb-2">
              <Flame className="w-8 h-8 mr-2" />
              <span className="text-3xl font-bold">{progress.streak}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">day streak</p>
            <Badge
              variant={
                progress.streak >= 7
                  ? "default"
                  : progress.streak >= 3
                  ? "secondary"
                  : "outline"
              }
            >
              {progress.streak >= 7
                ? "Amazing!"
                : progress.streak >= 3
                ? "Great job!"
                : "Keep going!"}
            </Badge>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Difficulty Level</span>
              <Badge variant="secondary">Beginner</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Next Milestone</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.max(progress.total - progress.completed, 0)} scenarios
                left
              </span>
            </div>

            {progress.streak === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-yellow-800">
                  💡 Complete a scenario today to start your streak!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
