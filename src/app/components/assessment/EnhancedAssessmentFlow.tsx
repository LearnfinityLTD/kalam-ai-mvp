// components/assessment/EnhancedAssessmentFlow.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Trophy,
  Star,
  Users,
  Clock,
  Zap,
  Play,
  RotateCcw,
  Lightbulb,
} from "lucide-react";

interface Question {
  id: number;
  type: "self-assessment" | "multiple-choice" | "audio" | "scenario";
  difficulty: "A1" | "A2" | "B1" | "B2" | "C1";
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number;
  audioUrl?: string;
  audioText?: string;
  explanation?: string;
  culturalNote?: string;
}

interface AssessmentResult {
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  percentage: number;
  strengths: string[];
  recommendations: string[];
  timeSpent: number;
  confidenceScore: number;
}

const assessmentQuestions: Question[] = [
  // Self-Assessment Question
  {
    id: 0,
    type: "self-assessment",
    difficulty: "A1",
    question: "How would you describe your English level?",
    context: "This helps us choose the right questions for you.",
    options: [
      "I'm completely new to English",
      "I know some basic words and phrases",
      "I can have simple conversations",
      "I'm comfortable with most situations",
      "I can discuss complex topics fluently",
    ],
    correctAnswer: -1, // No correct answer for self-assessment
  },

  // Progressive Questions A1 → C1
  {
    id: 1,
    type: "multiple-choice",
    difficulty: "A1",
    question:
      "A visitor approaches you at the mosque entrance. What do you say first?",
    context: "Basic greeting scenario - this tests fundamental politeness",
    options: [
      "What you want?",
      "Assalamu alaikum, welcome to our mosque. How may I help you?",
      "Hello, you come inside.",
      "Wait here, I busy.",
    ],
    correctAnswer: 1,
    explanation:
      "Always start with a respectful Islamic greeting and offer assistance.",
    culturalNote:
      'The Islamic greeting "Assalamu alaikum" shows cultural awareness and respect.',
  },

  {
    id: 2,
    type: "audio",
    difficulty: "A2",
    question:
      "Listen to this visitor's question. What is the most helpful response?",
    context:
      "A tourist is asking about prayer times - tests listening + cultural knowledge",
    audioText:
      "Excuse me, what time is the evening prayer today? I would like to observe respectfully.",
    options: [
      "Maghrib prayer is at 6:30 PM. You are welcome to observe respectfully from the back.",
      "Prayer time soon, you go now.",
      "I don't know times, ask imam.",
      "You cannot stay for prayer, only Muslims.",
    ],
    correctAnswer: 0,
    explanation:
      "Provide specific information and welcoming guidance for respectful observation.",
    culturalNote:
      "Non-Muslims can observe prayers respectfully - this builds interfaith understanding.",
  },

  {
    id: 3,
    type: "scenario",
    difficulty: "B1",
    question:
      'A family of tourists asks: "Our daughter is wearing shorts. Can she enter the mosque?" How do you respond diplomatically?',
    context:
      "Dress code explanation - tests cultural sensitivity + problem-solving",
    options: [
      "No shorts allowed, go change clothes.",
      "I understand you may not be familiar with our dress code. We have modest coverings available at the entrance that your daughter can wear over her shorts.",
      "This is mosque, you must follow rules or leave.",
      "Wait outside, only proper dress inside.",
    ],
    correctAnswer: 1,
    explanation:
      "Explain the requirement kindly and offer a practical solution.",
    culturalNote:
      "Providing coverings shows hospitality while maintaining religious standards.",
  },

  {
    id: 4,
    type: "multiple-choice",
    difficulty: "B2",
    question:
      'A businessman asks: "I have an important call in 10 minutes. Is there a quiet area where I won\'t disturb worshippers, but I can still experience the mosque atmosphere?"',
    context: "Complex request balancing business needs with religious respect",
    options: [
      "No business calls in mosque, very disrespectful.",
      "I recommend our courtyard area - it's peaceful with a view of the main hall, and you can take your call without disturbing prayers. Would you like me to show you?",
      "You go outside for calls, come back later.",
      "Ask the imam, not my decision.",
    ],
    correctAnswer: 1,
    explanation:
      "Find creative solutions that respect both business needs and religious sanctity.",
    culturalNote:
      "Modern mosque hospitality balances tradition with contemporary visitor needs.",
  },

  {
    id: 5,
    type: "audio",
    difficulty: "C1",
    question:
      "Listen to this complex cultural question. How would you provide a nuanced, culturally-intelligent response?",
    context: "Advanced interfaith dialogue - tests sophisticated communication",
    audioText:
      "I notice the architecture here has some interesting geometric patterns and Arabic calligraphy. Can you explain the cultural and spiritual significance of these design elements in Islamic architecture?",
    options: [
      "That's complicated question, ask someone else.",
      "While Islamic architecture incorporates various cultural influences, our mosque specifically reflects traditional Arabian design principles, which you can see in the geometric patterns and calligraphy. These elements serve both aesthetic and spiritual purposes, creating a sense of unity and focus during prayer.",
      "It's just Islamic style, nothing special to explain.",
      "I don't know about architecture, I just work security.",
    ],
    correctAnswer: 1,
    explanation:
      "Demonstrate cultural expertise while remaining accessible and educational.",
    culturalNote:
      "Advanced cultural communication builds bridges between communities and enhances mutual understanding.",
  },
];

