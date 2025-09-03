// components/guards/EnhancedGuardDashboard.tsx
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase";

import PrayerTimeIndicator from "@/components/shared/PrayerTimeIndicator";
import AssessmentDashboardCard from "./AssessmentDashboardCard";

interface UserData {
  // Assessment results
  english_level?: string;
  assessment_score?: number;
  strengths?: string[];
  recommendations?: string[];

  // Progress data
  completed_scenarios: number;
  total_scenarios: number;
  current_streak: number;
  average_score: number;
  hours_learned: number;
  last_activity: string;

  // Personalization
  learning_path?: string[];
  next_milestone?: string;
  weekly_goal: number;
  confidence_level: number;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personalizedScenarios, setPersonalizedScenarios] = useState<
    PersonalizedScenario[]
  >([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchPersonalizedData();
  }, [userId]);

  const fetchPersonalizedData = async () => {
    try {
      // Fetch user profile with assessment data
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Fetch learning progress
      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);

      if (progressError) throw progressError;

      // Fetch streak data
      const { data: streak, error: streakError } = await supabase
        .from("user_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle();

      // Calculate personalized metrics
      const completedCount =
        progress?.filter((p) => p.completion_status === "completed").length ||
        0;
      const averageScore =
        progress?.length > 0
          ? progress.reduce((sum, p) => sum + (p.score || 0), 0) /
            progress.length
          : 0;

      // Get total scenarios
      const { count: totalScenarios } = await supabase
        .from("scenarios")
        .select("id", { count: "exact", head: true })
        .eq("segment", "guard");

      const personalizedUserData: UserData = {
        english_level: profile.english_level,
        assessment_score: profile.assessment_score,
        strengths: profile.strengths || [],
        recommendations: profile.recommendations || [],
        completed_scenarios: completedCount,
        total_scenarios: totalScenarios || 24,
        current_streak: streak?.current_streak || 0,
        average_score: Math.round(averageScore),
        hours_learned: Math.round(completedCount * 0.5 * 10) / 10, // Estimate
        last_activity: new Date().toISOString(),
        weekly_goal: 5,
        confidence_level: profile.assessment_score || 50,
      };

      setUserData(personalizedUserData);

      // Generate personalized content
      await generatePersonalizedScenarios(profile);
      await generateAchievements(personalizedUserData);
      generateMotivationalMessage(personalizedUserData);
    } catch (error) {
      console.error("Error fetching personalized data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedScenarios = async (profile: {
    english_level?: string;
    recommendations?: string[];
  }) => {
    // Get scenarios based on user's level and recommendations
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

      // Boost relevance based on user's level
      if (scenario.difficulty.toLowerCase() === level.toLowerCase()) {
        relevanceScore += 30;
        whyRecommended = `Matches your ${level} level perfectly`;
      }

      // Boost relevance based on recommendations
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

    // Sort by relevance and take top 4
    setPersonalizedScenarios(
      personalized
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 4)
    );
  };

  const generateAchievements = async (data: UserData) => {
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
        total: Math.floor(data.total_scenarios / 5), // Rough estimate
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
        progress: 2, // Placeholder
        total: 4,
      },
    ];

    setAchievements(achievements);
  };

  const generateMotivationalMessage = (data: UserData) => {
    const level = data.english_level;
    const streak = data.current_streak;
    const completed = data.completed_scenarios;
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
  };

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
      {/* Personalized Welcome */}
      <div
        className={`bg-gradient-to-r ${levelInfo.color} rounded-xl p-6 text-white`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{levelInfo.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{levelInfo.title}</h2>
                <p className="text-white/90">
                  {userData.english_level} Level •{" "}
                  {userData.completed_scenarios} scenarios completed
                </p>
              </div>
            </div>
            <p className="text-white/95 text-lg max-w-2xl">
              {motivationalMessage}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{userData.current_streak}</div>
            <div className="text-white/90">day streak</div>
          </div>
        </div>
      </div>

      {/* Prayer Times */}
      <PrayerTimeIndicator />

      {/* Assessment + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AssessmentDashboardCard userId={userId} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Progress Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {userData.completed_scenarios}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userData.average_score}%
                  </div>
                  <div className="text-xs text-gray-500">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userData.hours_learned}h
                  </div>
                  <div className="text-xs text-gray-500">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userData.confidence_level}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>
                    {userData.completed_scenarios}/{userData.total_scenarios}{" "}
                    scenarios
                  </span>
                </div>
                <Progress value={completionPct} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(completionPct)}% complete
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
            Recommended Just For You
          </CardTitle>
          <p className="text-sm text-gray-600">
            Based on your {userData.english_level} level and learning goals
          </p>
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
                    <Badge
                      variant={
                        scenario.relevance_score >= 80 ? "default" : "secondary"
                      }
                    >
                      {scenario.relevance_score}% match
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{scenario.difficulty}</span>
                    <span>•</span>
                    <span>{scenario.duration}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600"
                  >
                    Start
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
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
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4
                    className={`font-semibold mb-1 ${
                      achievement.unlocked ? "text-yellow-800" : "text-gray-600"
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {achievement.description}
                  </p>

                  {achievement.progress !== undefined && achievement.total && (
                    <div>
                      <Progress
                        value={(achievement.progress / achievement.total) * 100}
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Learning Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600">
              <Play className="w-6 h-6" />
              <span className="font-medium">Continue Journey</span>
              <span className="text-xs opacity-90">
                Pick up where you left off
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 border-purple-300 hover:bg-purple-50"
            >
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Practice Conversation</span>
              <span className="text-xs text-gray-600">AI-powered chat</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 border-orange-300 hover:bg-orange-50"
            >
              <Trophy className="w-6 h-6 text-orange-600" />
              <span className="font-medium">Challenge Mode</span>
              <span className="text-xs text-gray-600">Test your skills</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
