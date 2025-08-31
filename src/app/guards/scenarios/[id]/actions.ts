// app/guards/scenarios/[id]/actions.ts
import { createClient } from "@/lib/supabase";

export async function logSession({
  userId,
  scenarioId,
  seconds,
  completionRate, // 0..1
  pronScore, // optional
}: {
  userId: string;
  scenarioId: string;
  seconds: number;
  completionRate: number;
  pronScore?: number | null;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("log_learning_session", {
    p_user_id: userId,
    p_scenario_id: scenarioId,
    p_session_duration: seconds,
    p_completion_rate: completionRate,
    p_pronunciation_score: pronScore ?? null,
  });
  if (error) throw error;
  return data;
}
