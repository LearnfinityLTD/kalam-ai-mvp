// components/shared/AssessmentDashboardCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Target,
  RotateCcw,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

interface UserAssessmentData {
  english_level?: string;
  assessment_score?: number;
  strengths?: string[];
  recommendations?: string[];
  assessment_completed: boolean;
  updated_at: string;
}

export default function AssessmentDashboardCard({
  userId,
}: {
  userId: string;
}) {
  const [assessmentData, setAssessmentData] =
    useState<UserAssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRetakeOption, setShowRetakeOption] = useState(false);
  const supabase = createClient();

  const fetchAssessmentData = async () => {
    try {
      console.log("🔍 Fetching assessment data for userId:", userId);

      const { data, error } = await supabase
        .from("user_profiles")
        .select(
          "english_level, assessment_score, strengths, recommendations, assessment_completed, updated_at"
        )
        .eq("id", userId) // Your schema uses 'id' not 'user_id'
        .single();

      console.log("📊 Assessment data query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching assessment data:", error);
        setAssessmentData(null);
      } else {
        setAssessmentData(data);

        // Show retake option if assessment is older than 30 days
        if (data.updated_at && data.assessment_completed) {
          const assessmentDate = new Date(data.updated_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          if (assessmentDate < thirtyDaysAgo) {
            setShowRetakeOption(true);
          }
        }
      }
    } catch (error) {
      console.error("💥 Exception in fetchAssessmentData:", error);
      setAssessmentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessmentData();
  }, [userId]);

  const handleRetakeAssessment = async () => {
    try {
      // Reset assessment status so user goes through flow again
      const { error } = await supabase
        .from("user_profiles")
        .update({
          assessment_completed: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error resetting assessment:", error);
        return;
      }

      // Refresh the page to trigger assessment flow
      window.location.reload();
    } catch (error) {
      console.error("Error in handleRetakeAssessment:", error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
        return "bg-red-100 text-red-800";
      case "A2":
        return "bg-orange-100 text-orange-800";
      case "B1":
        return "bg-yellow-100 text-yellow-800";
      case "B2":
        return "bg-blue-100 text-blue-800";
      case "C1":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case "A1":
        return "Beginner - Basic phrases and simple interactions";
      case "A2":
        return "Elementary - Can handle routine tasks requiring simple exchange";
      case "B1":
        return "Intermediate - Can deal with most situations while traveling";
      case "B2":
        return "Upper Intermediate - Can interact with fluency and spontaneity";
      case "C1":
        return "Advanced - Can express ideas fluently and spontaneously";
      default:
        return "Assessment needed";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </CardContent>
      </Card>
    );
  }

  // Show assessment needed state
  if (!assessmentData?.assessment_completed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            English Level Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Assessment Not Completed</h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete your English level assessment to get personalized
              learning recommendations.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                // Reset assessment and reload to trigger flow
                handleRetakeAssessment();
              }}
            >
              Complete Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    english_level,
    assessment_score,
    strengths,
    recommendations,
    updated_at,
  } = assessmentData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your English Level
          </CardTitle>
          {showRetakeOption && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetakeAssessment}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Retake
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Level */}
        <div className="text-center">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getLevelColor(
              english_level!
            )}`}
          >
            {english_level}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {getLevelDescription(english_level!)}
          </p>
        </div>

        {/* Score */}
        {assessment_score && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Assessment Score</span>
              <span className="font-semibold">{assessment_score}%</span>
            </div>
            <Progress value={assessment_score} className="h-2" />
          </div>
        )}

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              Your Strengths
            </h4>
            <div className="flex flex-wrap gap-1">
              {strengths.slice(0, 3).map((strength, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {strength}
                </Badge>
              ))}
              {strengths.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{strengths.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
              Focus Areas
            </h4>
            <div className="space-y-1">
              {recommendations.slice(0, 2).map((recommendation, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 flex items-start"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 mr-2 flex-shrink-0"></span>
                  {recommendation}
                </div>
              ))}
              {recommendations.length > 2 && (
                <p className="text-xs text-gray-500">
                  +{recommendations.length - 2} more recommendations
                </p>
              )}
            </div>
          </div>
        )}

        {/* Last Assessment Date */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Last assessed: {new Date(updated_at).toLocaleDateString("en-GB")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
