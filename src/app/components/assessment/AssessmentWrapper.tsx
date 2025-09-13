// components/assessment/AssessmentWrapper.tsx - With your i18n system
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import SimplifiedAssessmentFlow from "./SimplifiedAssessmentFlow";
import NewUserWelcome from "../../auth/NewUserWelcome";
import { useI18n } from "@/lib/i18n/context";

interface AssessmentResult {
  userType: "guard" | "professional" | "tourist_guide";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  percentage: number;
  strengths: string[];
  recommendations: string[];
  timeSpent: number;
  sessionId: string;
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
  const { t } = useI18n();
  const supabase = createClient();

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
        console.log("✨ New user detected, showing welcome flow");
        setIsNewUser(true);
        setShowWelcome(true);
      } else if (error) {
        console.error("❌ Error checking user status:", error);
        setError(t("assessment.databaseError", { message: error.message }));
      } else if (!profile) {
        console.log("⚠️ No profile returned but no error");
        setError(t("assessment.profileNotFound"));
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
        t("assessment.systemError", {
          message: error instanceof Error ? error.message : "Unknown error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, [userId, checkUserStatus]);

  const handleStartAssessment = () => {
    console.log("🎯 Starting assessment from welcome");
    setShowWelcome(false);
    setNeedsAssessment(true);
  };

  const handleAssessmentComplete = async (result: AssessmentResult) => {
    console.log("🎉 Assessment completed with result:", result);

    try {
      // For new users, create profile with selected user type
      if (isNewUser) {
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert([
            {
              id: userId,
              user_type: result.userType,
              english_level: result.level,
              assessment_completed: true,
              assessment_score: result.percentage,
              strengths: result.strengths,
              recommendations: result.recommendations,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error("❌ Error creating user profile:", createError);
          setError(
            t("assessment.failedToSave", { message: createError.message })
          );
          return;
        }

        console.log("✅ New user profile created:", newProfile);
      } else {
        // For existing users, update their profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from("user_profiles")
          .update({
            user_type: result.userType,
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

        if (updateError) {
          console.error("❌ Error updating user profile:", updateError);
          setError(
            t("assessment.failedToSave", { message: updateError.message })
          );
          return;
        }

        console.log("✅ User profile updated:", updatedProfile);
      }

      // Create personalized learning path
      const learningPathResult = await createPersonalizedLearningPath(result);
      if (!learningPathResult.success) {
        console.warn("⚠️ Learning path creation failed, but continuing");
      }

      // Mark assessment session as completed
      await completeAssessmentSession(result.sessionId, result);

      console.log("🏠 Proceeding to dashboard");
      onAssessmentComplete();
    } catch (error) {
      console.error("💥 Exception in handleAssessmentComplete:", error);
      setError(
        t("assessment.systemError", {
          message: error instanceof Error ? error.message : "Unknown error",
        })
      );
    }
  };

  const createPersonalizedLearningPath = async (
    result: AssessmentResult
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const scenarios = getPersonalizedScenarios(result.userType, result.level);
      console.log("📚 Creating personalized learning path:", scenarios);

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

      console.log("✅ Personalized learning path created:", data);
      return { success: true };
    } catch (error) {
      console.error("💥 Exception in createPersonalizedLearningPath:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const getPersonalizedScenarios = (
    userType: string,
    level: string
  ): { recommended: string[]; startWith: string } => {
    // Personalized scenarios based on user type AND level
    const scenarioMappings: Record<string, Record<string, string[]>> = {
      guard: {
        A1: [
          "basic-mosque-greetings",
          "simple-directions",
          "prayer-times-basic",
        ],
        A2: ["visitor-welcome", "dress-code-explanation", "facility-tour"],
        B1: [
          "cultural-sensitivity",
          "emergency-procedures",
          "interfaith-dialogue-basic",
        ],
        B2: [
          "complex-visitor-needs",
          "hajj-crowd-management",
          "security-protocols",
        ],
        C1: [
          "advanced-cultural-ambassador",
          "crisis-leadership",
          "theological-discussions",
        ],
      },
      professional: {
        A1: ["business-introductions", "meeting-basics", "email-fundamentals"],
        A2: ["presentation-skills", "client-communication", "phone-etiquette"],
        B1: [
          "negotiation-basics",
          "cross-cultural-business",
          "vision-2030-intro",
        ],
        B2: [
          "advanced-negotiations",
          "international-partnerships",
          "complex-presentations",
        ],
        C1: [
          "executive-leadership",
          "strategic-communication",
          "diplomatic-relations",
        ],
      },
      tourist_guide: {
        A1: ["tourist-welcome", "basic-information", "simple-explanations"],
        A2: ["cultural-site-tours", "group-management", "question-handling"],
        B1: ["historical-narratives", "cultural-sensitivity", "VIP-service"],
        B2: ["luxury-tourism", "crisis-management", "interfaith-tours"],
        C1: [
          "expert-cultural-guide",
          "diplomatic-tours",
          "educational-excellence",
        ],
      },
    };

    const typeScenarios = scenarioMappings[userType] || scenarioMappings.guard;
    const levelScenarios = typeScenarios[level] || typeScenarios.A1;

    return {
      recommended: levelScenarios,
      startWith: levelScenarios[0],
    };
  };

  const completeAssessmentSession = async (
    sessionId: string,
    result: AssessmentResult
  ) => {
    try {
      const { error } = await supabase
        .from("assessment_sessions")
        .update({
          final_level: result.level,
          final_score: result.percentage,
          strengths_identified: result.strengths,
          recommendations_given: result.recommendations,
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (error) {
        console.error("❌ Error completing assessment session:", error);
      } else {
        console.log("✅ Assessment session completed");
      }
    } catch (error) {
      console.log(
        "⚠️ Assessment session completion failed (non-critical):",
        error
      );
    }
  };

  // Error state
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
            {t("assessment.setupError")}
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
            {t("assessment.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-lg text-gray-700 mt-6 font-medium">
            {t("assessment.settingUpAssessment")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t("assessment.onlyTakesMoment")}
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

  // Show simplified assessment
  if (needsAssessment) {
    return (
      <SimplifiedAssessmentFlow
        userId={userId}
        email={email}
        isNewUser={isNewUser}
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return null;
}
