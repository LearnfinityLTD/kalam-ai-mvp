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

/* ---------- Types ---------- */

type Question = {
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
  color: string; // tailwind gradient classes
  difficulty: Difficulty;
  time: string; // e.g. "5 min"
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

type GameState = "menu" | "playing" | "results";

// Allowed values (single source of truth)
export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

export const DIALECTS = ["gulf", "egyptian", "levantine", "standard"] as const;
export type Dialect = (typeof DIALECTS)[number];

// Accept raw strings from DB/props, normalize to unions internally
interface ChallengeModeProps {
  userLevel?: Level | string | null;
  userDialect?: Dialect | string | null;
  initialLoading?: boolean;
  bootDelayMs?: number;
}

// Safe normalizers (case-insensitive)
const toLevel = (v?: string | null): Level => {
  const s = (v ?? "").toUpperCase();
  return (LEVELS as readonly string[]).includes(s) ? (s as Level) : "A2";
};

const toDialect = (v?: string | null): Dialect => {
  const s = (v ?? "").toLowerCase();
  return (DIALECTS as readonly string[]).includes(s) ? (s as Dialect) : "gulf";
};

/* ---------- Component ---------- */

const ChallengeMode: React.FC<ChallengeModeProps> = ({
  userLevel: userLevelProp = "A2",
  userDialect: userDialectProp = "gulf",

  initialLoading = true,
  bootDelayMs = 400,
}) => {
  const userLevel = toLevel(userLevelProp);
  const userDialect = toDialect(userDialectProp);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [streak, setStreak] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [booting, setBooting] = useState<boolean>(Boolean(initialLoading));

  /* ---------- Generators ---------- */

  const generateCulturalQuestions = useCallback(
    (_level: Level): Question[] => [
      {
        question:
          "A visitor asks you where the bathroom is. What's the most appropriate response?",
        context: "You're working as a security guard in a Dubai mall.",
        options: [
          "It's over there, go straight and turn left",
          "I'll show you the way to the restroom, please follow me",
          "Bathroom is there",
          "Ask someone else, I don't know",
        ],
        correct: "I'll show you the way to the restroom, please follow me",
        explanation:
          "In UAE service culture, offering to personally help shows excellent customer service. Using 'restroom' is more professional than 'bathroom' in this context.",
      },
      {
        question:
          "During Ramadan, how should you respond to a colleague who's fasting when they offer you tea?",
        context: "You're in an office in Abu Dhabi during afternoon break.",
        options: [
          "No thanks, you shouldn't be offering tea while fasting",
          "Thank you so much for thinking of me, that's very kind even though you're fasting",
          "I don't want tea now",
          "Are you sure you should be making tea?",
        ],
        correct:
          "Thank you so much for thinking of me, that's very kind even though you're fasting",
        explanation:
          "This response shows cultural sensitivity and appreciation. It acknowledges their kindness while being respectful of their fasting.",
      },
      {
        question:
          "An elderly Emirati man approaches you speaking Arabic. You don't understand. What do you say?",
        context: "You're working at a government office in Sharjah.",
        options: [
          "I don't speak Arabic",
          "Sorry, no Arabic",
          "I apologize, sir, but I don't speak Arabic. Let me find someone who can help you",
          "Sorry, English only",
        ],
        correct:
          "I apologize, sir, but I don't speak Arabic. Let me find someone who can help you",
        explanation:
          "This response shows respect (using 'sir'), apologizes politely, and offers a solution. Very important in UAE's respect-based culture.",
      },
    ],
    []
  );

  const generatePronunciationQuestions = useCallback(
    (_dialect: Dialect): Question[] => [
      {
        question: "Which word has the correct pronunciation of the 'P' sound?",
        context:
          "Arabic speakers often replace 'P' with 'B'. Listen carefully.",
        audio: true,
        options: [
          "Beople (BEE-bul)",
          "People (PEE-pul)",
          "Beobel (BEE-bul)",
          "Peopel (PEE-bul)",
        ],
        correct: "People (PEE-pul)",
        explanation:
          "The 'P' sound is made by pressing lips together and releasing air. Arabic speakers often substitute 'B' which uses the same lip position but with voice.",
      },
      {
        question: "How do you pronounce 'three'?",
        context:
          "The 'th' sound doesn't exist in Arabic, making it challenging.",
        options: ["Free (TREE)", "Sree (SREE)", "Three (θriː)", "Tree (TREE)"],
        correct: "Three (θriː)",
        explanation:
          "Put your tongue between your teeth and blow air. Don't substitute with 'F', 'S', or 'T' sounds.",
      },
      {
        question: "Which pronunciation of 'working' is correct?",
        context: "Focus on the final 'ng' sound.",
        options: [
          "Working (WOR-king)",
          "Workink (WOR-kink)",
          "Working (WOR-keen)",
          "Workeng (WOR-keng)",
        ],
        correct: "Working (WOR-king)",
        explanation:
          "The 'ng' sound is one sound, not 'n' + 'g'. Don't add extra sounds at the end.",
      },
    ],
    []
  );

  const generateRapidQuestions = useCallback(
    (_level: Level): Question[] => [
      {
        question: "Complete: 'I _____ been working here for five years.'",
        options: ["have", "has", "am", "will"],
        correct: "have",
        explanation:
          "Present perfect with 'I' uses 'have'. This shows an action that started in the past and continues to now.",
      },
      {
        question: "Which is correct?",
        options: [
          "I am very much hungry",
          "I am very hungry",
          "I am too much hungry",
          "I have very hunger",
        ],
        correct: "I am very hungry",
        explanation:
          "'Very hungry' is correct. Avoid 'very much hungry' (Arabic structure influence) or 'too much hungry'.",
      },
      {
        question:
          "Choose the right preposition: 'I will call you _____ the morning.'",
        options: ["in", "at", "on", "by"],
        correct: "in",
        explanation:
          "Use 'in' with parts of the day: in the morning, in the afternoon, in the evening. Exception: at night.",
      },
    ],
    []
  );

  const generateDialectQuestions = useCallback(
    (dialect: Dialect): Question[] => {
      const gulfQuestions: Question[] = [
        {
          question: "How do you say 'صح كذا؟' (sah chidha?) in formal English?",
          context: "Expressing confirmation politely in a business setting.",
          options: [
            "Right like this?",
            "Is this correct?",
            "True like this?",
            "Correct this way?",
          ],
          correct: "Is this correct?",
          explanation:
            "While Gulf speakers might directly translate, 'Is this correct?' is the most natural and professional way to seek confirmation.",
        },
        {
          question:
            "Instead of 'خلاص' (khalas) meaning 'finished', what should you say in English?",
          options: [
            "Khalas, finished",
            "That's it, we're done",
            "Finish, khalas",
            "Done, finished",
          ],
          correct: "That's it, we're done",
          explanation:
            "This captures both the finality and completion sense of 'khalas' in natural English without direct translation.",
        },
      ];

      const egyptianQuestions: Question[] = [
        {
          question:
            "How do you express 'معلش' (ma'alesh) in professional English?",
          context: "Showing understanding when someone makes a minor mistake.",
          options: [
            "No problem",
            "It's okay, don't worry about it",
            "Never mind",
            "Doesn't matter",
          ],
          correct: "It's okay, don't worry about it",
          explanation:
            "This captures the reassuring, forgiving tone of 'ma'alesh' better than direct translations.",
        },
      ];

      return dialect === "gulf"
        ? gulfQuestions
        : dialect === "egyptian"
        ? egyptianQuestions
        : gulfQuestions;
    },
    []
  );

  const generateGrammarQuestions = useCallback(
    (_level: Level): Question[] => [
      {
        question: "Which sentence is correct?",
        context: "Arabic speakers often struggle with article usage.",
        options: [
          "I went to the hospital to visit my friend",
          "I went to hospital to visit my friend",
          "I went to a hospital to visit my friend",
          "I went hospital to visit my friend",
        ],
        correct: "I went to the hospital to visit my friend",
        explanation:
          "Use 'the hospital' when referring to a specific hospital or the local hospital everyone knows about.",
      },
      {
        question: "Fix this sentence: 'My friend, he is very smart.'",
        context: "Arabic structure influence - avoid double subjects.",
        options: [
          "My friend, he is very smart",
          "My friend he is very smart",
          "My friend is very smart",
          "My friend, is very smart",
        ],
        correct: "My friend is very smart",
        explanation:
          "Don't repeat the subject with a pronoun. Arabic allows this structure, but English doesn't.",
      },
      {
        question: "Which is grammatically correct?",
        options: [
          "I have 25 years old",
          "I am 25 years old",
          "My age is 25 years",
          "I have 25 years",
        ],
        correct: "I am 25 years old",
        explanation:
          "Use 'am/is/are' with age, not 'have'. This is a common mistake from Arabic structure influence.",
      },
    ],
    []
  );

  const generateConfidenceQuestions = useCallback(
    (_level: Level): Question[] => [
      {
        question: "What's a good way to start a conversation with a colleague?",
        context: "Building confidence in social interactions.",
        options: [
          "How are you doing today?",
          "What's up?",
          "How's everything going?",
          "All of the above are fine",
        ],
        correct: "All of the above are fine",
        explanation:
          "All these options work well. The key is choosing what feels natural to you and fits the situation.",
      },
      {
        question: "If you don't understand something, what should you say?",
        options: [
          "I'm sorry, could you please repeat that?",
          "Could you explain that again, please?",
          "I didn't quite catch that",
          "All of these are perfectly acceptable",
        ],
        correct: "All of these are perfectly acceptable",
        explanation:
          "Asking for clarification shows you're engaged and want to understand. Never be embarrassed about this.",
      },
    ],
    []
  );

  /* ---------- Challenges ---------- */

  const challengeTypes: Challenge[] = [
    {
      id: "cultural_scenarios",
      title: "Cultural Scenarios",
      subtitle: "Navigate UAE workplace situations",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      difficulty: "Medium",
      time: "5 min",
      description: "Real workplace situations in Gulf context",
      questions: generateCulturalQuestions(userLevel),
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
      questions: generatePronunciationQuestions(userDialect),
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
      questions: generateRapidQuestions(userLevel),
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
      questions: generateDialectQuestions(userDialect),
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
      questions: generateGrammarQuestions(userLevel),
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
      questions: generateConfidenceQuestions(userLevel),
    },
  ];

  /* ---------- Handlers ---------- */

  const startChallenge = useCallback((challenge: Challenge) => {
    if (
      !challenge ||
      !challenge.questions ||
      challenge.questions.length === 0
    ) {
      console.error("Invalid challenge or no questions available");
      return;
    }

    setSelectedChallenge(challenge);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setAnswers([]);
    // extract leading minutes number from "5 min"
    const minutes = parseInt(challenge.time, 10) || 0;
    setTimeLeft(minutes * 60);
    setGameState("playing");
  }, []);

  const answerQuestion = useCallback(
    (answer: string) => {
      if (
        !selectedChallenge ||
        !selectedChallenge.questions ||
        !selectedChallenge.questions[currentQuestion]
      ) {
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
        setStreak((prev) => prev + 1);
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

  const endChallenge = useCallback(() => {
    setGameState("results");
  }, []);

  /* ---------- Timer ---------- */

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      endChallenge();
    }
  }, [timeLeft, gameState, endChallenge]);

  const resetChallenge = useCallback(() => {
    setGameState("menu");
    setSelectedChallenge(null);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(0);
    setStreak(0);
    setAnswers([]);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!booting) return;
    const id = setTimeout(() => setBooting(false), bootDelayMs);
    return () => clearTimeout(id);
  }, [booting, bootDelayMs]);

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

  /* ---------- Views ---------- */
  if (booting) {
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
              <span className="text-xs text-gray-600">Starting…</span>
            </Button>
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
              {answers.map((answer) => (
                <div
                  key={`${answer.question}-${answer.userAnswer}`}
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
