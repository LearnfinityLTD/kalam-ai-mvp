// utils/journeyApi.ts
import { createClient } from "@/lib/supabase";
import { JourneyProgress, Scenario, LearningPath } from "../types/journey";

export class JourneyAPI {
  private supabase = createClient();

  async getUserJourney(userId: string): Promise<JourneyProgress | null> {
    const { data, error } = await this.supabase
      .from("user_journey_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching journey:", error);
      return null;
    }

    return data;
  }

  async createUserJourney(
    userId: string,
    level: string
  ): Promise<JourneyProgress> {
    const { data, error } = await this.supabase
      .from("user_journey_progress")
      .insert({
        user_id: userId,
        current_level: level,
        journey_status: "not_started",
        scenarios_completed: 0,
        total_scenarios: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLearningPath(
    level: string,
    segment: string = "guard"
  ): Promise<LearningPath[]> {
    const { data, error } = await this.supabase
      .from("learning_paths")
      .select(
        `
      id,
      name,
      description,
      level,
      order_index,
      estimated_duration,
      scenarios (
        id,
        title,
        description,
        difficulty,
        estimated_duration,
        type,
        order_index
      )
    `
      )
      .eq("level", level)
      .eq("segment", segment)
      .order("order_index");

    if (error) throw error;

    // Transform the data to match the LearningPath type
    const transformedData =
      data?.map((path) => ({
        ...path,
        order: path.order_index,
        scenarios: path.scenarios.map(
          (scenario: (typeof path.scenarios)[0]) => ({
            ...scenario,
            order: scenario.order_index,
            status: "available" as const, // Default status
            attempts: 0, // Default attempts
          })
        ),
      })) || [];

    return transformedData;
  }

  async getNextRecommendedScenario(userId: string): Promise<Scenario | null> {
    // Get user's current progress
    const journey = await this.getUserJourney(userId);
    if (!journey) return null;

    // Get completed scenarios
    const { data: completed } = await this.supabase
      .from("user_progress")
      .select("scenario_id")
      .eq("user_id", userId)
      .eq("completion_status", "completed");

    const completedIds = completed?.map((c) => c.scenario_id) || [];

    // Get next available scenario
    const { data, error } = await this.supabase
      .from("scenarios")
      .select("*")
      .eq("segment", "guard")
      .eq("difficulty", journey.current_level)
      .not("id", "in", `(${completedIds.join(",")})`)
      .order("order_index")
      .limit(1)
      .single();

    if (error) return null;

    // Transform to match Scenario type
    return {
      ...data,
      order: data.order_index,
      status: "available" as const,
      attempts: 0,
    };
  }

  async updateJourneyProgress(
    userId: string,
    scenarioId: string,
    status: "completed" | "in_progress"
  ): Promise<void> {
    const { error } = await this.supabase
      .from("user_journey_progress")
      .update({
        current_scenario_id: scenarioId,
        journey_status: status,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
  }
}
