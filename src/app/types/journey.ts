export interface JourneyProgress {
  id: string;
  user_id: string;
  current_scenario_id: string | null;
  current_unit_id: string | null;
  current_level: string;
  scenarios_completed: number;
  total_scenarios: number;
  last_activity: string;
  next_recommended_scenario: string | null;
  journey_status: "not_started" | "in_progress" | "completed" | "paused";
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  level: string;
  order: number;
  scenarios: Scenario[];
  estimated_duration: number;
  prerequisites?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_duration: number;
  type: "conversation" | "listening" | "vocabulary" | "grammar" | "cultural";
  status: "locked" | "available" | "in_progress" | "completed";
  completion_date?: string;
  score?: number;
  attempts: number;
  order: number;
}
