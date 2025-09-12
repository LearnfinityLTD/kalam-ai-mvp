// utils/challengeApi.ts - Updated with Database Integration
import { createClient } from "@/lib/supabase";

export interface ChallengeResultData {
  user_id: string;
  challenge_type: string;
  challenge_title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  total_questions: number;
  correct_answers: number;
  score: number;
  accuracy_percentage: number;
  time_taken_seconds?: number;
  max_streak: number;
  answers_data: Array<{
    question: string;
    userAnswer: string;
    correct: string;
    isCorrect: boolean;
    explanation: string;
  }>;
}

export interface ChallengeStats {
  total_challenges_completed: number;
  average_challenge_score: number;
  best_challenge_streak: number;
  recent_results: Array<{
    challenge_title: string;
    score: number;
    accuracy_percentage: number;
    completed_at: string;
  }>;
}

export interface Question {
  id: string;
  question_text: string;
  context?: string;
  correct_answer: string;
  options: string[];
  explanation: string;
  has_audio: boolean;
}

export interface ChallengeTemplate {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time_limit_minutes: number;
  color_scheme: string;
  icon_name: string;
}

/**
 * Fetch challenge templates from database
 */
export async function getChallengeTemplates(): Promise<ChallengeTemplate[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("challenge_templates")
      .select("*")
      .eq("is_active", true)
      .order("type");

    if (error) {
      console.error("Error fetching challenge templates:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getChallengeTemplates:", error);
    return [];
  }
}

/**
 * Fetch questions for a specific challenge type
 */
export async function getChallengeQuestions(
  challengeType: string,
  userLevel: string = "A2",
  userDialect: string = "gulf",
  limit: number = 5
): Promise<Question[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("challenge_questions")
      .select("*")
      .eq("challenge_type", challengeType)
      .eq("is_active", true)
      .or(`difficulty_level.is.null,difficulty_level.eq.${userLevel}`)
      .contains("target_dialects", [userDialect])
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) {
      // console.error("Error fetching challenge questions:", error);
      return [];
    }

    // Transform database format to component format
    return (data || []).map((question) => ({
      id: question.id,
      question_text: question.question_text,
      context: question.context,
      correct_answer: question.correct_answer,
      options: question.options,
      explanation: question.explanation,
      has_audio: question.has_audio,
    }));
  } catch (error) {
    console.error("Error in getChallengeQuestions:", error);
    return [];
  }
}

/**
 * Fallback questions in case database is unavailable
 */
const fallbackQuestions = {
  cultural_scenarios: [
    {
      id: "fallback-cultural-1",
      question_text:
        "A visitor asks you where the bathroom is. What's the most appropriate response?",
      context: "You're working as a security guard in a Dubai mall.",
      correct_answer: "I'll show you the way to the restroom, please follow me",
      options: [
        "It's over there, go straight and turn left",
        "I'll show you the way to the restroom, please follow me",
        "Bathroom is there",
        "Ask someone else, I don't know",
      ],
      explanation:
        "In UAE service culture, offering to personally help shows excellent customer service. Using 'restroom' is more professional than 'bathroom' in this context.",
      has_audio: false,
    },
  ],
  pronunciation_drill: [
    {
      id: "fallback-pronunciation-1",
      question_text:
        "Which word has the correct pronunciation of the 'P' sound?",
      context: "Arabic speakers often replace 'P' with 'B'. Listen carefully.",
      correct_answer: "People (PEE-pul)",
      options: [
        "Beople (BEE-bul)",
        "People (PEE-pul)",
        "Beobel (BEE-bul)",
        "Peopel (PEE-bul)",
      ],
      explanation:
        "The 'P' sound is made by pressing lips together and releasing air. Arabic speakers often substitute 'B' which uses the same lip position but with voice.",
      has_audio: true,
    },
  ],
  rapid_response: [
    {
      id: "fallback-rapid-1",
      question_text: "Complete: 'I _____ been working here for five years.'",
      correct_answer: "have",
      options: ["have", "has", "am", "will"],
      explanation:
        "Present perfect with 'I' uses 'have'. This shows an action that started in the past and continues to now.",
      has_audio: false,
    },
  ],
  dialect_bridge: [
    {
      id: "fallback-dialect-1",
      question_text:
        "How do you say 'صح كذا؟' (sah chidha?) in formal English?",
      context: "Expressing confirmation politely in a business setting.",
      correct_answer: "Is this correct?",
      options: [
        "Right like this?",
        "Is this correct?",
        "True like this?",
        "Correct this way?",
      ],
      explanation:
        "While Gulf speakers might directly translate, 'Is this correct?' is the most natural and professional way to seek confirmation.",
      has_audio: false,
    },
  ],
  grammar_sprint: [
    {
      id: "fallback-grammar-1",
      question_text: "Which sentence is correct?",
      context: "Arabic speakers often struggle with article usage.",
      correct_answer: "I went to the hospital to visit my friend",
      options: [
        "I went to the hospital to visit my friend",
        "I went to hospital to visit my friend",
        "I went to a hospital to visit my friend",
        "I went hospital to visit my friend",
      ],
      explanation:
        "Use 'the hospital' when referring to a specific hospital or the local hospital everyone knows about.",
      has_audio: false,
    },
  ],
  confidence_builder: [
    {
      id: "fallback-confidence-1",
      question_text:
        "What's a good way to start a conversation with a colleague?",
      context: "Building confidence in social interactions.",
      correct_answer: "All of the above are fine",
      options: [
        "How are you doing today?",
        "What's up?",
        "How's everything going?",
        "All of the above are fine",
      ],
      explanation:
        "All these options work well. The key is choosing what feels natural to you and fits the situation.",
      has_audio: false,
    },
  ],
};

