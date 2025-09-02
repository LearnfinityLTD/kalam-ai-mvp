("use client");

import { useState } from "react";
import { createClient } from "@/lib/supabase";

interface AssessmentResult {
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  percentage: number;
  strengths: string[];
  recommendations: string[];
}

export function useAssessmentRetake(userId: string) {
  const [isRetaking, setIsRetaking] = useState(false);
  const supabase = createClient();

  const startRetake = () => {
    setIsRetaking(true);
  };

  const completeRetake = async (result: AssessmentResult) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          english_level: result.level,
          assessment_score: result.percentage,
          strengths: result.strengths,
          recommendations: result.recommendations,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) {
        console.error("Error updating assessment:", error);
        return false;
      }

      setIsRetaking(false);
      return true;
    } catch (error) {
      console.error("Error in completeRetake:", error);
      return false;
    }
  };

  const cancelRetake = () => {
    setIsRetaking(false);
  };

  return {
    isRetaking,
    startRetake,
    completeRetake,
    cancelRetake,
  };
}
