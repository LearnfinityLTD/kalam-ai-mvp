import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Timer,
  Target,
  Star,
  Zap,
  Users,
  Play,
  RotateCcw,
  Volume2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Mic,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  saveChallengeResult,
  ChallengeResultData,
  getChallengeTemplates,
  getQuestionsWithFallback,
  Question as DatabaseQuestion,
  ChallengeTemplate,
} from "@/utils/challengeApi";

/* ---------- Types ---------- */

type Question = {
  id: string;
  question: string;
  context?: string;
  audio?: boolean;
  options: string[];
  correct: string;
  explanation: string;
};

type Difficulty = "Easy" | "Medium" | "Hard";

type Challenge = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  difficulty: Difficulty;
  time: string;
  description: string;
  questions: Question[];
};

type Answer = {
  question: string;
  userAnswer: string;
  correct: string;
  isCorrect: boolean;
  explanation: string;
};

type GameState = "menu" | "playing" | "results" | "saving" | "loading";

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

export const DIALECTS = ["gulf", "egyptian", "levantine", "standard"] as const;
export type Dialect = (typeof DIALECTS)[number];

interface ChallengeModeProps {
  userLevel?: Level | string | null;
  userDialect?: Dialect | string | null;
  userId: string;
  initialLoading?: boolean;
  bootDelayMs?: number;
  onComplete?: () => void;
}

// Safe normalizers
const toLevel = (v?: string | null): Level => {
  const s = (v ?? "").toUpperCase();
  return (LEVELS as readonly string[]).includes(s) ? (s as Level) : "A2";
};

const toDialect = (v?: string | null): Dialect => {
  const s = (v ?? "").toLowerCase();
  return (DIALECTS as readonly string[]).includes(s) ? (s as Dialect) : "gulf";
};

// Icon mapping for database-driven challenges
const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-6 h-6" />,
  Mic: <Mic className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
};

/* ---------- Component ---------- */

