import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

// Define types for better type safety
interface ChallengeResult {
  score: number | null;
  challenge_type: string;
  user_id: string;
  completed_at: string;
}

interface ScenarioResult {
  overall_score: number | null;
  cultural_sensitivity_score: number | null;
  english_proficiency_score: number | null;
  user_id: string;
  completed_at: string;
}

interface AdaptiveRecommendation {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

// app/api/learning-paths/user/route.ts
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's current learning path progress
    const { data: userProgress, error: progressError } = await supabase
      .from("user_journey_progress")
      .select(
        `
        *,
        current_unit:learning_paths!current_unit_id(*),
        current_scenario:scenarios!current_scenario_id(*),
        next_scenario:scenarios!next_recommended_scenario(*)
      `
      )
      .eq("user_id", user.id)
      .single();

    if (progressError) {
      return NextResponse.json(
        { error: "User progress not found" },
        { status: 404 }
      );
    }

    // Fetch user's personalized learning paths
    const { data: learningPaths, error: pathsError } = await supabase
      .from("user_learning_paths")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (pathsError) {
      return NextResponse.json(
        { error: "Learning paths not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      progress: userProgress,
      learningPaths,
      recommendations: await getAdaptiveRecommendations(user.id, supabase),
    });
  } catch (error) {
    console.error("Get learning path error:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning path" },
      { status: 500 }
    );
  }
}

async function getAdaptiveRecommendations(
  userId: string,
  supabase: SupabaseClient
): Promise<AdaptiveRecommendation[]> {
  // Get user's recent performance
  const { data: rawRecentResults } = await supabase
    .from("challenge_results")
    .select("score, challenge_type, user_id, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(10);

  const { data: rawScenarioResults } = await supabase
    .from("scenario_results")
    .select(
      "overall_score, cultural_sensitivity_score, english_proficiency_score, user_id, completed_at"
    )
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(5);

  // Type the data properly
  const recentResults = rawRecentResults as ChallengeResult[] | null;
  const scenarioResults = rawScenarioResults as ScenarioResult[] | null;

  // Analyze performance patterns with proper typing
  const avgChallengeScore =
    recentResults && recentResults.length > 0
      ? recentResults.reduce(
          (sum: number, r: ChallengeResult) => sum + Number(r.score ?? 0),
          0
        ) / recentResults.length
      : 0;

  const avgScenarioScore =
    scenarioResults && scenarioResults.length > 0
      ? scenarioResults.reduce(
          (sum: number, r: ScenarioResult) =>
            sum + Number(r.overall_score ?? 0),
          0
        ) / scenarioResults.length
      : 0;

  // Generate adaptive recommendations
  const recommendations: AdaptiveRecommendation[] = [];

  if (avgChallengeScore < 60) {
    recommendations.push({
      type: "practice_more",
      title: "Additional Practice Recommended",
      description: "Focus on challenge exercises to strengthen fundamentals",
      priority: "high",
    });
  }

  if (avgScenarioScore > 80) {
    recommendations.push({
      type: "level_up",
      title: "Ready for Advanced Content",
      description: "Consider moving to more challenging scenarios",
      priority: "medium",
    });
  }

  // Additional recommendations based on performance patterns
  if (recentResults && recentResults.length >= 3) {
    const recentScores = recentResults.map((r) => Number(r.score ?? 0));
    const hasConsistentLowScores = recentScores.every((score) => score < 50);

    if (hasConsistentLowScores) {
      recommendations.push({
        type: "review_basics",
        title: "Review Fundamentals",
        description: "Consider reviewing basic concepts before advancing",
        priority: "high",
      });
    }
  }

  if (scenarioResults && scenarioResults.length >= 2) {
    const culturalScores = scenarioResults
      .map((r) => Number(r.cultural_sensitivity_score ?? 0))
      .filter((score) => score > 0);

    if (culturalScores.length > 0) {
      const avgCultural =
        culturalScores.reduce((sum, score) => sum + score, 0) /
        culturalScores.length;

      if (avgCultural < 60) {
        recommendations.push({
          type: "cultural_focus",
          title: "Cultural Sensitivity Training",
          description: "Focus on cultural context and appropriate responses",
          priority: "medium",
        });
      }
    }
  }

  return recommendations;
}
