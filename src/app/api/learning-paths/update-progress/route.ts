import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { generateAndSavePersonalizedPath } from "@/lib/ai-learning-path-generator";

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

    const body = await request.json();
    const {
      scenarioId,
      completed = false,
      score = null,
      nextRecommendedScenario = null,
    } = body;

    // Update user progress
    if (completed && scenarioId) {
      // Add to completed scenarios
      const { data: currentPath } = await supabase
        .from("user_learning_paths")
        .select(
          "completed_scenarios, progress_percentage, recommended_scenarios"
        )
        .eq("user_id", user.id)
        .single();

      if (currentPath) {
        const completedScenarios = [
          ...(currentPath.completed_scenarios || []),
          scenarioId,
        ];
        const totalScenarios = currentPath.recommended_scenarios?.length || 1;
        const newProgress = (completedScenarios.length / totalScenarios) * 100;

        await supabase
          .from("user_learning_paths")
          .update({
            completed_scenarios: completedScenarios,
            progress_percentage: Math.round(newProgress),
            current_scenario: nextRecommendedScenario,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      }
    }

    // Update journey progress
    const updates: Record<string, any> = {
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (scenarioId) {
      updates.current_scenario_id = scenarioId;
    }

    if (nextRecommendedScenario) {
      updates.next_recommended_scenario = nextRecommendedScenario;
    }

    if (completed) {
      // Increment scenarios completed
      const { data: currentProgress } = await supabase
        .from("user_journey_progress")
        .select("scenarios_completed")
        .eq("user_id", user.id)
        .single();

      if (currentProgress) {
        updates.scenarios_completed =
          (currentProgress.scenarios_completed || 0) + 1;
      }
    }

    const { error: updateError } = await supabase
      .from("user_journey_progress")
      .update(updates)
      .eq("user_id", user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
