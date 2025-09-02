// components/assessment/AssessmentWrapper.tsx (Updated for Enhanced Flow)
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import EnhancedAssessmentFlow from "./EnhancedAssessmentFlow";
import NewUserWelcome from "../../auth/NewUserWelcome";

interface AssessmentResult {
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  percentage: number;
  strengths: string[];
  recommendations: string[];
  timeSpent: number;
  confidenceScore: number;
}

export default function AssessmentWrapper({
  userId,
  email,
  onAssessmentComplete,
}: {
  userId: string;
  email?: string;
  onAssessmentComplete: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [needsAssessment, setNeedsAssessment] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    checkUserStatus();
  }, [userId]);

  const checkUserStatus = async () => {
    console.log("🔍 Checking user status for userId:", userId);

    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("📊 Profile query result:", { profile, error });

      if (error && error.code === "PGRST116") {
        console.log("✨ New user detected, creating profile");
        const createResult = await createUserProfile();
        if (createResult.success) {
          setIsNewUser(true);
          setShowWelcome(true);
        } else {
          setError("Failed to create user profile");
        }
      } else if (error) {
        console.error("❌ Error checking user status:", error);
        setError(`Database error: ${error.message}`);
      } else if (!profile) {
        console.log("⚠️ No profile returned but no error");
        setError("Profile not found");
      } else if (!profile.assessment_completed) {
        console.log("📝 Existing user needs assessment");
        setNeedsAssessment(true);
      } else {
        console.log("✅ User assessment complete, proceeding to dashboard");
        onAssessmentComplete();
      }
    } catch (error) {
      console.error("💥 Exception in checkUserStatus:", error);
      setError(
        `System error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      console.log("🏗️ Creating user profile for:", userId);

      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: userId,
            user_type: "guard",
            assessment_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating user profile:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ User profile created successfully:", data);
      return { success: true };
    } catch (error) {
      console.error("💥 Exception in createUserProfile:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const handleStartAssessment = () => {
    console.log("🎯 Starting assessment");
    setShowWelcome(false);
    setNeedsAssessment(true);
  };

  const handleAssessmentComplete = async (result: AssessmentResult) => {
    console.log("🎉 Assessment completed with result:", result);

    try {
      // Save enhanced assessment results
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          english_level: result.level,
          assessment_completed: true,
          assessment_score: result.percentage,
          strengths: result.strengths,
          recommendations: result.recommendations,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("❌ Error saving assessment results:", error);
        setError(`Failed to save assessment: ${error.message}`);
        return;
      }

      console.log("✅ Assessment results saved:", data);

      // Create enhanced learning path
      const learningPathResult = await createLearningPath(result);
      if (!learningPathResult.success) {
        console.warn("⚠️ Learning path creation failed, but continuing");
      }

      // Save assessment analytics for improvement
      await saveAssessmentAnalytics(result);

      console.log("🏠 Proceeding to dashboard");
      onAssessmentComplete();
    } catch (error) {
      console.error("💥 Exception in handleAssessmentComplete:", error);
      setError(
        `System error saving assessment: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const createLearningPath = async (
    result: AssessmentResult
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const scenarios = getRecommendedScenarios(
        result.level,
        result.strengths,
        result.recommendations
      );
      console.log(
        "📚 Creating enhanced learning path with scenarios:",
        scenarios
      );

      const { data, error } = await supabase
        .from("user_learning_paths")
        .upsert([
          {
            user_id: userId,
            english_level: result.level,
            recommended_scenarios: scenarios.recommended,
            current_scenario: scenarios.startWith,
            progress_percentage: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("❌ Error creating learning path:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ Learning path created:", data);
      return { success: true };
    } catch (error) {
      console.error("💥 Exception in createLearningPath:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const getRecommendedScenarios = (
    level: string,
    strengths: string[],
    recommendations: string[]
  ): { recommended: string[]; startWith: string } => {
    // Enhanced scenario mapping based on assessment results
    const baseScenarios: Record<string, string[]> = {
      A1: [
        "basic-greetings",
        "simple-directions",
        "prayer-times-basic",
        "emergency-help",
      ],
      A2: [
        "visitor-welcome",
        "facility-tour",
        "prayer-explanation",
        "basic-questions",
      ],
      B1: [
        "cultural-sensitivity",
        "visitor-registration",
        "prayer-guidance",
        "facility-information",
      ],
      B2: [
        "complex-inquiries",
        "interfaith-dialogue",
        "event-coordination",
        "conflict-resolution-basic",
      ],
      C1: [
        "advanced-cultural-topics",
        "emergency-management",
        "theological-questions",
        "leadership-scenarios",
      ],
    };

    const scenarios = [...(baseScenarios[level] || baseScenarios["A1"])];

    // Customize based on strengths and weaknesses
    if (strengths.includes("Listening Comprehension")) {
      scenarios.push("advanced-audio-scenarios");
    }

    if (
      recommendations.includes(
        "Practice listening to different English accents"
      )
    ) {
      scenarios.unshift("accent-training");
    }

    if (recommendations.includes("Focus on complex cultural scenarios")) {
      scenarios.push("advanced-cultural-navigation");
    }

    // Determine starting scenario based on level and confidence
    const startWith =
      level === "A1"
        ? scenarios[0]
        : level === "A2"
        ? scenarios[1]
        : scenarios[Math.floor(scenarios.length / 2)];

    return {
      recommended: scenarios.slice(0, 8), // Limit to 8 scenarios for focus
      startWith,
    };
  };

  const saveAssessmentAnalytics = async (result: AssessmentResult) => {
    try {
      // Save assessment data for product improvement
      const analyticsData = {
        user_id: userId,
        assessment_version: "2.0_enhanced",
        level_assigned: result.level,
        score: result.percentage,
        time_spent_seconds: result.timeSpent,
        confidence_score: result.confidenceScore,
        strengths_identified: result.strengths,
        recommendations_given: result.recommendations,
        completed_at: new Date().toISOString(),
      };

      // This would go to an analytics table (optional for MVP)
      console.log("📊 Assessment analytics:", analyticsData);
    } catch (error) {
      console.log("⚠️ Analytics logging failed (non-critical):", error);
    }
  };

  // Error state with enhanced design
  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center max-w-md border border-red-200">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Setup Error
          </h2>
          <p className="text-sm text-red-600 mb-4">{error}</p>

          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              checkUserStatus();
            }}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-emerald-600 mx-auto absolute top-0"></div>
          </div>
          <p className="text-lg text-gray-700 mt-6 font-medium">
            Preparing your personalized assessment...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will only take a moment
          </p>
        </div>
      </div>
    );
  }

  // Show welcome flow for new users
  if (showWelcome && email) {
    return (
      <NewUserWelcome email={email} onStartAssessment={handleStartAssessment} />
    );
  }

  // Show enhanced assessment
  if (needsAssessment) {
    return (
      <EnhancedAssessmentFlow
        userId={userId}
        email={email}
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return null;
}
