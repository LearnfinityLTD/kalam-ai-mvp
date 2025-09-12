// components/assessment/SimplifiedAssessmentFlow.tsx - Updated to fix database issue
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Briefcase,
  MapPin,
  Target,
  Trophy,
  Star,
  Clock,
  Users,
  RotateCcw,
} from "lucide-react";
import { LanguageSwitch } from "../shared/language/LanguageSwitch";

interface DatabaseQuestion {
  id: string;
  question_text: string;
  question_type: "self_assessment" | "role_specific" | "level_validation";
  target_user_type: "guard" | "professional" | "tourist_guide" | "all";
  difficulty_level: "A1" | "A2" | "B1" | "B2" | "C1" | null;
  options: string[];
  correct_answer: number;
  explanation?: string;
  order_index: number;
}

interface AssessmentResult {
  userType: "guard" | "professional" | "tourist_guide";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  percentage: number;
  strengths: string[];
  recommendations: string[];
  timeSpent: number;
  sessionId: string;
}

interface DbQuestion {
  id: string;
  question_text: string;
  question_type: "self_assessment" | "role_specific" | "level_validation";
  target_user_type: "guard" | "professional" | "tourist_guide" | "all";
  difficulty_level: "A1" | "A2" | "B1" | "B2" | "C1" | null;
  options: string[] | string;
  correct_answer: number;
  explanation?: string;
  order_index: number;
}

