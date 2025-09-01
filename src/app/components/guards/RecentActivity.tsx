"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Play, CheckCircle } from "lucide-react";

const mockRecentActivities = [
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

export const RecentActivity = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {mockRecentActivities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3 py-2">
            <div className="flex-shrink-0">
              {activity.type === "completed" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {activity.type === "practiced" && (
                <Play className="w-5 h-5 text-blue-500" />
              )}
              {activity.type === "streak" && (
                <Flame className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
            {activity.score && (
              <Badge
                variant={
                  activity.score >= 80
                    ? "success"
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
);
