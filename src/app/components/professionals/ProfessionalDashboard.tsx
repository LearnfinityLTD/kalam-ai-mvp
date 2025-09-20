// components/dashboard/ProfessionalDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Target,
  Clock,
  Star,
  TrendingUp,
  MessageCircle,
  BookOpen,
  Award,
  Play,
  BarChart3,
  Calendar,
  Users,
  Flame,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import { PrayerTimeWidget } from "@/components/shared/widgets/PrayerTimeWidget";
import { IslamicCalendarWidget } from "@/components/shared/widgets/IslamicCalendarWidget";

interface DashboardProps {
  userId: string;
  userType: "guard" | "professional" | "tourist_guide";
  onLogout?: () => Promise<void>;
}

interface UserStats {
  completedScenarios: number;
  totalScenarios: number;
  averageScore: number;
  totalTimeSpent: number;
  currentLevel: string;
  streakDays: number;
  confidenceScore: number;
}

interface RecommendedScenario {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedDuration: number;
  matchPercentage: number;
  industryFocus: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: string;
}

interface RecentActivity {
  id: string;
  score: number;
  completed_at: string;
  session_type: string;
  scenario: {
    title: string;
    difficulty: string;
  } | null;
}

interface SessionData {
  completed_at: string;
  score?: number;
}

interface ScenarioData {
  difficulty: string;
  user_type: string;
}