/**
 * Get questions with fallback support
 */
export async function getQuestionsWithFallback(
  challengeType: string,
  userLevel: string = "A2",
  userDialect: string = "gulf",
  limit: number = 5
): Promise<Question[]> {
  try {
    // Try database first
    const dbQuestions = await getChallengeQuestions(
      challengeType,
      userLevel,
      userDialect,
      limit
    );

    // If we got enough questions from database, use them
    if (dbQuestions.length >= 3) {
      return dbQuestions.slice(0, limit);
    }

    // Otherwise, use fallback questions
    console.warn(
      `Using fallback questions for ${challengeType} - database returned ${dbQuestions.length} questions`
    );
    const fallback =
      fallbackQuestions[challengeType as keyof typeof fallbackQuestions] || [];

    // Combine database and fallback questions if needed
    const combined = [...dbQuestions, ...fallback].slice(0, limit);
    return combined;
  } catch (error) {
    console.error("Error getting questions, using fallback:", error);
    return (
      fallbackQuestions[challengeType as keyof typeof fallbackQuestions] || []
    );
  }
}

/**
 * Save challenge results to database and update user stats
 */
export async function saveChallengeResult(
  resultData: ChallengeResultData
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    // 1. Insert challenge result
    const { error: insertError } = await supabase
      .from("challenge_results")
      .insert({
        user_id: resultData.user_id,
        challenge_type: resultData.challenge_type,
        challenge_title: resultData.challenge_title,
        difficulty: resultData.difficulty,
        total_questions: resultData.total_questions,
        correct_answers: resultData.correct_answers,
        score: resultData.score,
        accuracy_percentage: resultData.accuracy_percentage,
        time_taken_seconds: resultData.time_taken_seconds,
        max_streak: resultData.max_streak,
        answers_data: resultData.answers_data,
      });

    if (insertError) {
      console.error("Error saving challenge result:", insertError);
      return { success: false, error: insertError.message };
    }

    // 2. Update user profile with aggregated stats
    await updateUserChallengeStats(resultData.user_id);

    // 3. Update user streak if applicable
    await updateUserStreak(resultData.user_id);

    return { success: true };
  } catch (error) {
    console.error("Error in saveChallengeResult:", error);
    return { success: false, error: "Failed to save challenge result" };
  }
}

/**
 * Update user profile with latest challenge statistics
 */
async function updateUserChallengeStats(userId: string): Promise<void> {
  const supabase = createClient();

  try {
    // Get challenge statistics
    const { data: stats, error } = await supabase
      .from("challenge_results")
      .select("score, max_streak")
      .eq("user_id", userId);

    if (error || !stats) {
      console.error("Error fetching challenge stats:", error);
      return;
    }

    const totalChallenges = stats.length;
    const averageScore =
      totalChallenges > 0
        ? Math.round(
            stats.reduce((sum, result) => sum + result.score, 0) /
              totalChallenges
          )
        : 0;
    const bestStreak = Math.max(...stats.map((s) => s.max_streak), 0);

    // Update user profile
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        total_challenges_completed: totalChallenges,
        average_challenge_score: averageScore,
        best_challenge_streak: bestStreak,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Error updating user challenge stats:", updateError);
    }
  } catch (error) {
    console.error("Error in updateUserChallengeStats:", error);
  }
}

