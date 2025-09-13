// components/guards/EnhancedTourGuideDashboard.tsx - Final Production Ready Version
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  ArrowRight,
  Play,
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
  Settings,
  Menu,
  Home,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { getUserChallengeStats, ChallengeStats } from "@/utils/challengeApi";
import PrayerTimeIndicator from "@/components/shared/PrayerTimeIndicator";
import AssessmentDashboardCard from "@/app/components/shared/AssessmentDashboardCard";
import PersonalizedDashboard from "@/app/components/shared/PersonalizedDashboard";
import PracticeConversationButton from "../shared/PracticeConversationButton";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitch } from "@/app/components/shared/language/LanguageSwitch";
import { JourneyButton } from "../journey/JourneyButton";

interface UserData {
  user_type?: string;
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
  sidebar_collapsed?: boolean;
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

export default function EnhancedTourGuideDashboard({
  userId,
  email,
  onLogout,
}: {
  userId: string;
  email?: string;
  onLogout?: () => Promise<void>;
}) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const supabase = createClient();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    show_prayer_times: true,
    prayer_calculation_method: 5,
    prayer_school: 1,
    sidebar_collapsed: false,
  });
  const [personalizedScenarios, setPersonalizedScenarios] = useState<
    PersonalizedScenario[]
  >([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showChallengeMode, setShowChallengeMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPersonalizedPath, setShowPersonalizedPath] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] =
    useState("preferences");
  const [settingsPreferences, setSettingsPreferences] = useState({
    soundEffects: true,
    animations: true,
    motivationalMessages: true,
    listeningExercises: true,
    darkMode: "off" as "off" | "on" | "auto",
  });

  // Apply dark mode when settings change
  useEffect(() => {
    const applyDarkMode = () => {
      const html = document.documentElement;

      if (settingsPreferences.darkMode === "on") {
        html.classList.add("dark");
      } else if (settingsPreferences.darkMode === "off") {
        html.classList.remove("dark");
      } else if (settingsPreferences.darkMode === "auto") {
        // Auto mode - check system preference
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        if (mediaQuery.matches) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    };

    applyDarkMode();

    // Listen for system theme changes in auto mode
    if (settingsPreferences.darkMode === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyDarkMode();
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settingsPreferences.darkMode]);

  // Sidebar navigation items
  const sidebarItems = [
    { id: "dashboard", label: t("nav.dashboard"), icon: Home, active: true },
    {
      id: "learning-path",
      label: "AI Learning Path",
      icon: Sparkles,
      active: false,
      isNew: true, // Add badge indicator
    },
    {
      id: "progress",
      label: t("nav.progress"),
      icon: BarChart3,
      active: false,
    },
    {
      id: "scenarios",
      label: t("nav.scenarios"),
      icon: BookOpen,
      active: false,
    },
    {
      id: "practice",
      label: t("nav.practice"),
      icon: MessageCircle,
      active: false,
    },
    {
      id: "achievements",
      label: t("nav.achievements"),
      icon: Trophy,
      active: false,
    },
    { id: "settings", label: t("nav.settings"), icon: Settings, active: false },
  ];

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
          sidebar_collapsed: data.sidebar_collapsed ?? false,
        };
        setUserPreferences(prefs);
        setSidebarCollapsed(prefs.sidebar_collapsed);
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
        sidebar_collapsed: false,
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

  const toggleSidebar = useCallback(async () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);

    try {
      await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          sidebar_collapsed: newCollapsed,
          show_prayer_times: userPreferences.show_prayer_times,
          prayer_calculation_method: userPreferences.prayer_calculation_method,
          prayer_school: userPreferences.prayer_school,
          language_preference: locale,
        },
        { onConflict: "user_id" }
      );

      setUserPreferences((prev) => ({
        ...prev,
        sidebar_collapsed: newCollapsed,
      }));
    } catch (error) {
      console.error("Error updating sidebar preference:", error);
    }
  }, [userId, sidebarCollapsed, userPreferences, supabase, locale]);

  const togglePrayerTimes = useCallback(async () => {
    const newShowPrayerTimes = !userPreferences.show_prayer_times;

    try {
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          show_prayer_times: newShowPrayerTimes,
          prayer_calculation_method: userPreferences.prayer_calculation_method,
          prayer_school: userPreferences.prayer_school,
          sidebar_collapsed: userPreferences.sidebar_collapsed,
          language_preference: locale,
        },
        { onConflict: "user_id" }
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

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setShowSettings(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "learning-path":
        setShowSettings(false);
        setShowPersonalizedPath(true);
        break;
      case "settings":
        setShowSettings(true);
        break;
      case "help-center":
        // Navigate to help center page
        router.push(`/guards/help-center?userId=${userId}`);
        break;
      case "progress":
      case "scenarios":
      case "practice":
      case "achievements":
        router.push(`/guards/${itemId}?userId=${userId}`);
        break;
      default:
        console.log(`Navigation to ${itemId} not implemented yet`);
    }
  };

  const generatePersonalizedScenarios = useCallback(
    async (profile: { english_level?: string; recommendations?: string[] }) => {
      const { data: scenarios, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("segment", "guard")
        .limit(4);

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
        personalized.sort((a, b) => b.relevance_score - a.relevance_score)
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
        id: "consistent_learner",
        title: "Consistent Learner",
        description: "Complete your weekly goal 4 weeks in a row",
        icon: "⭐",
        unlocked: false,
        progress: 2,
        total: 4,
      },
    ];

    setAchievements(achievements);
  }, []);

  const isActiveRoute = (itemId: string) => {
    if (itemId === "settings") return showSettings;
    if (itemId === "learning-path") return showPersonalizedPath;
    if (itemId === "dashboard") return !showSettings && !showPersonalizedPath;
    return false;
  };
  const generateMotivationalMessage = useCallback((data: UserData) => {
    const streak = data.current_streak;

    let message = "";

    if (streak === 0) {
      message =
        "Ready to start your English journey? Complete a scenario today to begin your streak!";
    } else if (streak < 3) {
      message = `${streak} day${
        streak === 1 ? "" : "s"
      } strong! Keep going to build momentum.`;
    } else {
      message = `Amazing ${streak}-day streak! You're becoming a true English communication expert.`;
    }

    setMotivationalMessage(message);
  }, []);

  const saveDarkModePreference = useCallback(
    async (darkMode: "off" | "on" | "auto") => {
      try {
        await supabase.from("user_preferences").upsert(
          {
            user_id: userId,
            dark_mode: darkMode,
            show_prayer_times: userPreferences.show_prayer_times,
            prayer_calculation_method:
              userPreferences.prayer_calculation_method,
            prayer_school: userPreferences.prayer_school,
            sidebar_collapsed: userPreferences.sidebar_collapsed,
            language_preference: locale,
          },
          { onConflict: "user_id" }
        );
      } catch (error) {
        console.error("Error saving dark mode preference:", error);
      }
    },
    [userId, userPreferences, supabase, locale]
  );

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
        user_type: profile.user_type,
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
    await fetchUserPreferences();
  }, [fetchPersonalizedData, fetchUserPreferences]);

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
      badge: "A1",
      badgeColor: "bg-red-500",
      title: "Foundation Builder",
    },
    A2: {
      color: "from-orange-400 to-orange-600",
      badge: "A2",
      badgeColor: "bg-orange-500",
      title: "Confident Helper",
    },
    B1: {
      color: "from-yellow-400 to-yellow-600",
      badge: "B1",
      badgeColor: "bg-yellow-500",
      title: "Cultural Bridge",
    },
    B2: {
      color: "from-blue-400 to-blue-600",
      badge: "B2",
      badgeColor: "bg-blue-500",
      title: "Expert Communicator",
    },
    C1: {
      color: "from-green-400 to-green-600",
      badge: "C1",
      badgeColor: "bg-green-500",
      title: "Master Ambassador",
    },
  }[userData.english_level || "A1"] || {
    color: "from-gray-400 to-gray-600",
    badge: "?",
    badgeColor: "bg-gray-500",
    title: "Learning",
  };

  return (
    <div
      className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors"
      dir="ltr"
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col order-first`}
        style={{ direction: "ltr" }}
      >
        {/* User Profile & Controls - At Top */}
        {sidebarCollapsed ? (
          /* Collapsed Header */
          <div className="p-3 border-b space-y-4">
            {/* Logo centered */}
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                كلام
              </div>
            </div>

            {/* Controls stacked */}
            <div className="flex flex-col gap-3 items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="w-10 h-10 p-0 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {onLogout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-10 h-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Logout"
                >
                  <svg
                    className="w-5 h-5"
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
        ) : (
          /* Expanded Header */
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  كلام
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  KalamAI
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSidebar}
                  className="flex-shrink-0"
                >
                  <Menu className="w-4 h-4" />
                </Button>

                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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

            <div className="px-2 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {userData?.full_name || email?.split("@")[0] || "Guardian"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                {email}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${sidebarCollapsed ? "p-2" : "p-4"}`}>
          <div
            className={`space-y-2 ${
              sidebarCollapsed ? "flex flex-col items-center" : ""
            }`}
          >
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`${
                    sidebarCollapsed
                      ? "w-12 h-12 flex items-center justify-center"
                      : "w-full flex items-center gap-3 px-3 py-2"
                  } rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <IconComponent className="w-6 h-6" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.label}</span>
                      {item.isNew && (
                        <Badge
                          variant="secondary"
                          className="ml-auto bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5"
                        >
                          NEW
                        </Badge>
                      )}
                    </>
                  )}
                  {/* New indicator dot for collapsed sidebar */}
                  {sidebarCollapsed && item.isNew && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] overflow-auto shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <Button
                variant="ghost"
                onClick={() => setShowSettings(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex">
              {/* Settings Sidebar */}
              <div className="w-80 border-r dark:border-gray-700 p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Account
                    </h2>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveSettingsSection("preferences")}
                        className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                          activeSettingsSection === "preferences"
                            ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        Preferences
                      </button>
                      <button
                        onClick={() => setActiveSettingsSection("privacy")}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          activeSettingsSection === "privacy"
                            ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-500 font-medium"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        Privacy settings
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Support
                    </h2>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          handleNavigation("help-center");
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Help Center
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex-1 p-6">
                <div className="max-w-2xl">
                  {activeSettingsSection === "preferences" && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Preferences
                      </h2>

                      {/* Lesson Experience */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-6 pb-2 border-b dark:border-gray-600">
                          Lesson experience
                        </h3>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              Sound effects
                            </span>
                            <button
                              onClick={() =>
                                setSettingsPreferences((prev) => ({
                                  ...prev,
                                  soundEffects: !prev.soundEffects,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settingsPreferences.soundEffects
                                  ? "bg-blue-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settingsPreferences.soundEffects
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              Animations
                            </span>
                            <button
                              onClick={() =>
                                setSettingsPreferences((prev) => ({
                                  ...prev,
                                  animations: !prev.animations,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settingsPreferences.animations
                                  ? "bg-blue-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settingsPreferences.animations
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              Motivational messages
                            </span>
                            <button
                              onClick={() =>
                                setSettingsPreferences((prev) => ({
                                  ...prev,
                                  motivationalMessages:
                                    !prev.motivationalMessages,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settingsPreferences.motivationalMessages
                                  ? "bg-blue-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settingsPreferences.motivationalMessages
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              Listening exercises
                            </span>
                            <button
                              onClick={() =>
                                setSettingsPreferences((prev) => ({
                                  ...prev,
                                  listeningExercises: !prev.listeningExercises,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settingsPreferences.listeningExercises
                                  ? "bg-blue-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settingsPreferences.listeningExercises
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Appearance */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-6 pb-2 border-b dark:border-gray-600">
                          Appearance
                        </h3>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">
                              Dark mode
                            </span>
                            <select
                              value={settingsPreferences.darkMode}
                              onChange={(e) => {
                                const newMode = e.target.value as
                                  | "off"
                                  | "on"
                                  | "auto";
                                setSettingsPreferences((prev) => ({
                                  ...prev,
                                  darkMode: newMode,
                                }));
                                saveDarkModePreference(newMode);
                              }}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 min-w-[120px]"
                            >
                              <option value="off">OFF</option>
                              <option value="on">ON</option>
                              <option value="auto">AUTO</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSettingsSection === "privacy" && (
                    <>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Privacy Settings
                      </h2>

                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-6 pb-2 border-b dark:border-gray-600">
                            Data & Privacy
                          </h3>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  Analytics & Performance
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Help improve the app by sharing usage data
                                </p>
                              </div>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  Personalized Recommendations
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Use learning data to suggest relevant content
                                </p>
                              </div>
                              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-6 pb-2 border-b dark:border-gray-600">
                            Account Actions
                          </h3>

                          <div className="space-y-4">
                            <Button
                              variant="outline"
                              className="w-full justify-start text-gray-700 dark:text-gray-300"
                            >
                              Download My Data
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div style={{ direction: locale === "ar" ? "rtl" : "ltr" }}>
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t("common.dashboard")}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Welcome back,{" "}
                  {userData.full_name?.split(" ")[0] || "Guardian"}
                </p>
              </div>
              <LanguageSwitch />
            </div>
            {showPersonalizedPath ? (
              <>
                {/* Personalized Dashboard Component */}
                <PersonalizedDashboard
                  userData={userData}
                  userId={userId}
                  userType={userData.user_type || "guard"}
                />
              </>
            ) : (
              <>
                {/* Your existing dashboard content - Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* Add AI Path Quick Access */}
                    <Button
                      onClick={() => setShowPersonalizedPath(true)}
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-600 dark:text-yellow-400"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Learning Path
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-yellow-100 text-yellow-800 text-xs"
                      >
                        NEW
                      </Badge>
                    </Button>
                  </div>
                </div>

                {/* Hero Section */}
                <Card
                  className={`bg-gradient-to-r ${levelInfo.color} text-white border-0`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                          <div
                            className={`${levelInfo.badgeColor} text-white font-bold text-lg px-3 py-1 rounded-lg`}
                          >
                            {levelInfo.badge}
                          </div>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">
                            {levelInfo.title}
                          </h2>
                          <p className="text-white/90">
                            {userData.english_level} Level •{" "}
                            {userData.completed_scenarios} scenarios completed
                          </p>
                          <p className="text-white/95 mt-2 max-w-lg">
                            {motivationalMessage}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-4xl font-bold">
                          {userData.current_streak}
                        </div>
                        <div className="text-white/90">day streak</div>

                        {/* Prayer Times Toggle */}
                        <Button
                          onClick={togglePrayerTimes}
                          variant="ghost"
                          size="sm"
                          className="mt-4 text-white/80 hover:text-white hover:bg-white/20"
                        >
                          {userPreferences.show_prayer_times ? (
                            <EyeOff className="w-4 h-4 mr-2" />
                          ) : (
                            <Eye className="w-4 h-4 mr-2" />
                          )}
                          {userPreferences.show_prayer_times
                            ? "Hide Prayers"
                            : "Show Prayers"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prayer Times - Collapsible */}
                {userPreferences.show_prayer_times && (
                  <PrayerTimeIndicator
                    calculationMethod={
                      userPreferences.prayer_calculation_method
                    }
                    school={userPreferences.prayer_school}
                    onToggleVisibility={togglePrayerTimes}
                    userId={userId}
                  />
                )}

                {/* Primary Actions */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Play className="h-5 w-5" />
                      Continue Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* AI Learning Path Teaser */}
                      <Button
                        onClick={() => setShowPersonalizedPath(true)}
                        className="h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 relative"
                      >
                        <Sparkles className="w-10 h-10" />
                        <span className="font-medium text-base">
                          AI Learning Path
                        </span>
                        <span className="text-sm opacity-90">
                          Personalized for you
                        </span>
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1">
                          NEW
                        </Badge>
                      </Button>
                      {/* Continue Journey */}
                      <JourneyButton
                        userId={userId}
                        userLevel={userData.english_level || "A1"}
                        className="h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700"
                        onScenarioStart={(scenarioId) => {
                          router.push(
                            `/guards/scenarios/${scenarioId}?userId=${userId}`
                          );
                        }}
                      />

                      {/* Practice Conversation */}
                      <PracticeConversationButton
                        userId={userId}
                        segment="guard"
                        icon={Sparkles}
                        title="Practice Conversation"
                        subtitle="AI-powered chat"
                        className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-purple-300 hover:bg-purple-50 rounded-lg"
                        onCreated={(sid) => console.log("Session:", sid)}
                      />

                      {/* Challenge Mode */}
                      <Button
                        variant="outline"
                        className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-orange-300 hover:bg-orange-50 rounded-lg"
                        onClick={() => setShowChallengeMode(true)}
                      >
                        <Trophy className="w-10 h-10 text-orange-600" />
                        <span className="font-medium text-base dark:text-white">
                          Challenge Mode
                        </span>
                        <span className="text-sm text-gray-600 dark:text-white">
                          Test your skills
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AssessmentDashboardCard userId={userId} />

                  {/* Progress Overview */}
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 dark:text-white">
                        <TrendingUp className="h-5 w-5" />
                        Your Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-emerald-600">
                              {userData.completed_scenarios}
                            </div>
                            <div className="text-xs text-gray-500">
                              Completed
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {userData.average_score}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Avg Score
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Overall Progress</span>
                            <span>
                              {userData.completed_scenarios}/
                              {userData.total_scenarios}
                            </span>
                          </div>
                          <Progress value={completionPct} className="h-3" />
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round(completionPct)}% complete
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommended Scenarios */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Recommended Just For You
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Based on your {userData.english_level} level and learning
                      goals
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
                            <Badge
                              variant={
                                scenario.relevance_score >= 80
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {scenario.relevance_score}% match
                            </Badge>
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

                {/* Recent Achievements */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {achievements.slice(0, 3).map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            achievement.unlocked
                              ? "border-yellow-200 bg-yellow-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">
                              {achievement.icon}
                            </div>
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
                                      (achievement.progress /
                                        achievement.total) *
                                      100
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Challenge Mode Modal */}
      {showChallengeMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  كلام
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Challenge Mode
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setShowChallengeMode(false);
                  refreshDashboardData();
                }}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