export function ProfessionalDashboard({
  userId,
  userType,
  onLogout,
}: DashboardProps) {
  const { t } = useI18n();
  const supabase = createClient();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedScenario[]>(
    []
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user statistics
      const statsData = await fetchUserStatistics();
      setStats(statsData);

      // Fetch recommendations
      const recommendationsData = await fetchRecommendations();
      setRecommendations(recommendationsData);

      // Fetch achievements
      const achievementsData = await fetchAchievements();
      setAchievements(achievementsData);

      // Fetch recent activity
      const activityData = await fetchRecentActivity();
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatistics = async (): Promise<UserStats> => {
    // Get completed sessions
    const { data: sessions } = await supabase
      .from("learning_sessions")
      .select(
        `
        id,
        score,
        time_spent,
        completed_at,
        scenario_id,
        scenarios (title, difficulty)
      `
      )
      .eq("user_id", userId)
      .eq("status", "completed");

    // Get total available scenarios for user type
    const { data: totalScenarios } = await supabase
      .from("scenarios")
      .select("id")
      .or(`user_type.eq.${userType},user_type.eq.all`);

    // Calculate statistics
    const completedScenarios = sessions?.length || 0;
    const totalScenariosCount = totalScenarios?.length || 0;
    const averageScore = sessions?.length
      ? sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length
      : 0;
    const totalTimeSpent =
      sessions?.reduce((sum, s) => sum + (s.time_spent || 0), 0) || 0;

    // Get user's current level
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("english_level")
      .eq("id", userId)
      .single();

    // Calculate streak (simplified - you might want to implement more sophisticated logic)
    const streakDays = calculateStreakDays(sessions || []);

    // Calculate confidence score based on recent performance
    const confidenceScore = calculateConfidenceScore(sessions || []);

    return {
      completedScenarios,
      totalScenarios: totalScenariosCount,
      averageScore: Math.round(averageScore),
      totalTimeSpent: Math.round(totalTimeSpent / 3600), // Convert to hours
      currentLevel: userProfile?.english_level || "A1",
      streakDays,
      confidenceScore: Math.round(confidenceScore),
    };
  };

  const fetchRecommendations = async (): Promise<RecommendedScenario[]> => {
    // Get user's completed scenarios
    const { data: completedSessions } = await supabase
      .from("learning_sessions")
      .select("scenario_id")
      .eq("user_id", userId)
      .eq("status", "completed");

    const completedScenarioIds =
      completedSessions?.map((s) => s.scenario_id) || [];

    // Get recommended scenarios (not completed, appropriate level)
    const { data: scenarios } = await supabase
      .from("scenarios")
      .select("*")
      .or(`user_type.eq.${userType},user_type.eq.all`)
      .not("id", "in", `(${completedScenarioIds.join(",") || "none"})`)
      .limit(6);

    return (
      scenarios?.map((scenario) => ({
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        difficulty: scenario.difficulty,
        estimatedDuration: scenario.estimated_duration,
        industryFocus: scenario.industry_focus || "general",
        matchPercentage: calculateMatchPercentage(
          scenario,
          stats?.currentLevel || "A1"
        ),
      })) || []
    );
  };

  const fetchAchievements = async (): Promise<Achievement[]> => {
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .limit(10);

    return (
      achievements?.map((ach) => ({
        id: ach.id,
        title: ach.achievement_type,
        description: ach.achievement_data?.description || "",
        icon: ach.achievement_data?.icon || "trophy",
        earnedAt: new Date(ach.earned_at),
        category: ach.achievement_data?.category || "general",
      })) || []
    );
  };

  const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
    const { data: recentSessions } = await supabase
      .from("learning_sessions")
      .select(
        `
      id,
      score,
      completed_at,
      session_type,
      scenarios!inner(title, difficulty)
    `
      )
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5);

    return (recentSessions || []) as unknown as RecentActivity[];
  };

  const calculateStreakDays = (sessions: SessionData[]): number => {
    if (!sessions.length) return 0;

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Sort sessions by date
    const sessionDates = sessions
      .map((s) => new Date(s.completed_at).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (const sessionDate of sessionDates) {
      const sessionDay = new Date(sessionDate);
      const diffTime = currentDate.getTime() - sessionDay.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
        currentDate = sessionDay;
      } else if (diffDays > streak + 1) {
        break;
      }
    }

    return streak;
  };

  const calculateConfidenceScore = (sessions: SessionData[]): number => {
    if (!sessions.length) return 0;

    // Get recent sessions (last 5)
    const recentSessions = sessions
      .sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
      )
      .slice(0, 5);

    if (!recentSessions.length) return 0;

    const avgScore =
      recentSessions.reduce((sum, s) => sum + (s.score || 0), 0) /
      recentSessions.length;
    const consistency = calculateConsistency(
      recentSessions.map((s) => s.score || 0)
    );

    return avgScore * 0.7 + consistency * 0.3;
  };

  const calculateConsistency = (scores: number[]): number => {
    if (scores.length < 2) return 100;

    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    const stdDev = Math.sqrt(variance);

    // Convert standard deviation to consistency score (lower stdDev = higher consistency)
    return Math.max(0, 100 - stdDev * 2);
  };

  const calculateMatchPercentage = (
    scenario: ScenarioData,
    userLevel: string
  ): number => {
    const levelValues = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
    const userLevelValue =
      levelValues[userLevel as keyof typeof levelValues] || 1;
    const scenarioLevelValue =
      levelValues[scenario.difficulty as keyof typeof levelValues] || 1;

    const levelDiff = Math.abs(userLevelValue - scenarioLevelValue);
    const baseMatch = Math.max(0, 100 - levelDiff * 20);

    // Add bonus for user type match
    const typeMatch =
      scenario.user_type === userType || scenario.user_type === "all" ? 10 : 0;

    return Math.min(100, baseMatch + typeMatch);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      A1: "bg-green-100 text-green-800",
      A2: "bg-green-100 text-green-800",
      B1: "bg-yellow-100 text-yellow-800",
      B2: "bg-orange-100 text-orange-800",
      C1: "bg-red-100 text-red-800",
      C2: "bg-red-100 text-red-800",
    };
    return (
      colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const formatTime = (hours: number) => {
    return hours < 1 ? `${Math.round(hours * 60)}m` : `${Math.round(hours)}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  كلام
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  KalamAI
                </span>
              </div>

              {/* Logout Button */}
              {onLogout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900"
                  title="Logout"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                كلام
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                KalamAI
              </span>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900"
                title="Logout"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Hero Stats Section */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {stats?.currentLevel}
                  </div>
                  <div className="text-sm opacity-90">
                    {t("dashboard.currentLevel")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
                    <Flame className="h-6 w-6" />
                    {stats?.streakDays}
                  </div>
                  <div className="text-sm opacity-90">
                    {t("dashboard.dayStreak")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {stats?.averageScore}%
                  </div>
                  <div className="text-sm opacity-90">
                    {t("dashboard.avgScore")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {stats?.totalTimeSpent}h
                  </div>
                  <div className="text-sm opacity-90">
                    {t("dashboard.timeSpent")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t("dashboard.progressOverview")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t("dashboard.scenariosCompleted")}</span>
                        <span>
                          {stats?.completedScenarios}/{stats?.totalScenarios}
                        </span>
                      </div>
                      <Progress
                        value={
                          ((stats?.completedScenarios || 0) /
                            (stats?.totalScenarios || 1)) *
                          100
                        }
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{t("dashboard.confidence")}</span>
                        <span>{stats?.confidenceScore}%</span>
                      </div>
                      <Progress
                        value={stats?.confidenceScore || 0}
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats?.completedScenarios}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("dashboard.completed")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats?.averageScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("dashboard.avgScore")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatTime(stats?.totalTimeSpent || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("dashboard.timeSpent")}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Scenarios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t("dashboard.recommendedScenarios")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.slice(0, 4).map((scenario) => (
                      <Card
                        key={scenario.id}
                        className="border hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">
                              {scenario.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {scenario.matchPercentage}% {t("dashboard.match")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {scenario.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`text-xs ${getDifficultyColor(
                                  scenario.difficulty
                                )}`}
                              >
                                {scenario.difficulty}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {scenario.estimatedDuration}m
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3 mr-1" />
                              {t("dashboard.start")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t("dashboard.recentActivity")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {t("dashboard.completed")}{" "}
                              {activity.scenario?.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(
                                activity.completed_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{activity.score}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prayer Times Widget */}
              <PrayerTimeWidget />

              {/* Islamic Calendar Widget */}
              <IslamicCalendarWidget />

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t("dashboard.achievements")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.slice(0, 5).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted"
                      >
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Star className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {achievement.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {achievement.earnedAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t("dashboard.quickActions")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t("dashboard.practiceChat")}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    {t("dashboard.takeChallenge")}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t("dashboard.viewProgress")}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t("dashboard.schedule")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
