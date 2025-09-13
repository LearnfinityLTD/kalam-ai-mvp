import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { generateAndSavePersonalizedPath } from "@/lib/ai-learning-path-generator";
// Define types for better type safety
interface ChallengeResult {
  score: number;
  challenge_type: string;
  user_id: string;
  completed_at: string;
}

interface ScenarioResult {
  overall_score: number;
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
  supabase: any
): Promise<AdaptiveRecommendation[]> {
  // Get user's recent performance
  const { data: recentResults } = await supabase
    .from("challenge_results")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(10);

  const { data: scenarioResults } = await supabase
    .from("scenario_results")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(5);

  // Analyze performance patterns with proper typing
  const avgChallengeScore =
    recentResults?.reduce(
      (sum: number, r: ChallengeResult) => sum + r.score,
      0
    ) / (recentResults?.length || 1);
  const avgScenarioScore =
    scenarioResults?.reduce(
      (sum: number, r: ScenarioResult) => sum + r.overall_score,
      0
    ) / (scenarioResults?.length || 1);

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

  return recommendations;
}
