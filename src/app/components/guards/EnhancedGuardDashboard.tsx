// components/guards/EnhancedGuardDashboard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Trophy,
  Target,
  Clock,
  Star,
  Book,
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Zap,
  CheckCircle,
  Award,
  BookOpen,
  MessageCircle,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { getUserChallengeStats, ChallengeStats } from "@/utils/challengeApi";
import PrayerTimeIndicator from "@/components/shared/PrayerTimeIndicator";
import AssessmentDashboardCard from "./AssessmentDashboardCard";
import PracticeConversationButton from "../shared/PracticeConversationButton";
import ChallengeMode from "./challengeMode/ChallengeMode";
import { ChallengeStatsCard } from "./challengeMode/ChallendeStats";

// Fixed imports
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitch } from "@/app/components/shared/language/LanguageSwitch";
import { LocalizedTooltip } from "@/app/components/shared/language/LocalizedTooltip";

interface UserData {
  english_level?: string;
  assessment_score?: number;
  strengths?: string[];
  recommendations?: string[];
  completed_scenarios: number;
  total_scenarios: number;
  current_streak: number;
  average_score: number;
  hours_learned: number;
  last_activity: string;
  learning_path?: string[];
  next_milestone?: string;
  weekly_goal: number;
  confidence_level: number;
  dialect?: string;
  full_name?: string;
  challenge_stats?: ChallengeStats | null;
}

interface UserPreferences {
  show_prayer_times: boolean;
  prayer_calculation_method?: number;
  prayer_school?: number;
}

