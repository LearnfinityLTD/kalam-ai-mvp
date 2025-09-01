// components/guards/GuardDashboard.tsx
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
  CheckCircle,
  Star,
  Book,
  ArrowRight,
  Play,
  Users,
} from "lucide-react";

import PrayerTimeIndicator from "@/components/shared/PrayerTimeIndicator";
import ProgressTracker from "./ProgressTracker";
import { StatsCard } from "./StatsCard";
import ScenarioPractice from "./ScenarioPractice";

interface GuardStats {
  totalScenarios: number;
  completedScenarios: number;
  currentStreak: number;
  averageScore: number;
  hoursLearned: number;
  lastActivity: string; // ISO date
}

interface RecentActivity {
  id: number;
  type: "completed" | "practiced" | "streak";
  title: string;
  score?: number;
  date: string; // ISO date
}

interface UpcomingScenario {
  id: number;
  title: string;
  difficulty: string;
  duration: string;
}

export default function GuardDashboard({
  userId,
  email, // optional, for contextual copy only (not a header)
}: {
  userId: string;
  email?: string;
}) {
  const [stats, setStats] = useState<GuardStats>({
    totalScenarios: 24,
    completedScenarios: 8,
    currentStreak: 3,
    averageScore: 85.5,
    hoursLearned: 12.5,
    lastActivity: "2025-08-29",
  });

  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Demo lists – replace with real data fetches as needed
  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "completed",
      title: "Welcome Greeting",
      score: 92,
      date: "2025-08-29",
    },
    {
      id: 2,
      type: "practiced",
      title: "Prayer Time Information",
      score: 78,
      date: "2025-08-28",
    },
    {
      id: 3,
      type: "streak",
      title: "Maintained 3-day streak",
      date: "2025-08-27",
    },
  ];

  const upcomingScenarios: UpcomingScenario[] = [
    {
      id: 1,
      title: "Handling Emergency Situations",
      difficulty: "Advanced",
      duration: "15 min",
    },
    {
      id: 2,
      title: "Visitor Registration Process",
      difficulty: "Intermediate",
      duration: "10 min",
    },
    {
      id: 3,
      title: "Cultural Sensitivity Training",
      difficulty: "Beginner",
      duration: "8 min",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completionPercentage =
    stats.totalScenarios > 0
      ? (stats.completedScenarios / stats.totalScenarios) * 100
      : 0;

  if (loading) {
    return <div className="text-center py-10">Loading dashboard…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Context strip (NOT a header): small, inline helper text */}
      <div className="flex items-end justify-between">
        <p className="text-sm text-gray-600">
          {email ? `Welcome back, ${email}.` : "Welcome back."} Keep building
          your English communication skills.
        </p>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {currentTime.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Prayer times + overall progress */}
      <PrayerTimeIndicator />
      <ProgressTracker userId={userId} />

      {/* Learning Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Target className="h-6 w-6" />
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>
                Completed {stats.completedScenarios}/{stats.totalScenarios}{" "}
                scenarios
              </span>
              <span className="font-semibold">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center text-orange-600 font-medium">
              <Trophy className="w-5 h-5 mr-2" />
              {stats.currentStreak}-day streak
            </div>
            <Badge variant="default">Keep it up!</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          subtitle="This month"
          icon={Star}
          color="yellow"
        />
        <StatsCard
          title="Hours Learned"
          value={`${stats.hoursLearned}h`}
          subtitle="This month"
          icon={Clock}
          color="purple"
        />
        <StatsCard
          title="Last Activity"
          value={new Date(stats.lastActivity).toLocaleDateString("en-GB")}
          subtitle="Recent"
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Total Scenarios"
          value={stats.totalScenarios}
          subtitle="Available"
          icon={Book}
          color="blue"
        />
      </div>

      {/* Activity + Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 py-2"
                >
                  <div className="flex-shrink-0">
                    {activity.type === "completed" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {activity.type === "practiced" && (
                      <Play className="w-5 h-5 text-blue-500" />
                    )}
                    {activity.type === "streak" && (
                      <Trophy className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  {typeof activity.score === "number" && (
                    <Badge
                      variant={
                        activity.score >= 80
                          ? "default"
                          : activity.score >= 60
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {activity.score}%
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <ScenarioPractice userId={userId} />
      </div>

      {/* Recommended Practice */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recommended Practice</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {scenario.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {scenario.difficulty}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {scenario.duration}
                    </span>
                  </div>
                </div>
                <Button size="sm" className="ml-3">
                  Start
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center space-y-2">
              <Play className="w-5 h-5" />
              <span>Start Practice</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-2"
            >
              <Users className="w-5 h-5" />
              <span>Join Group Session</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-2"
            >
              <Target className="w-5 h-5" />
              <span>View Detailed Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
