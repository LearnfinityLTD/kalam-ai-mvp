// app/api/journey/next-scenario/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const level = searchParams.get("level");

  if (!userId || !level) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();

    // Get user's completed scenarios
    const { data: completedScenarios } = await supabase
      .from("user_progress")
      .select("scenario_id")
      .eq("user_id", userId)
      .eq("completion_status", "completed");

    const completedIds = completedScenarios?.map((s) => s.scenario_id) || [];

    // Get user's current scenario (if any)
    const { data: currentProgress } = await supabase
      .from("user_progress")
      .select("scenario_id, completion_status")
      .eq("user_id", userId)
      .eq("completion_status", "in_progress")
      .single();

    // If user has a scenario in progress, return that
    if (currentProgress) {
      return NextResponse.json({
        scenarioId: currentProgress.scenario_id,
        status: "in_progress",
      });
    }

    // Otherwise, find the next available scenario
    const { data: nextScenario } = await supabase
      .from("scenarios")
      .select("id, title, difficulty, order_index")
      .eq("segment", "guard")
      .eq("difficulty", level)
      .not(
        "id",
        "in",
        completedIds.length > 0 ? `(${completedIds.join(",")})` : "()"
      )
      .order("order_index")
      .limit(1)
      .single();

    if (nextScenario) {
      // Mark this scenario as in progress
      await supabase.from("user_progress").insert({
        user_id: userId,
        scenario_id: nextScenario.id,
        completion_status: "in_progress",
        started_at: new Date().toISOString(),
      });

      return NextResponse.json({
        scenarioId: nextScenario.id,
        status: "new",
        title: nextScenario.title,
      });
    }

    // No scenarios available for this level
    return NextResponse.json({
      scenarioId: null,
      message: "No scenarios available for this level",
    });
  } catch (error) {
    console.error("Error getting next scenario:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