const ChallengeMode: React.FC<ChallengeModeProps> = ({
  userLevel: userLevelProp = "A2",
  userDialect: userDialectProp = "gulf",
  userId,
  initialLoading = true,
  bootDelayMs = 400,
  onComplete,
}) => {
  const userLevel = toLevel(userLevelProp);
  const userDialect = toDialect(userDialectProp);
  const [challengeTypes, setChallengeTypes] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("loading");
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [booting, setBooting] = useState<boolean>(Boolean(initialLoading));
  const [challengeStartTime, setChallengeStartTime] = useState<number>(0);

  /* ---------- Database Integration Functions ---------- */

  const loadChallengeTemplates = useCallback(async () => {
    try {
      const templates = await getChallengeTemplates();

      const formattedChallenges: Challenge[] = templates.map(
        (template: ChallengeTemplate) => ({
          id: template.type,
          title: template.title,
          subtitle: template.subtitle,
          icon: iconMap[template.icon_name] || <BookOpen className="w-6 h-6" />,
          color: template.color_scheme,
          difficulty: template.difficulty,
          time: `${template.time_limit_minutes} min`,
          description: template.description,
          questions: [], // Will be loaded when challenge starts
        })
      );

      setChallengeTypes(formattedChallenges);
      setGameState("menu");
    } catch (error) {
      console.error("Error loading challenge templates:", error);
      // Fallback to hardcoded challenges if database fails
      loadFallbackChallenges();
    }
  }, []);

  const loadFallbackChallenges = useCallback(() => {
    const fallbackChallenges: Challenge[] = [
      {
        id: "cultural_scenarios",
        title: "Cultural Scenarios",
        subtitle: "Navigate UAE workplace situations",
        icon: <Users className="w-6 h-6" />,
        color: "from-blue-500 to-cyan-500",
        difficulty: "Medium",
        time: "5 min",
        description: "Real workplace situations in Gulf context",
        questions: [],
      },
      {
        id: "pronunciation_drill",
        title: "Pronunciation Challenge",
        subtitle: "Master difficult English sounds",
        icon: <Mic className="w-6 h-6" />,
        color: "from-green-500 to-emerald-500",
        difficulty: "Hard",
        time: "3 min",
        description: "Focus on sounds challenging for Arabic speakers",
        questions: [],
      },
      {
        id: "rapid_response",
        title: "Rapid Response",
        subtitle: "Quick thinking in English",
        icon: <Zap className="w-6 h-6" />,
        color: "from-purple-500 to-pink-500",
        difficulty: "Easy",
        time: "2 min",
        description: "Fast-paced vocabulary and grammar",
        questions: [],
      },
      {
        id: "dialect_bridge",
        title: "Dialect Bridge",
        subtitle: "From Arabic expressions to English",
        icon: <MessageSquare className="w-6 h-6" />,
        color: "from-orange-500 to-red-500",
        difficulty: "Medium",
        time: "4 min",
        description: "Translate concepts, not just words",
        questions: [],
      },
      {
        id: "grammar_sprint",
        title: "Grammar Sprint",
        subtitle: "Common Arabic speaker mistakes",
        icon: <BookOpen className="w-6 h-6" />,
        color: "from-indigo-500 to-blue-500",
        difficulty: "Medium",
        time: "3 min",
        description: "Target typical Arabic-English interference",
        questions: [],
      },
      {
        id: "confidence_builder",
        title: "Confidence Builder",
        subtitle: "Low-pressure practice",
        icon: <Star className="w-6 h-6" />,
        color: "from-yellow-500 to-orange-500",
        difficulty: "Easy",
        time: "6 min",
        description: "Build confidence with supportive feedback",
        questions: [],
      },
    ];

    setChallengeTypes(fallbackChallenges);
    setGameState("menu");
  }, []);

  const loadChallengeQuestions = useCallback(
    async (challengeType: string): Promise<Question[]> => {
      try {
        const dbQuestions = await getQuestionsWithFallback(
          challengeType,
          userLevel,
          userDialect,
          5
        );

        // Transform database questions to component format
        return dbQuestions.map((q: DatabaseQuestion) => ({
          id: q.id,
          question: q.question_text,
          context: q.context,
          audio: q.has_audio,
          options: q.options,
          correct: q.correct_answer,
          explanation: q.explanation,
        }));
      } catch (error) {
        console.error(`Error loading questions for ${challengeType}:`, error);
        return [];
      }
    },
    [userLevel, userDialect]
  );

  /* ---------- Game Logic ---------- */

  const startChallenge = useCallback(
    async (challenge: Challenge) => {
      setGameState("loading");

      try {
        // Load questions from database
        const questions = await loadChallengeQuestions(challenge.id);

        if (questions.length === 0) {
          console.error("No questions available for challenge");
          setGameState("menu");
          return;
        }

        const challengeWithQuestions = { ...challenge, questions };
        setSelectedChallenge(challengeWithQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setAnswers([]);

        const minutes = parseInt(challenge.time, 10) || 0;
        setTimeLeft(minutes * 60);
        setChallengeStartTime(Date.now());
        setGameState("playing");
      } catch (error) {
        console.error("Error starting challenge:", error);
        setGameState("menu");
      }
    },
    [loadChallengeQuestions]
  );

  const answerQuestion = useCallback(
    (answer: string) => {
      if (!selectedChallenge?.questions?.[currentQuestion]) {
        console.error("Invalid challenge state");
        return;
      }

      const question = selectedChallenge.questions[currentQuestion];
      const isCorrect = answer === question.correct;

      const newAnswer: Answer = {
        question: question.question,
        userAnswer: answer,
        correct: question.correct,
        isCorrect,
        explanation: question.explanation,
      };

      setAnswers((prev) => [...prev, newAnswer]);

      if (isCorrect) {
        setScore((prev) => prev + (10 + streak * 2));
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak((prev) => Math.max(prev, newStreak));
      } else {
        setStreak(0);
      }

      if (currentQuestion + 1 < selectedChallenge.questions.length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        endChallenge();
      }
    },
    [selectedChallenge, currentQuestion, streak]
  );

  const endChallenge = useCallback(async () => {
    setGameState("saving");

    if (!selectedChallenge || !userId) {
      setGameState("results");
      return;
    }

    // Calculate final statistics
    const timeTakenSeconds = Math.floor(
      (Date.now() - challengeStartTime) / 1000
    );
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const accuracy = Math.round(
      (correctAnswers / selectedChallenge.questions.length) * 100
    );

    const resultData: ChallengeResultData = {
      user_id: userId,
      challenge_type: selectedChallenge.id,
      challenge_title: selectedChallenge.title,
      difficulty: selectedChallenge.difficulty,
      total_questions: selectedChallenge.questions.length,
      correct_answers: correctAnswers,
      score: score,
      accuracy_percentage: accuracy,
      time_taken_seconds: timeTakenSeconds,
      max_streak: maxStreak,
      answers_data: answers,
    };

    // Save to database
    try {
      const result = await saveChallengeResult(resultData);

      if (!result.success) {
        console.error("Failed to save challenge result:", result.error);
      }

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving challenge result:", error);
    }

    setGameState("results");
  }, [
    selectedChallenge,
    userId,
    challengeStartTime,
    answers,
    score,
    maxStreak,
    onComplete,
  ]);

  const resetChallenge = useCallback(() => {
    setGameState("menu");
    setSelectedChallenge(null);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(0);
    setStreak(0);
    setMaxStreak(0);
    setAnswers([]);
    setChallengeStartTime(0);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getScoreLevel = useCallback((scoreValue: number, maxScore: number) => {
    const percentage = (scoreValue / maxScore) * 100;
    if (percentage >= 90) {
      return {
        level: "Excellent",
        color: "text-green-600",
        message: "ممتاز! Outstanding performance!",
      } as const;
    }
    if (percentage >= 75) {
      return {
        level: "Very Good",
        color: "text-blue-600",
        message: "جيد جداً! Great job!",
      } as const;
    }
    if (percentage >= 60) {
      return {
        level: "Good",
        color: "text-yellow-600",
        message: "جيد! Keep improving!",
      } as const;
    }
    return {
      level: "Keep Practicing",
      color: "text-orange-600",
      message: "استمر في التدريب! Practice makes perfect!",
    } as const;
  }, []);

  /* ---------- Effects ---------- */

  useEffect(() => {
    if (booting) {
      const id = setTimeout(() => {
        setBooting(false);
        loadChallengeTemplates();
      }, bootDelayMs);
      return () => clearTimeout(id);
    }
  }, [booting, bootDelayMs, loadChallengeTemplates]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      endChallenge();
    }
  }, [timeLeft, gameState, endChallenge]);

  /* ---------- Views ---------- */

  if (booting || gameState === "loading") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="py-12 flex items-center justify-center">
            <Button
              variant="outline"
              disabled
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="font-medium">Challenge Mode</span>
              <span className="text-xs text-gray-600">
                {gameState === "loading" ? "Loading questions..." : "Starting…"}
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Saving state
  if (gameState === "saving") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="py-12 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Saving Your Results...
              </h3>
              <p className="text-gray-600">
                Recording your progress and updating your achievements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Menu View
  if (gameState === "menu") {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Challenge Mode
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test your English skills with targeted challenges designed for
            Arabic speakers. Choose your challenge and compete against yourself!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengeTypes.map((challenge) => (
            <Card
              key={challenge.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${challenge.color} flex items-center justify-center text-white mb-3`}
                >
                  {challenge.icon}
                </div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <p className="text-sm text-gray-600">{challenge.subtitle}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <Badge
                    variant={
                      challenge.difficulty === "Easy"
                        ? "secondary"
                        : challenge.difficulty === "Medium"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {challenge.difficulty}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Timer className="w-4 h-4 mr-1" />
                    {challenge.time}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => startChallenge(challenge)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-purple-900 mb-2">
                  Daily Challenge
                </h3>
                <p className="text-purple-700">
                  Complete today&apos;s special challenge for bonus points!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">+50</div>
                <div className="text-sm text-purple-600">Bonus Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing View
  if (
    gameState === "playing" &&
    selectedChallenge &&
    selectedChallenge.questions[currentQuestion]
  ) {
    const question = selectedChallenge.questions[currentQuestion];
    const progress =
      ((currentQuestion + 1) / selectedChallenge.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={resetChallenge}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Exit
            </Button>
            <h2 className="text-xl font-semibold">{selectedChallenge.title}</h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center text-orange-600">
              <Zap className="w-5 h-5 mr-1" />
              <span className="font-semibold">Streak: {streak}</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Star className="w-5 h-5 mr-1" />
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="flex items-center text-red-600">
              <Timer className="w-5 h-5 mr-1" />
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of{" "}
              {selectedChallenge.questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {question.question}
              </h3>
              {question.context && (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {question.context}
                </p>
              )}
              {question.audio && (
                <Button variant="outline" className="mt-4">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen Again
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <Button
                  key={option}
                  variant="outline"
                  className="p-6 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => answerQuestion(option)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold mr-4">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results View
  if (gameState === "results" && selectedChallenge) {
    const maxScore = selectedChallenge.questions.length * 10;
    const scoreInfo = getScoreLevel(score, maxScore);
    const accuracy =
      answers.length > 0
        ? Math.round(
            (answers.filter((a) => a.isCorrect).length / answers.length) * 100
          )
        : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Challenge Complete!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {selectedChallenge.title}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {score}
                </div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {accuracy}%
                </div>
                <div className="text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {answers.filter((a) => a.isCorrect).length}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
            </div>

            <div className="mb-6">
              <Badge className={`text-lg px-4 py-2 ${scoreInfo.color}`}>
                {scoreInfo.level}
              </Badge>
              <p className="text-lg text-gray-700 mt-2">{scoreInfo.message}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    answer.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {answer.question}
                    </h4>
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                  </div>

                  <div className="text-sm">
                    <p className="mb-1">
                      <span className="font-medium">Your answer:</span>{" "}
                      {answer.userAnswer}
                    </p>
                    {!answer.isCorrect && (
                      <p className="mb-1">
                        <span className="font-medium">Correct answer:</span>{" "}
                        {answer.correct}
                      </p>
                    )}
                    <p className="text-gray-600 italic">{answer.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() =>
              selectedChallenge && startChallenge(selectedChallenge)
            }
            className="px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={resetChallenge} className="px-8">
            <Target className="w-4 h-4 mr-2" />
            New Challenge
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ChallengeMode;
