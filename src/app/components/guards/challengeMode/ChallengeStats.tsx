"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChallengeStats } from "@/utils/challengeApi";
import { Trophy } from "lucide-react";

export const ChallengeStatsCard = ({
  challengeStats,
  loading,
}: {
  challengeStats: ChallengeStats | null;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Challenge Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!challengeStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Challenge Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Ready for Your First Challenge?
            </h3>
            <p className="text-gray-500 mb-4">
              Complete challenges to see your performance statistics here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    total_challenges_completed,
    average_challenge_score,
    best_challenge_streak,
    recent_results,
  } = challengeStats;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Challenge Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {total_challenges_completed}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {average_challenge_score}
            </div>
            <div className="text-xs text-gray-500">Avg Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {best_challenge_streak}
            </div>
            <div className="text-xs text-gray-500">Best Streak</div>
          </div>
        </div>

        {recent_results.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-sm">Recent Challenges</h4>
            <div className="space-y-2">
              {recent_results.slice(0, 3).map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {result.challenge_title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(result.completed_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{result.score}</div>
                    <div className="text-xs text-gray-500">
                      {result.accuracy_percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
