import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// Define types for the request body
interface UpdateProgressRequest {
  scenarioId?: string;
  pathId?: string; // Added this for dashboard compatibility
  completed?: boolean;
  score?: number | null;
  nextRecommendedScenario?: string | null;
  status?: string; // Added for dashboard status updates
}

// Define types for database responses
interface UserLearningPath {
  completed_scenarios: string[] | null;
  progress_percentage: number | null;
  recommended_scenarios: string[] | null;
}

interface UserJourneyProgress {
  scenarios_completed: number | null;
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateProgressRequest = await request.json();
    const {
      scenarioId,
      pathId, // Handle pathId from dashboard
      completed = false,
      score = null,
      nextRecommendedScenario = null,
      status,
    } = body;

    // Use scenarioId if provided, otherwise use pathId (for backward compatibility)
    const currentScenarioId = scenarioId || pathId;

    // Handle status updates (for starting learning paths)
    if (status === "started" && pathId) {
      const { error: statusError } = await supabase
        .from("user_journey_progress")
        .update({
          journey_status: "in_progress",
          current_unit_id: pathId,
          last_activity: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (statusError) {
        console.error("Failed to update status:", statusError);
        return NextResponse.json(
          { error: "Failed to update learning path status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        updated: {
          statusUpdated: true,
          pathStarted: true,
        },
      });
    }

    // Update user progress for completed scenarios
    if (completed && currentScenarioId) {
      // Add to completed scenarios
      const { data: rawCurrentPath, error: pathError } = await supabase
        .from("user_learning_paths")
        .select(
          "completed_scenarios, progress_percentage, recommended_scenarios"
        )
        .eq("user_id", user.id)
        .single();

      if (pathError) {
        console.error("Failed to fetch user learning path:", pathError);
        return NextResponse.json(
          { error: "Failed to fetch user learning path" },
          { status: 500 }
        );
      }

      const currentPath = rawCurrentPath as UserLearningPath | null;

      if (currentPath) {
        const existingCompleted = currentPath.completed_scenarios || [];

        // Avoid duplicate scenario completion
        if (!existingCompleted.includes(currentScenarioId)) {
          const completedScenarios = [...existingCompleted, currentScenarioId];
          const totalScenarios = currentPath.recommended_scenarios?.length || 1;
          const newProgress = Math.min(
            Math.round((completedScenarios.length / totalScenarios) * 100),
            100
          );

          const { error: updatePathError } = await supabase
            .from("user_learning_paths")
            .update({
              completed_scenarios: completedScenarios,
              progress_percentage: newProgress,
              current_scenario: nextRecommendedScenario,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

          if (updatePathError) {
            console.error(
              "Failed to update user learning path:",
              updatePathError
            );
            return NextResponse.json(
              { error: "Failed to update learning path" },
              { status: 500 }
            );
          }
        }
      }
    }

    // Update journey progress
    const updates: Record<string, unknown> = {
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (currentScenarioId) {
      updates.current_scenario_id = currentScenarioId;
    }

    if (nextRecommendedScenario) {
      updates.next_recommended_scenario = nextRecommendedScenario;
    }

    if (completed) {
      // Increment scenarios completed
      const { data: rawCurrentProgress, error: progressError } = await supabase
        .from("user_journey_progress")
        .select("scenarios_completed")
        .eq("user_id", user.id)
        .single();

      if (progressError) {
        console.error("Failed to fetch user journey progress:", progressError);
        // Continue with update even if we can't fetch current progress
        updates.scenarios_completed = 1;
      } else {
        const currentProgress =
          rawCurrentProgress as UserJourneyProgress | null;
        const currentCount = Number(currentProgress?.scenarios_completed || 0);
        updates.scenarios_completed = currentCount + 1;
      }
    }

    const { error: updateError } = await supabase
      .from("user_journey_progress")
      .update(updates)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to update journey progress:", updateError);
      return NextResponse.json(
        { error: "Failed to update journey progress" },
        { status: 500 }
      );
    }

    // Optional: Record score if provided
    if (score !== null && currentScenarioId) {
      // You could save this to a scores table for analytics
      console.log(
        `User ${user.id} scored ${score} on scenario ${currentScenarioId}`
      );

      // Optional: Save to scenario_results table
      try {
        await supabase.from("scenario_results").insert({
          user_id: user.id,
          scenario_id: currentScenarioId,
          overall_score: score,
          completion_time_minutes: null, // You could track this
          completed_at: new Date().toISOString(),
        });
      } catch (scoreError) {
        console.error("Failed to save score:", scoreError);
        // Don't fail the entire request for score saving issues
      }
    }

    return NextResponse.json({
      success: true,
      updated: {
        scenarioCompleted: completed,
        progressUpdated: completed && currentScenarioId,
        journeyUpdated: true,
        scoreRecorded: score !== null,
      },
    });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      {
        error: "Failed to update progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