/**
 * Update user's learning streak based on activity
 */
async function updateUserStreak(userId: string): Promise<void> {
  const supabase = createClient();

  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if user already has activity today
    const { data: todayActivity } = await supabase
      .from("challenge_results")
      .select("id")
      .eq("user_id", userId)
      .gte("completed_at", `${today}T00:00:00.000Z`)
      .lt("completed_at", `${today}T23:59:59.999Z`)
      .limit(1);

    // Only update streak if this is their first activity today
    if (todayActivity && todayActivity.length === 1) {
      const { data: currentStreak } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak, last_activity")
        .eq("user_id", userId)
        .single();

      let newCurrentStreak = 1;
      let newLongestStreak = 1;

      if (currentStreak) {
        const lastActivity = new Date(currentStreak.last_activity);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // If last activity was yesterday, increment streak
        if (lastActivity.toDateString() === yesterday.toDateString()) {
          newCurrentStreak = currentStreak.current_streak + 1;
        }

        newLongestStreak = Math.max(
          newCurrentStreak,
          currentStreak.longest_streak
        );
      }

      // Upsert streak data
      await supabase.from("user_streaks").upsert(
        {
          user_id: userId,
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_activity: today,
        },
        {
          onConflict: "user_id",
        }
      );
    }
  } catch (error) {
    console.error("Error updating user streak:", error);
  }
}

/**
 * Get user's challenge statistics for dashboard
 */
export async function getUserChallengeStats(
  userId: string
): Promise<ChallengeStats | null> {
  const supabase = createClient();

  try {
    // Get user profile with challenge stats
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select(
        "total_challenges_completed, average_challenge_score, best_challenge_streak"
      )
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }

    // Get recent challenge results (last 5)
    const { data: recentResults, error: resultsError } = await supabase
      .from("challenge_results")
      .select("challenge_title, score, accuracy_percentage, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(5);

    if (resultsError) {
      console.error("Error fetching recent results:", resultsError);
      return null;
    }

    return {
      total_challenges_completed: profile.total_challenges_completed || 0,
      average_challenge_score: profile.average_challenge_score || 0,
      best_challenge_streak: profile.best_challenge_streak || 0,
      recent_results: recentResults || [],
    };
  } catch (error) {
    console.error("Error in getUserChallengeStats:", error);
    return null;
  }
}

/**
 * Get leaderboard data for competitive features
 */
export async function getChallengeLeaderboard(
  limit: number = 10
): Promise<Array<{
  user_id: string;
  full_name: string;
  total_score: number;
  total_challenges: number;
  average_score: number;
}> | null> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("challenge_results")
      .select(
        `
        user_id,
        score,
        user_profiles!inner(full_name)
      `
      )
      .order("score", { ascending: false });

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return null;
    }

    // Define proper types for the aggregated user stats
    interface UserStats {
      user_id: string;
      full_name: string;
      total_score: number;
      total_challenges: number;
      average_score: number;
    }

    // Group by user and calculate totals
    const userStats = data.reduce((acc: Record<string, UserStats>, result) => {
      const userId = result.user_id;
      // Fix: Access the first element of the user_profiles array
      const userProfile = Array.isArray(result.user_profiles)
        ? result.user_profiles[0]
        : result.user_profiles;

      if (!acc[userId]) {
        acc[userId] = {
          user_id: userId,
          full_name: userProfile?.full_name || "Anonymous",
          total_score: 0,
          total_challenges: 0,
          average_score: 0,
        };
      }
      acc[userId].total_score += result.score;
      acc[userId].total_challenges += 1;
      return acc;
    }, {});

    // Calculate averages and sort
    const leaderboard = Object.values(userStats)
      .map((user: UserStats) => ({
        ...user,
        average_score: Math.round(user.total_score / user.total_challenges),
      }))
      .sort((a: UserStats, b: UserStats) => b.total_score - a.total_score)
      .slice(0, limit);

    return leaderboard;
  } catch (error) {
    console.error("Error in getChallengeLeaderboard:", error);
    return null;
  }
}