const levelDescriptions = {
  A1: {
    title: "Foundation Builder",
    description:
      "You're building essential communication skills for mosque interactions",
    color: "from-red-400 to-red-600",
    icon: "🌱",
  },
  A2: {
    title: "Confident Helper",
    description:
      "You can handle most visitor questions with warmth and clarity",
    color: "from-orange-400 to-orange-600",
    icon: "🌿",
  },
  B1: {
    title: "Cultural Bridge",
    description: "You excel at connecting different cultures with sensitivity",
    color: "from-yellow-400 to-yellow-600",
    icon: "🌳",
  },
  B2: {
    title: "Expert Communicator",
    description: "You handle complex situations with professional fluency",
    color: "from-blue-400 to-blue-600",
    icon: "🦋",
  },
  C1: {
    title: "Master Ambassador",
    description: "You're a sophisticated cultural ambassador and teacher",
    color: "from-green-400 to-green-600",
    icon: "🦅",
  },
};

export default function EnhancedAssessmentFlow({
  userId,
  email,
  onComplete,
}: {
  userId: string;
  email?: string;
  onComplete: (result: AssessmentResult) => void;
}) {
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "path-choice" | "assessment" | "results"
  >("welcome");
  const [assessmentPath, setAssessmentPath] = useState<
    "beginner" | "assessment" | "advanced" | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [confidence, setConfidence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Text-to-speech handling
  const playAudio = async (text: string) => {
    try {
      setIsPlaying(true);

      // Use browser's built-in text-to-speech in English
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.lang = "en-US"; // American English
      utterance.volume = 0.8;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      // Cancel any existing speech
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.log("Text-to-speech not supported:", error);
      setIsPlaying(false);
    }
  };

  // Path selection logic
  const getQuestionsForPath = (
    path: string,
    selfAssessment?: number
  ): Question[] => {
    if (path === "beginner") {
      return assessmentQuestions.slice(1, 3); // A1, A2 questions only
    } else if (path === "advanced") {
      return assessmentQuestions.slice(4, 6); // B2, C1 questions only
    } else {
      // Full assessment - adaptive based on self-assessment
      if (selfAssessment !== undefined) {
        if (selfAssessment <= 1) return assessmentQuestions.slice(1, 4); // A1-B1
        if (selfAssessment >= 3) return assessmentQuestions.slice(3, 6); // B1-C1
      }
      return assessmentQuestions.slice(1, 6); // All questions
    }
  };

  const handleStartAssessment = (
    path: "beginner" | "assessment" | "advanced"
  ) => {
    setAssessmentPath(path);
    setCurrentStep("assessment");
    setStartTime(Date.now());

    if (path === "assessment") {
      setCurrentQuestion(0); // Start with self-assessment
    } else {
      setCurrentQuestion(1); // Skip self-assessment
    }
  };

  const handleAnswerSelect = (
    answerIndex: number,
    confidenceLevel: number = 3
  ) => {
    const newAnswers = [...selectedAnswers];
    const newConfidence = [...confidence];

    newAnswers[currentQuestion] = answerIndex;
    newConfidence[currentQuestion] = confidenceLevel;

    setSelectedAnswers(newAnswers);
    setConfidence(newConfidence);
  };

  const handleNextQuestion = () => {
    const currentQ = assessmentQuestions[currentQuestion];

    // Show explanation for incorrect answers (except self-assessment)
    if (
      currentQ.type !== "self-assessment" &&
      selectedAnswers[currentQuestion] !== currentQ.correctAnswer &&
      currentQ.explanation
    ) {
      setShowExplanation(true);
      return;
    }

    proceedToNext();
  };

  const proceedToNext = () => {
    setShowExplanation(false);

    // Handle self-assessment adaptive routing
    if (currentQuestion === 0 && assessmentPath === "assessment") {
      const selfAssessmentLevel = selectedAnswers[0];
      const adaptiveQuestions = getQuestionsForPath(
        "assessment",
        selfAssessmentLevel
      );

      if (selfAssessmentLevel <= 1) {
        // Start with easier questions
        setCurrentQuestion(1);
      } else if (selfAssessmentLevel >= 3) {
        // Skip to harder questions
        setCurrentQuestion(3);
      } else {
        setCurrentQuestion(1);
      }
      return;
    }

    // Regular progression
    const questionsToUse = getQuestionsForPath(
      assessmentPath!,
      selectedAnswers[0]
    );
    const currentIndex = questionsToUse.findIndex(
      (q) => q.id === assessmentQuestions[currentQuestion].id
    );

    if (currentIndex < questionsToUse.length - 1) {
      const nextQuestion = questionsToUse[currentIndex + 1];
      const nextQuestionIndex = assessmentQuestions.findIndex(
        (q) => q.id === nextQuestion.id
      );
      setCurrentQuestion(nextQuestionIndex);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let correctAnswers = 0;
    let totalQuestions = 0;
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Calculate score based on answered questions
    selectedAnswers.forEach((answer, index) => {
      const question = assessmentQuestions[index];
      if (
        question &&
        question.type !== "self-assessment" &&
        answer !== undefined
      ) {
        totalQuestions++;
        if (answer === question.correctAnswer) {
          correctAnswers++;

          // Add strengths based on question difficulty and type
          if (question.difficulty === "A1" || question.difficulty === "A2") {
            strengths.push("Basic Visitor Communication");
          } else if (
            question.difficulty === "B1" ||
            question.difficulty === "B2"
          ) {
            strengths.push("Cultural Sensitivity");
          } else {
            strengths.push("Advanced Problem Solving");
          }

          if (question.type === "audio") {
            strengths.push("Listening Comprehension");
          }
        } else {
          // Add recommendations based on missed questions
          if (question.type === "audio") {
            recommendations.push(
              "Practice listening to different English accents"
            );
          }
          if (question.difficulty === "B2" || question.difficulty === "C1") {
            recommendations.push("Focus on complex cultural scenarios");
          }
        }
      }
    });

    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    // Determine level based on score and question difficulty
    let level: AssessmentResult["level"];
    const avgConfidence =
      confidence.length > 0
        ? confidence.reduce((a, b) => a + b, 0) / confidence.length
        : 3;

    if (percentage >= 90 && correctAnswers >= 3) level = "C1";
    else if (percentage >= 75 && correctAnswers >= 2) level = "B2";
    else if (percentage >= 60) level = "B1";
    else if (percentage >= 40) level = "A2";
    else level = "A1";

    // Add default recommendations if none
    if (recommendations.length === 0) {
      recommendations.push("Continue practicing daily mosque scenarios");
      recommendations.push("Focus on pronunciation of key Islamic terms");
    }

    const result: AssessmentResult = {
      level,
      percentage,
      strengths: [...new Set(strengths)],
      recommendations: [...new Set(recommendations)],
      timeSpent,
      confidenceScore: Math.round(avgConfidence * 20), // Convert to 0-100 scale
    };

    setAssessmentResult(result);
    setCurrentStep("results");
  };

  const handleCompleteAssessment = () => {
    if (assessmentResult) {
      onComplete(assessmentResult);
    }
  };

  // Welcome Screen
  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <Badge
                variant="outline"
                className="mb-2 bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Smart Assessment
              </Badge>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Discover Your English Level
              </CardTitle>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our AI-powered assessment adapts to you, focusing on real mosque
                scenarios you&apos;ll encounter daily.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">5-8 Minutes</h3>
                <p className="text-xs text-gray-600">Quick & focused</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Volume2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Audio Scenarios</h3>
                <p className="text-xs text-gray-600">Real situations</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Instant Results</h3>
                <p className="text-xs text-gray-600">Personalized plan</p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep("path-choice")}
              className="w-full py-4 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              size="lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-xs text-gray-500 text-center">
              We&apos;ll recommend the perfect learning path based on your
              current abilities
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Path Choice Screen (Duolingo-inspired)
  if (currentStep === "path-choice") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Choose Your Path
            </CardTitle>
            <p className="text-gray-600">
              How would you like to start your journey?
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Beginner Path */}
            <button
              onClick={() => handleStartAssessment("beginner")}
              className="w-full p-6 text-left border rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">
                    Start from Foundation
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Perfect if you&apos;re new to English or want to build solid
                    basics
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    2 questions • A1-A2 level
                  </Badge>
                </div>
              </div>
            </button>

            {/* Full Assessment Path */}
            <button
              onClick={() => handleStartAssessment("assessment")}
              className="w-full p-6 text-left border rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group border-blue-200 bg-blue-25"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    Find My Level
                    <Badge className="bg-blue-600 text-xs">Recommended</Badge>
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Smart assessment that adapts to your answers for precise
                    placement
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    3-6 questions • All levels
                  </Badge>
                </div>
              </div>
            </button>

            {/* Advanced Path */}
            <button
              onClick={() => handleStartAssessment("advanced")}
              className="w-full p-6 text-left border rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl">🦅</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Challenge Mode</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    For confident English speakers ready for complex scenarios
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    2 questions • B2-C1 level
                  </Badge>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment Screen
  if (currentStep === "assessment") {
    const currentQ = assessmentQuestions[currentQuestion];
    const questionsForPath = getQuestionsForPath(
      assessmentPath!,
      selectedAnswers[0]
    );
    const currentIndex = questionsForPath.findIndex(
      (q) => q.id === currentQ.id
    );
    const totalQuestions = questionsForPath.length;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Question {currentIndex + 1} of {totalQuestions}
              </Badge>
              <Badge
                variant={
                  currentQ.difficulty === "A1" || currentQ.difficulty === "A2"
                    ? "default"
                    : currentQ.difficulty === "B1"
                    ? "secondary"
                    : "destructive"
                }
                className="text-xs"
              >
                {currentQ.difficulty} Level
              </Badge>
            </div>
            <Progress value={progress} className="h-3 bg-gray-100" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Context */}
            {currentQ.context && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{currentQ.context}</p>
                </div>
              </div>
            )}

            {/* Question */}
            <div>
              <CardTitle className="text-xl mb-4">
                {currentQ.question}
              </CardTitle>

              {/* Audio */}
              {currentQ.type === "audio" && currentQ.audioText && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playAudio(currentQ.audioText!)}
                      disabled={isPlaying}
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      {isPlaying ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          Speaking...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Play Audio
                        </div>
                      )}
                    </Button>
                    <span className="text-sm text-purple-600">
                      Listen carefully to respond appropriately
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Show Explanation */}
            {showExplanation && currentQ.explanation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Learning Moment
                </h4>
                <p className="text-sm text-yellow-700 mb-2">
                  {currentQ.explanation}
                </p>
                {currentQ.culturalNote && (
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="text-xs text-yellow-600">
                      <strong>Cultural Note:</strong> {currentQ.culturalNote}
                    </p>
                  </div>
                )}
                <Button
                  onClick={proceedToNext}
                  className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  Continue Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Options */}
            {!showExplanation && (
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-emerald-500 bg-emerald-50 shadow-md"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestion] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm leading-relaxed">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            {!showExplanation && (
              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentIndex > 0) {
                      const prevQuestion = questionsForPath[currentIndex - 1];
                      const prevIndex = assessmentQuestions.findIndex(
                        (q) => q.id === prevQuestion.id
                      );
                      setCurrentQuestion(prevIndex);
                    }
                  }}
                  disabled={currentIndex === 0}
                  className="text-gray-500"
                >
                  Previous
                </Button>

                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  {currentIndex === totalQuestions - 1
                    ? "Complete Assessment"
                    : "Next Question"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (currentStep === "results" && assessmentResult) {
    const levelInfo = levelDescriptions[assessmentResult.level];

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-6">
            <div
              className={`mx-auto w-20 h-20 bg-gradient-to-br ${levelInfo.color} rounded-full flex items-center justify-center text-white`}
            >
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-3">
              <Badge
                variant="outline"
                className="mb-2 bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Assessment Complete
              </Badge>
              <CardTitle className="text-3xl font-bold">
                {levelInfo.icon} {levelInfo.title}
              </CardTitle>
              <p className="text-gray-600 text-lg">{levelInfo.description}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Level and Score Display */}
            <div className="text-center p-6 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-1">
                    {assessmentResult.level}
                  </div>
                  <p className="text-sm text-gray-600">Your Level</p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {assessmentResult.percentage}%
                  </div>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {Math.floor(assessmentResult.timeSpent / 60)}:
                    {(assessmentResult.timeSpent % 60)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                  <p className="text-sm text-gray-600">Time</p>
                </div>
              </div>
              <Progress value={assessmentResult.percentage} className="h-3" />
            </div>

            {/* Strengths */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-2" />
                Your Strengths
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {assessmentResult.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                  >
                    <Star className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">
                      {strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center text-lg">
                <Target className="w-5 h-5 text-blue-500 mr-2" />
                Your Learning Plan
              </h3>
              <div className="space-y-3">
                {assessmentResult.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm text-blue-800 leading-relaxed">
                        {recommendation}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Next Steps Preview */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                What&apos;s Next?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Personalized Scenarios
                    </p>
                    <p className="text-xs text-purple-600">
                      Practice real mosque situations at your level
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Pronunciation Coach
                    </p>
                    <p className="text-xs text-purple-600">
                      Master difficult sounds with AI feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Prayer-Time Learning
                    </p>
                    <p className="text-xs text-purple-600">
                      5-minute sessions between prayers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">
                      Cultural Mastery
                    </p>
                    <p className="text-xs text-purple-600">
                      Become a confident cultural ambassador
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCompleteAssessment}
                className="w-full py-4 text-lg bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                size="lg"
              >
                Start Your Personalized Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep("welcome");
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                  setConfidence([]);
                  setAssessmentResult(null);
                  setAssessmentPath(null);
                }}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>

            {/* Confidence Note */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                Your confidence level: {assessmentResult.confidenceScore}% •
                Completed in {Math.floor(assessmentResult.timeSpent / 60)}{" "}
                minutes {assessmentResult.timeSpent % 60} seconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