export default function SimplifiedAssessmentFlow({
  userId,
  email,
  isNewUser,
  onComplete,
}: {
  userId: string;
  email?: string;
  isNewUser: boolean;
  onComplete: (result: AssessmentResult) => void;
}) {
  const { t, isRTL, locale } = useI18n();
  const supabase = createClient();

  // ... existing state variables remain the same ...
  const [currentStep, setCurrentStep] = useState<
    "user-type" | "assessment" | "results"
  >("user-type");
  const [selectedUserType, setSelectedUserType] = useState<
    "guard" | "professional" | "tourist_guide" | null
  >(null);
  const [questions, setQuestions] = useState<DatabaseQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user type options with translations
  const userTypeOptions = [
    {
      id: "guard" as const,
      title: t("assessment.guard.title"),
      subtitle: t("assessment.guard.subtitle"),
      icon: Shield,
      color: "from-green-500 to-emerald-600",
      description: t("assessment.guard.description"),
    },
    {
      id: "professional" as const,
      title: t("assessment.professional.title"),
      subtitle: t("assessment.professional.subtitle"),
      icon: Briefcase,
      color: "from-blue-500 to-cyan-600",
      description: t("assessment.professional.description"),
    },
    {
      id: "tourist_guide" as const,
      title: t("assessment.touristGuide.title"),
      subtitle: t("assessment.touristGuide.subtitle"),
      icon: MapPin,
      color: "from-amber-500 to-orange-600",
      description: t("assessment.touristGuide.description"),
    },
  ];

  // Level descriptions remain the same
  const levelDescriptions = {
    A1: {
      title: t("assessment.levels.A1.title"),
      color: "bg-red-100 text-red-800",
      emoji: "🌱",
    },
    A2: {
      title: t("assessment.levels.A2.title"),
      color: "bg-orange-100 text-orange-800",
      emoji: "🌿",
    },
    B1: {
      title: t("assessment.levels.B1.title"),
      color: "bg-yellow-100 text-yellow-800",
      emoji: "🌳",
    },
    B2: {
      title: t("assessment.levels.B2.title"),
      color: "bg-blue-100 text-blue-800",
      emoji: "🦋",
    },
    C1: {
      title: t("assessment.levels.C1.title"),
      color: "bg-green-100 text-green-800",
      emoji: "🦅",
    },
  };

  const refetchQuestionsWithNewLanguage = async () => {
    if (!selectedUserType) return;

    try {
      const language = locale === "ar" ? "ar" : "en";
      console.log("🌍 Refetching questions with language:", language);

      const { data: dbQuestions, error: questionsError } = await supabase.rpc(
        "get_assessment_questions_for_user_type",
        {
          user_type_param: selectedUserType,
          language_param: language,
        }
      );

      if (questionsError) {
        console.error("❌ Error refetching questions:", questionsError);
        return;
      }

      if (dbQuestions && dbQuestions.length > 0) {
        const transformedQuestions: DatabaseQuestion[] = dbQuestions.map(
          (q: DbQuestion) => ({
            id: q.id,
            question_text: q.question_text,
            question_type: q.question_type,
            target_user_type: q.target_user_type,
            difficulty_level: q.difficulty_level,
            options: Array.isArray(q.options)
              ? q.options
              : JSON.parse(q.options || "[]"),
            correct_answer: q.correct_answer,
            explanation: q.explanation,
            order_index: q.order_index,
          })
        );

        setQuestions(transformedQuestions);
        console.log("✅ Questions updated with new language");
      }
    } catch (error) {
      console.error("💥 Error refetching questions:", error);
    }
  };

  useEffect(() => {
    // Only refetch if we're in the assessment step and have selected a user type
    if (currentStep === "assessment" && selectedUserType && sessionId) {
      console.log("🔄 Language changed, refetching questions...");
      refetchQuestionsWithNewLanguage();
    }
  }, [locale, currentStep, selectedUserType, sessionId]);

  const handleUserTypeSelect = (
    userType: "guard" | "professional" | "tourist_guide"
  ) => {
    setSelectedUserType(userType);
    setError(null); // Clear any previous errors
  };

  const handleStartAssessment = async () => {
    if (!selectedUserType) return;

    setLoading(true);
    setError(null);
    setStartTime(Date.now());

    try {
      console.log("🎯 Starting assessment for user type:", selectedUserType);

      // Create assessment session first
      const { data: session, error: sessionError } = await supabase
        .from("assessment_sessions")
        .insert([
          {
            user_id: userId,
            session_type: isNewUser ? "initial" : "retake",
            user_type_selected: selectedUserType,
          },
        ])
        .select()
        .single();

      if (sessionError) {
        console.error("❌ Error creating assessment session:", sessionError);
        setError(
          `Failed to create assessment session: ${sessionError.message}`
        );
        return;
      }

      console.log("✅ Assessment session created:", session);
      setSessionId(session.id);

      // Fetch questions using RPC function with language support
      const language = locale === "ar" ? "ar" : "en";
      console.log("📚 Fetching questions for:", {
        userType: selectedUserType,
        language,
      });

      const { data: dbQuestions, error: questionsError } = await supabase.rpc(
        "get_assessment_questions_for_user_type",
        {
          user_type_param: selectedUserType,
          language_param: language,
        }
      );

      if (questionsError) {
        console.error("❌ Error fetching questions:", questionsError);
        setError(`Failed to fetch questions: ${questionsError.message}`);
        return;
      }

      if (!dbQuestions || dbQuestions.length === 0) {
        console.warn("⚠️ No questions returned from database");
        setError(
          "No questions available for this user type. Please try again or contact support."
        );
        return;
      }

      console.log("✅ Questions fetched successfully:", dbQuestions);

      // Transform the questions to match our interface
      const transformedQuestions: DatabaseQuestion[] = dbQuestions.map(
        (q: DbQuestion) => ({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type,
          target_user_type: q.target_user_type,
          difficulty_level: q.difficulty_level,
          options: Array.isArray(q.options)
            ? q.options
            : JSON.parse(q.options || "[]"),
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          order_index: q.order_index,
        })
      );

      setQuestions(transformedQuestions);
      setCurrentStep("assessment");
    } catch (error) {
      console.error("💥 Exception in handleStartAssessment:", error);
      setError(
        `System error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    // Update assessment session with current answer
    if (sessionId && currentQuestion) {
      try {
        await supabase
          .from("assessment_sessions")
          .update({
            questions_attempted: currentQuestionIndex + 1,
            answers_data: answers,
          })
          .eq("id", sessionId);
      } catch (error) {
        console.warn("⚠️ Failed to update session (non-critical):", error);
      }
    }

    // Check if this is the last question
    if (currentQuestionIndex === questions.length - 1) {
      calculateResult();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateResult = () => {
    if (!selectedUserType) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let correctAnswers = 0;
    let totalQuestions = 0;
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Calculate score (skip self-assessment question)
    questions.forEach((question, index) => {
      if (question.question_type !== "self_assessment") {
        totalQuestions++;
        if (answers[index] === question.correct_answer) {
          correctAnswers++;

          // Add role-specific strengths
          if (selectedUserType === "guard") {
            strengths.push("Visitor Communication");
          } else if (selectedUserType === "professional") {
            strengths.push("Business Communication");
          } else if (selectedUserType === "tourist_guide") {
            strengths.push("Tourism Services");
          }
        }
      }
    });

    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    // Determine English level based on score and self-assessment
    let level: AssessmentResult["level"];
    const selfAssessment = answers[0] || 0; // First question is self-assessment

    if (percentage >= 80) {
      level = selfAssessment >= 4 ? "C1" : selfAssessment >= 3 ? "B2" : "B1";
    } else if (percentage >= 60) {
      level = selfAssessment >= 3 ? "B1" : "A2";
    } else {
      level = selfAssessment >= 2 ? "A2" : "A1";
    }

    // Add personalized recommendations based on user type
    if (selectedUserType === "guard") {
      recommendations.push("Practice greeting international visitors");
      recommendations.push("Learn key Islamic terms in English");
    } else if (selectedUserType === "professional") {
      recommendations.push("Focus on business email writing");
      recommendations.push("Practice presentation skills");
    } else if (selectedUserType === "tourist_guide") {
      recommendations.push("Study Saudi cultural history");
      recommendations.push("Practice explaining cultural sites");
    }

    if (percentage < 70) {
      recommendations.push("Start with basic vocabulary building");
    }

    const result: AssessmentResult = {
      userType: selectedUserType,
      level,
      percentage,
      strengths: [...new Set(strengths)],
      recommendations: [...new Set(recommendations)],
      timeSpent,
      sessionId,
    };

    setAssessmentResult(result);
    setCurrentStep("results");
  };

  const handleCompleteAssessment = () => {
    if (assessmentResult) {
      onComplete(assessmentResult);
    }
  };

  // Error display
  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-red-800">
              {t("assessment.setupError")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setCurrentStep("user-type");
              }}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              {t("assessment.tryAgain")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User Type Selection Screen
  if (currentStep === "user-type") {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-between items-start">
              <div></div> {/* Empty div for spacing */}
              <div className="flex flex-col items-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  {t("assessment.userTypeTitle")}
                </CardTitle>
                <p className="text-gray-600">
                  {t("assessment.userTypeSubtitle")}
                </p>
              </div>
              <LanguageSwitch />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {userTypeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedUserType === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleUserTypeSelect(option.id)}
                  className={`w-full p-6 text-${
                    isRTL ? "right" : "left"
                  } border-2 rounded-xl transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 shadow-lg"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                  }`}
                >
                  <div
                    className={`flex items-start gap-4 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-lg flex items-center justify-center text-white`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {option.subtitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                </button>
              );
            })}

            <div className="pt-4">
              <Button
                onClick={handleStartAssessment}
                disabled={!selectedUserType || loading}
                className="w-full py-4 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("assessment.loadingQuestions")}
                  </div>
                ) : (
                  <>
                    {t("assessment.startAssessment")}
                    <ArrowRight
                      className={`w-5 h-5 ${
                        isRTL ? "mr-2 rotate-180" : "ml-2"
                      }`}
                    />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Questions Screen
  if (currentStep === "assessment" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                {t("assessment.questionOf", {
                  current: currentQuestionIndex + 1,
                  total: questions.length,
                })}
              </Badge>
              <div className="flex items-center gap-2">
                {currentQuestion.difficulty_level && (
                  <Badge
                    className={
                      levelDescriptions[currentQuestion.difficulty_level].color
                    }
                  >
                    {levelDescriptions[currentQuestion.difficulty_level].emoji}{" "}
                    {currentQuestion.difficulty_level}
                  </Badge>
                )}
                <LanguageSwitch />
              </div>
            </div>
            <Progress value={progress} className="h-3 bg-gray-100" />
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-6">
                {currentQuestion.question_text}
              </CardTitle>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-${
                      isRTL ? "right" : "left"
                    } p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestionIndex] === index
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-3 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                          answers[currentQuestionIndex] === index
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestionIndex] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm leading-relaxed">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`flex justify-between items-center pt-4 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Button
                variant="ghost"
                onClick={() =>
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="text-gray-500"
              >
                {t("assessment.previous")}
              </Button>

              <Button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestionIndex] === undefined}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                {currentQuestionIndex === questions.length - 1
                  ? t("assessment.completeAssessment")
                  : t("assessment.next")}
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (currentStep === "results" && assessmentResult) {
    const levelInfo = levelDescriptions[assessmentResult.level];
    const userTypeInfo = userTypeOptions.find(
      (opt) => opt.id === assessmentResult.userType
    );

    return (
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                {t("assessment.assessmentComplete")}
              </Badge>
              <CardTitle className="text-3xl font-bold">
                {levelInfo.emoji} {levelInfo.title} {t("common.level")}
              </CardTitle>
              <p className="text-lg text-gray-600">
                {t("assessment.perfectFor", {
                  userType: userTypeInfo?.title.toLowerCase(),
                })}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center p-6 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-1">
                    {assessmentResult.level}
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("assessment.yourLevel")}
                  </p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {assessmentResult.percentage}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("assessment.score")}
                  </p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {Math.floor(assessmentResult.timeSpent / 60)}:
                    {(assessmentResult.timeSpent % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("assessment.time")}
                  </p>
                </div>
              </div>
              <Progress value={assessmentResult.percentage} className="h-3" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCompleteAssessment}
                className="w-full py-4 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                size="lg"
              >
                {t("assessment.startPersonalizedJourney")}
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