interface PersonalizedScenario {
  id: string;
  title: string;
  difficulty: string;
  duration: string;
  relevance_score: number;
  why_recommended: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export default function EnhancedGuardDashboard({
  userId,
  email,
}: {
  userId: string;
  email?: string;
}) {
  const { t, locale } = useI18n();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    show_prayer_times: true,
    prayer_calculation_method: 5,
    prayer_school: 1,
  });
  const [personalizedScenarios, setPersonalizedScenarios] = useState<
    PersonalizedScenario[]
  >([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showChallengeMode, setShowChallengeMode] = useState(false);
  const supabase = createClient();

  const fetchUserPreferences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user preferences:", error);
        return;
      }

      if (data) {
        const prefs = {
          show_prayer_times: data.show_prayer_times ?? true,
          prayer_calculation_method: data.prayer_calculation_method ?? 5,
          prayer_school: data.prayer_school ?? 1,
        };
        setUserPreferences(prefs);
      } else {
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  }, [userId, supabase]);

  const createDefaultPreferences = useCallback(async () => {
    try {
      const defaultPrefs = {
        user_id: userId,
        show_prayer_times: true,
        prayer_calculation_method: 5,
        prayer_school: 1,
        language_preference: locale,
      };

      const { error } = await supabase
        .from("user_preferences")
        .insert(defaultPrefs);

      if (error && error.code !== "PGRST116") {
        console.error("Error creating default preferences:", error);
      }
    } catch (error) {
      console.error("Error creating default preferences:", error);
    }
  }, [userId, supabase, locale]);

  const togglePrayerTimes = useCallback(async () => {
    const newShowPrayerTimes = !userPreferences.show_prayer_times;

    try {
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          show_prayer_times: newShowPrayerTimes,
          prayer_calculation_method: userPreferences.prayer_calculation_method,
          prayer_school: userPreferences.prayer_school,
          language_preference: locale,
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) {
        console.error("Error updating preferences:", error);
        return;
      }

      setUserPreferences((prev) => ({
        ...prev,
        show_prayer_times: newShowPrayerTimes,
      }));
    } catch (error) {
      console.error("Error toggling prayer times:", error);
    }
  }, [userId, userPreferences, supabase, locale]);

  const generatePersonalizedScenarios = useCallback(
    async (profile: { english_level?: string; recommendations?: string[] }) => {
      const { data: scenarios, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("segment", "guard")
        .limit(6);

      if (error || !scenarios) return;

      const level = profile.english_level || "A1";
      const recommendations = profile.recommendations || [];

      const personalized = scenarios.map((scenario) => {
        let relevanceScore = 50;
        let whyRecommended = "Perfect for building your skills";

        if (scenario.difficulty.toLowerCase() === level.toLowerCase()) {
          relevanceScore += 30;
          whyRecommended = `Matches your ${level} level perfectly`;
        }

        if (
          recommendations.includes("Practice listening comprehension") &&
          scenario.id.includes("audio")
        ) {
          relevanceScore += 20;
          whyRecommended = "Recommended to improve your listening skills";
        }

        if (
          recommendations.includes("Focus on complex cultural scenarios") &&
          scenario.difficulty === "advanced"
        ) {
          relevanceScore += 25;
          whyRecommended = "Builds on your cultural communication strengths";
        }

        return {
          id: scenario.id,
          title: scenario.title,
          difficulty: scenario.difficulty,
          duration: "8-12 min",
          relevance_score: Math.min(relevanceScore, 100),
          why_recommended: whyRecommended,
        };
      });

      setPersonalizedScenarios(
        personalized
          .sort((a, b) => b.relevance_score - a.relevance_score)
          .slice(0, 4)
      );
    },
    [supabase]
  );

  const generateAchievements = useCallback(async (data: UserData) => {
    const challengeStats = data.challenge_stats;

    const achievements: Achievement[] = [
      {
        id: "first_steps",
        title: "First Steps",
        description: "Complete your first scenario",
        icon: "🌱",
        unlocked: data.completed_scenarios >= 1,
      },
      {
        id: "streak_starter",
        title: "Streak Starter",
        description: "Maintain a 3-day learning streak",
        icon: "🔥",
        unlocked: data.current_streak >= 3,
        progress: Math.min(data.current_streak, 3),
        total: 3,
      },
      {
        id: "cultural_ambassador",
        title: "Cultural Ambassador",
        description: "Excel in cultural sensitivity scenarios",
        icon: "🤝",
        unlocked: data.strengths?.includes("Cultural Sensitivity") || false,
      },
      {
        id: "level_master",
        title: `${data.english_level} Master`,
        description: `Complete all ${data.english_level} level scenarios`,
        icon: "🎓",
        unlocked: false,
        progress: data.completed_scenarios,
        total: Math.floor(data.total_scenarios / 5),
      },
      {
        id: "pronunciation_pro",
        title: "Pronunciation Pro",
        description: "Score 90%+ on 5 pronunciation exercises",
        icon: "🗣️",
        unlocked: data.average_score >= 90 && data.completed_scenarios >= 5,
        progress:
          data.average_score >= 90 ? Math.min(data.completed_scenarios, 5) : 0,
        total: 5,
      },
      {
        id: "consistent_learner",
        title: "Consistent Learner",
        description: "Complete your weekly goal 4 weeks in a row",
        icon: "⭐",
        unlocked: false,
        progress: 2,
        total: 4,
      },
      {
        id: "challenge_newbie",
        title: "Challenge Explorer",
        description: "Complete your first challenge",
        icon: "🚀",
        unlocked: (challengeStats?.total_challenges_completed || 0) >= 1,
      },
      {
        id: "challenge_master",
        title: "Challenge Master",
        description: "Complete 10 challenges",
        icon: "🏆",
        unlocked: (challengeStats?.total_challenges_completed || 0) >= 10,
        progress: Math.min(challengeStats?.total_challenges_completed || 0, 10),
        total: 10,
      },
      {
        id: "high_scorer",
        title: "High Scorer",
        description: "Achieve 90+ average score",
        icon: "⭐",
        unlocked: (challengeStats?.average_challenge_score || 0) >= 90,
      },
      {
        id: "streak_champion",
        title: "Streak Champion",
        description: "Get a 10+ answer streak in challenges",
        icon: "🔥",
        unlocked: (challengeStats?.best_challenge_streak || 0) >= 10,
        progress: Math.min(challengeStats?.best_challenge_streak || 0, 10),
        total: 10,
      },
    ];

    setAchievements(achievements);
  }, []);

  const generateMotivationalMessage = useCallback((data: UserData) => {
    const level = data.english_level;
    const streak = data.current_streak;
    const strengths = data.strengths || [];

    let message = "";

    if (streak === 0) {
      message =
        "Ready to start your English journey? Complete a scenario today to begin your streak!";
    } else if (streak < 3) {
      message = `${streak} day${
        streak === 1 ? "" : "s"
      } strong! Keep going to build momentum.`;
    } else if (streak >= 7) {
      message = `Amazing ${streak}-day streak! You're becoming a true English communication expert.`;
    } else {
      message = `${streak} days in a row! You're building excellent learning habits.`;
    }

    if (strengths.includes("Cultural Sensitivity")) {
      message += " Your cultural awareness really shines through!";
    }

    if (level === "B2" || level === "C1") {
      message +=
        " Your advanced English skills are impressive - you're ready for complex scenarios.";
    }

    setMotivationalMessage(message);
  }, []);

  const fetchPersonalizedData = useCallback(async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);

      if (progressError) throw progressError;

      const { data: streak, error: streakError } = await supabase
        .from("user_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle();

      const completedCount =
        progress?.filter((p) => p.completion_status === "completed").length ||
        0;
      const averageScore =
        progress?.length > 0
          ? progress.reduce((sum, p) => sum + (p.score || 0), 0) /
            progress.length
          : 0;

      const { count: totalScenarios } = await supabase
        .from("scenarios")
        .select("id", { count: "exact", head: true })
        .eq("segment", "guard");

      const challengeStats = await getUserChallengeStats(userId);

      const personalizedUserData: UserData = {
        english_level: profile.english_level,
        assessment_score: profile.assessment_score,
        strengths: profile.strengths || [],
        recommendations: profile.recommendations || [],
        completed_scenarios: completedCount,
        total_scenarios: totalScenarios || 24,
        current_streak: streak?.current_streak || 0,
        average_score: Math.round(averageScore),
        hours_learned: Math.round(completedCount * 0.5 * 10) / 10,
        last_activity: new Date().toISOString(),
        weekly_goal: 5,
        confidence_level: profile.assessment_score || 50,
        dialect: profile.dialect || "gulf",
        full_name: profile.full_name,
        challenge_stats: challengeStats,
      };

      setUserData(personalizedUserData);

      await generatePersonalizedScenarios(profile);
      await generateAchievements(personalizedUserData);
      generateMotivationalMessage(personalizedUserData);
    } catch (error) {
      console.error("Error fetching personalized data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    supabase,
    generatePersonalizedScenarios,
    generateAchievements,
    generateMotivationalMessage,
  ]);

  const refreshDashboardData = useCallback(async () => {
    await fetchPersonalizedData();
  }, [fetchPersonalizedData]);

  useEffect(() => {
    fetchPersonalizedData();
    fetchUserPreferences();
  }, [fetchPersonalizedData, fetchUserPreferences]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-lg text-gray-700 mt-6 font-medium">
            Loading your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) return <div>Error loading dashboard</div>;

  const completionPct =
    userData.total_scenarios > 0
      ? (userData.completed_scenarios / userData.total_scenarios) * 100
      : 0;

  const levelInfo = {
    A1: {
      color: "from-red-400 to-red-600",
      emoji: "🌱",
      title: "Foundation Builder",
    },
    A2: {
      color: "from-orange-400 to-orange-600",
      emoji: "🌿",
      title: "Confident Helper",
    },
    B1: {
      color: "from-yellow-400 to-yellow-600",
      emoji: "🌳",
      title: "Cultural Bridge",
    },
    B2: {
      color: "from-blue-400 to-blue-600",
      emoji: "🦋",
      title: "Expert Communicator",
    },
    C1: {
      color: "from-green-400 to-green-600",
      emoji: "🦅",
      title: "Master Ambassador",
    },
  }[userData.english_level || "A1"] || {
    color: "from-gray-400 to-gray-600",
    emoji: "📝",
    title: "Learning",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header with Language Switch */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("common.dashboard")}
        </h1>
        <LanguageSwitch />
      </div>

      {/* Personalized Welcome */}
      <div
        className={`bg-gradient-to-r ${levelInfo.color} rounded-xl p-6 text-white relative`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{levelInfo.emoji}</span>
              <div>
                <LocalizedTooltip translationKey="tooltips.heroBanner">
                  <h2 className="text-2xl font-bold cursor-help">
                    {levelInfo.title}{" "}
                    <Info className="inline-block w-4 h-4 ml-1 opacity-80" />
                  </h2>
                </LocalizedTooltip>
                <LocalizedTooltip translationKey="tooltips.heroLevel">
                  <p className="text-white/90 cursor-help">
                    {userData.english_level} {t("common.level")} •{" "}
                    {userData.completed_scenarios} {t("common.scenarios")}{" "}
                    {t("common.completed")}
                  </p>
                </LocalizedTooltip>
              </div>
            </div>
            <p className="text-white/95 text-lg max-w-2xl">
              {motivationalMessage}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <LocalizedTooltip translationKey="tooltips.heroStreak">
              <div className="text-4xl font-bold cursor-help">
                {userData.current_streak}
              </div>
            </LocalizedTooltip>
            <div className="text-white/90">{t("common.dayStreak")}</div>

            <LocalizedTooltip translationKey="tooltips.prayersToggle">
              <Button
                onClick={togglePrayerTimes}
                variant="ghost"
                size="sm"
                className="mt-4 text-white/80 hover:text-white hover:bg-white/20 cursor-help"
              >
                {userPreferences.show_prayer_times ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {userPreferences.show_prayer_times
                  ? t("common.hidePrayers")
                  : t("common.showPrayers")}
              </Button>
            </LocalizedTooltip>
          </div>
        </div>
      </div>

      {/* Conditional Prayer Times */}
      {userPreferences.show_prayer_times && (
        <PrayerTimeIndicator
          calculationMethod={userPreferences.prayer_calculation_method}
          school={userPreferences.prayer_school}
          onToggleVisibility={togglePrayerTimes}
          userId={userId}
        />
      )}

      {/* Assessment + Challenge Stats + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <LocalizedTooltip translationKey="tooltips.levelCard">
            <div className="cursor-help">
              <AssessmentDashboardCard userId={userId} />
            </div>
          </LocalizedTooltip>
        </div>

        <div className="lg:col-span-1">
          <LocalizedTooltip translationKey="tooltips.perfCard">
            <div className="cursor-help">
              <ChallengeStatsCard
                challengeStats={userData?.challenge_stats || null}
                loading={loading}
              />
            </div>
          </LocalizedTooltip>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <LocalizedTooltip translationKey="tooltips.journeyCard">
                  <span className="cursor-help">
                    {t("dashboard.journeyTitle")}
                  </span>
                </LocalizedTooltip>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {userData.completed_scenarios}
                  </div>
                  <LocalizedTooltip translationKey="tooltips.statsCompleted">
                    <div className="text-xs text-gray-500 cursor-help">
                      {t("common.completed")}
                    </div>
                  </LocalizedTooltip>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userData.average_score}%
                  </div>
                  <LocalizedTooltip translationKey="tooltips.statsAvgScore">
                    <div className="text-xs text-gray-500 cursor-help">
                      {t("common.avgScore")}
                    </div>
                  </LocalizedTooltip>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userData.hours_learned}h
                  </div>
                  <LocalizedTooltip translationKey="tooltips.statsTimeSpent">
                    <div className="text-xs text-gray-500 cursor-help">
                      {t("common.timeSpent")}
                    </div>
                  </LocalizedTooltip>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userData.confidence_level}%
                  </div>
                  <LocalizedTooltip translationKey="tooltips.statsConfidence">
                    <div className="text-xs text-gray-500 cursor-help">
                      {t("common.confidence")}
                    </div>
                  </LocalizedTooltip>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <LocalizedTooltip translationKey="tooltips.statsOverall">
                    <span className="cursor-help">
                      {t("common.overallProgress")}
                    </span>
                  </LocalizedTooltip>
                  <LocalizedTooltip translationKey="tooltips.statsScenarioCount">
                    <span className="cursor-help">
                      {userData.completed_scenarios}/{userData.total_scenarios}{" "}
                      {t("common.scenarios")}
                    </span>
                  </LocalizedTooltip>
                </div>
                <LocalizedTooltip translationKey="tooltips.statsPercentComplete">
                  <div className="cursor-help">
                    <Progress value={completionPct} className="h-3" />
                  </div>
                </LocalizedTooltip>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(completionPct)}% {t("common.complete")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <LocalizedTooltip translationKey="tooltips.recsCard">
              <span className="cursor-help">
                {t("dashboard.recommendedForYou")}
              </span>
            </LocalizedTooltip>
          </CardTitle>
          <LocalizedTooltip translationKey="tooltips.recsCard">
            <p className="text-sm text-gray-600 cursor-help">
              {t("dashboard.basedOnLevel", {
                level: userData.english_level ?? "A1",
              })}
            </p>
          </LocalizedTooltip>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {scenario.title}
                    </h4>
                    <p className="text-sm text-blue-600 mb-1">
                      {scenario.why_recommended}
                    </p>
                  </div>
                  <div className="text-right">
                    <LocalizedTooltip translationKey="tooltips.recsMatch">
                      <Badge
                        variant={
                          scenario.relevance_score >= 80
                            ? "default"
                            : "secondary"
                        }
                        className="cursor-help"
                      >
                        {scenario.relevance_score}% {t("common.match")}
                      </Badge>
                    </LocalizedTooltip>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{scenario.difficulty}</span>
                    <span>•</span>
                    <span>{scenario.duration}</span>
                  </div>
                  <LocalizedTooltip translationKey="tooltips.recsStart">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-blue-600 cursor-help"
                    >
                      {t("common.start")}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </LocalizedTooltip>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <LocalizedTooltip translationKey="tooltips.achCard">
              <span className="cursor-help">{t("dashboard.achievements")}</span>
            </LocalizedTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <LocalizedTooltip
                key={achievement.id}
                translationKey="tooltips.achItem"
              >
                <div
                  className={`p-4 rounded-lg border-2 transition-all cursor-help ${
                    achievement.unlocked
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4
                      className={`font-semibold mb-1 ${
                        achievement.unlocked
                          ? "text-yellow-800"
                          : "text-gray-600"
                      }`}
                    >
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {achievement.description}
                    </p>

                    {achievement.progress !== undefined &&
                      achievement.total && (
                        <div>
                          <Progress
                            value={
                              (achievement.progress / achievement.total) * 100
                            }
                            className="h-2 mb-1"
                          />
                          <p className="text-xs text-gray-500">
                            {achievement.progress}/{achievement.total}
                          </p>
                        </div>
                      )}

                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-yellow-600 mx-auto mt-2" />
                    )}
                  </div>
                </div>
              </LocalizedTooltip>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Learning Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-7 w-7" />
            <LocalizedTooltip translationKey="tooltips.actionsCard">
              <span className="cursor-help">
                {t("dashboard.continueLearning")}
              </span>
            </LocalizedTooltip>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1) Continue Journey */}
            <LocalizedTooltip translationKey="tooltips.actionsContinue">
              <Button className="h-28 flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-blue-600 cursor-help">
                <Play className="w-12 h-12" />
                <span className="font-medium text-base">
                  {t("dashboard.continueJourney")}
                </span>
                <span className="text-sm opacity-90">
                  {t("dashboard.pickUpWhere")}
                </span>
              </Button>
            </LocalizedTooltip>

            {/* 2) Practice Conversation */}
            <LocalizedTooltip translationKey="tooltips.actionsPractice">
              <div className="cursor-help">
                <PracticeConversationButton
                  userId={userId}
                  segment={"guard"}
                  icon={Sparkles}
                  title={t("dashboard.practiceConversation")}
                  subtitle={t("dashboard.aiPoweredChat")}
                  className="h-28 flex flex-col items-center justify-center gap-3 border-purple-300 hover:bg-purple-50 rounded-md [&_svg]:w-12 [&_svg]:h-12"
                  onCreated={(sid) => console.log("Session:", sid)}
                />
              </div>
            </LocalizedTooltip>

            {/* 3) Challenge Mode */}
            <LocalizedTooltip translationKey="tooltips.actionsChallenge">
              <Button
                variant="outline"
                className="h-28 flex flex-col items-center justify-center gap-3 border-orange-300 hover:bg-orange-50 cursor-help"
                onClick={() => setShowChallengeMode(true)}
              >
                <Trophy className="w-12 h-12 text-orange-600" />
                <span className="font-medium text-base">
                  {t("dashboard.challengeMode")}
                </span>
                <span className="text-sm text-gray-600">
                  {t("dashboard.testSkills")}
                </span>
              </Button>
            </LocalizedTooltip>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Mode Modal */}
      {showChallengeMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              {/* Header */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  كلام
                </div>
                <span className="ml-3 text-1xl font-bold text-gray-900 self-center">
                  AI
                </span>
              </div>

              <LocalizedTooltip translationKey="tooltips.modalClose">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowChallengeMode(false);
                    refreshDashboardData();
                  }}
                  className="cursor-help"
                >
                  <X className="w-8 h-8" />
                </Button>
              </LocalizedTooltip>
            </div>
            <ChallengeMode
              userLevel={userData?.english_level || "A1"}
              userDialect={userData?.dialect || "gulf"}
              userId={userId}
              initialLoading
              bootDelayMs={1000}
              onComplete={() => {
                refreshDashboardData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
