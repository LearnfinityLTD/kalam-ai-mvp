import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { generateAndSavePersonalizedPath } from "@/lib/ai-learning-path-generator";

// Define types for better type safety
interface ChallengeResult {
  score: number | null;
  challenge_type: string;
}

interface ScenarioResult {
  overall_score: number | null;
  cultural_sensitivity_score: number | null;
  english_proficiency_score: number | null;
}

interface UserProfile {
  id: string;
  total_challenges_completed: number;
  average_challenge_score: number;
  [key: string]: any;
}

// app/api/learning-paths/regenerate/route.ts
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reason = "user_request" } = body;

    // Fetch updated user performance data
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Calculate new assessment metrics based on recent performance
    const { data: recentChallenges } = await supabase
      .from("challenge_results")
      .select("score, challenge_type")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(20);

    const { data: recentScenarios } = await supabase
      .from("scenario_results")
      .select(
        "overall_score, cultural_sensitivity_score, english_proficiency_score"
      )
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(10);

    // Update user profile with new metrics
    if (recentChallenges && recentChallenges.length > 0) {
      const avgScore =
        recentChallenges.reduce(
          (sum: number, c: ChallengeResult) => sum + (c.score ?? 0),
          0
        ) / recentChallenges.length;

      const updateData = {
        average_challenge_score: Math.round(avgScore),
        total_challenges_completed: Math.max(
          userProfile.total_challenges_completed,
          recentChallenges.length
        ),
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) {
        console.error("Failed to update user profile:", updateError);
        // Continue despite update error
      }
    }

    // Analyze scenario performance for additional insights
    if (recentScenarios && recentScenarios.length > 0) {
      const avgOverallScore =
        recentScenarios.reduce(
          (sum: number, s: ScenarioResult) =>
            sum + Number(s.overall_score ?? 0),
          0
        ) / recentScenarios.length;

      const avgCulturalScore =
        recentScenarios.reduce(
          (sum: number, s: ScenarioResult) =>
            sum + Number(s.cultural_sensitivity_score ?? 0),
          0
        ) / recentScenarios.length;

      const avgEnglishScore =
        recentScenarios.reduce(
          (sum: number, s: ScenarioResult) =>
            sum + Number(s.english_proficiency_score ?? 0),
          0
        ) / recentScenarios.length;

      // Update additional metrics based on scenario performance
      const scenarioUpdateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Determine new strengths based on performance
      const newStrengths: string[] = [];
      if (avgCulturalScore > 80) newStrengths.push("Cultural Sensitivity");
      if (avgEnglishScore > 80) newStrengths.push("English Proficiency");
      if (avgOverallScore > 85) newStrengths.push("Strong Performance");

      if (newStrengths.length > 0) {
        scenarioUpdateData.strengths = newStrengths;
      }

      // Generate new recommendations based on weak areas
      const newRecommendations: string[] = [];
      if (avgCulturalScore < 60) {
        newRecommendations.push("Focus on cultural context and sensitivity");
      }
      if (avgEnglishScore < 60) {
        newRecommendations.push("Practice English fundamentals");
      }
      if (avgOverallScore < 50) {
        newRecommendations.push("Review basic concepts and practice more");
      }

      if (newRecommendations.length > 0) {
        scenarioUpdateData.recommendations = newRecommendations;
      }

      // Only update if we have new data to add
      if (Object.keys(scenarioUpdateData).length > 1) {
        const { error: scenarioUpdateError } = await supabase
          .from("user_profiles")
          .update(scenarioUpdateData)
          .eq("id", user.id);

        if (scenarioUpdateError) {
          console.error(
            "Failed to update scenario metrics:",
            scenarioUpdateError
          );
          // Continue despite update error
        }
      }
    }

    // Regenerate learning path with updated data
    const recommendation = await generateAndSavePersonalizedPath(user.id);

    // Log the regeneration
    const { error: journeyUpdateError } = await supabase
      .from("user_journey_progress")
      .update({
        journey_status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (journeyUpdateError) {
      console.error("Failed to update journey progress:", journeyUpdateError);
      // Continue despite update error
    }

    return NextResponse.json({
      success: true,
      recommendation,
      reason,
      performance_update: {
        challenges_analyzed: recentChallenges?.length || 0,
        scenarios_analyzed: recentScenarios?.length || 0,
      },
    });
  } catch (error) {
    console.error("Regenerate learning path error:", error);
    return NextResponse.json(
      {
        error: "Failed to regenerate learning path",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
