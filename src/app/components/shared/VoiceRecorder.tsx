"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Volume2,
  AlertCircle,
  CheckCircle,
  Target,
  Zap,
  Globe,
} from "lucide-react";

// Type definitions
interface PronunciationPattern {
  problemWords: string[];
  pattern: RegExp;
  feedback: string;
  exercises: string[];
}

interface PronunciationIssue {
  type: string;
  words: string[];
  feedback: string;
  exercises: string[];
}

interface AnalysisResults {
  overallScore: number;
  pronunciationIssues: PronunciationIssue[];
  culturalFeedback: string;
  strengths: string[];
  improvements: string[];
  arabicSpecificFeedback: string[];
}

interface VoiceRecorderProps {
  onRecordingComplete: (
    audioBlob: Blob,
    transcription?: string,
    analysis?: AnalysisResults
  ) => void;
  expectedText: string;
  disabled?: boolean;
  scenarioType?: string;
  pronunciationFocus?: string[];
}

// Arabic-to-English pronunciation challenges from the strategy document
const PRONUNCIATION_PATTERNS: Record<string, PronunciationPattern> = {
  // P/B confusion - Arabic lacks "P" sound
  p_b_confusion: {
    problemWords: [
      "business",
      "please",
      "stop",
      "up",
      "help",
      "paper",
      "people",
    ],
    pattern: /[bp]/gi,
    feedback:
      "Arabic speakers often substitute 'B' for 'P'. Focus on pressing your lips together and releasing air for the 'P' sound.",
    exercises: [
      'Practice: "Please" not "Blease"',
      'Try: "Business" not "Buziness"',
    ],
  },

  // TH sound difficulties
  th_sounds: {
    problemWords: [
      "think",
      "this",
      "that",
      "through",
      "thank",
      "things",
      "three",
    ],
    pattern: /th/gi,
    feedback:
      "The 'TH' sound is challenging for Arabic speakers. Place your tongue between your teeth and blow air gently.",
    exercises: [
      'Practice: "Think" not "Sink"',
      'Try: "Thank you" not "Sank you"',
    ],
  },

  // Short vowel distinctions
  vowel_confusion: {
    problemWords: [
      "ship",
      "sheep",
      "bit",
      "beat",
      "sit",
      "seat",
      "live",
      "leave",
    ],
    pattern: /[ie]/gi,
    feedback:
      "Arabic has fewer vowel sounds. Focus on the difference between short 'i' (ship) and long 'ee' (sheep).",
    exercises: ['Practice pair: "Ship" vs "Sheep"', 'Try: "Bit" vs "Beat"'],
  },

  // Consonant clusters
  consonant_clusters: {
    problemWords: [
      "strategy",
      "strong",
      "street",
      "structure",
      "straight",
      "stress",
    ],
    pattern: /str|spr|scr/gi,
    feedback:
      "Arabic doesn't have complex consonant clusters. Practice each consonant separately, then blend smoothly.",
    exercises: ['Break down: "S-tra-te-gy"', 'Practice: "Street" not "Sireet"'],
  },

  // Silent letters
  silent_letters: {
    problemWords: ["listen", "castle", "Christmas", "island", "knee", "know"],
    pattern:
      /(?:(?<=lis)t(?=en))|(?:(?<=cas)t(?=le))|(?:(?<=Chris)t(?=mas))|(?:(?<=is)l(?=and))|(?:k(?=n))/gi,
    feedback:
      "Silent letters don't exist in Arabic. Remember which letters are not pronounced in English words.",
    exercises: ['Practice: "Listen" (silent T)', 'Try: "Know" (silent K)'],
  },
};

// Business vocabulary specific to guards
const GUARD_VOCABULARY: Record<string, string[]> = {
  greetings: ["welcome", "good morning", "good afternoon", "may I help you"],
  security: ["identification", "badge", "visitor", "appointment", "security"],
  directions: ["elevator", "reception", "floor", "building", "office"],
  emergency: ["emergency", "evacuation", "exit", "safety", "procedures"],
  time: ["appointment", "schedule", "meeting", "waiting", "available"],
};

const EnhancedVoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  expectedText,
  disabled = false,
  scenarioType = "general",
  pronunciationFocus = [],
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [analysisResults, setAnalysisResults] =
    useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Analyze pronunciation for Arabic speaker challenges
  const analyzePronunciation = (
    userText: string,
    expectedText: string
  ): AnalysisResults => {
    const analysis: AnalysisResults = {
      overallScore: 0,
      pronunciationIssues: [],
      culturalFeedback: "",
      strengths: [],
      improvements: [],
      arabicSpecificFeedback: [],
    };

    const lowerUser = userText.toLowerCase();
    const lowerExpected = expectedText.toLowerCase();

    // Check for specific Arabic-to-English challenges
    Object.entries(PRONUNCIATION_PATTERNS).forEach(([key, pattern]) => {
      const problemWords = pattern.problemWords.filter(
        (word) => lowerExpected.includes(word) || lowerUser.includes(word)
      );

      if (problemWords.length > 0) {
        // Simulate detection of pronunciation issues
        const hasIssue = Math.random() > 0.6; // 40% chance of issue for demo

        if (hasIssue) {
          analysis.pronunciationIssues.push({
            type: key,
            words: problemWords,
            feedback: pattern.feedback,
            exercises: pattern.exercises,
          });
        }
      }
    });

    // Check vocabulary usage
    const usedGuardVocab: Array<{ word: string; category: string }> = [];
    Object.entries(GUARD_VOCABULARY).forEach(([category, words]) => {
      words.forEach((word) => {
        if (lowerUser.includes(word)) {
          usedGuardVocab.push({ word, category });
        }
      });
    });

    // Calculate score based on accuracy and pronunciation
    const accuracy = calculateTextSimilarity(lowerUser, lowerExpected);
    const pronunciationPenalty = analysis.pronunciationIssues.length * 10;
    analysis.overallScore = Math.max(
      20,
      Math.min(100, accuracy - pronunciationPenalty)
    );

    // Generate feedback
    if (analysis.overallScore >= 85) {
      analysis.culturalFeedback =
        "Excellent! Your pronunciation shows good adaptation to English phonetics. Continue practicing complex consonant clusters.";
      analysis.strengths = [
        "Clear pronunciation",
        "Good rhythm",
        "Professional tone",
      ];
    } else if (analysis.overallScore >= 70) {
      analysis.culturalFeedback =
        "Good progress! Focus on the specific Arabic-to-English sound challenges highlighted below.";
      analysis.strengths = ["Understandable speech", "Good vocabulary choice"];
      analysis.improvements = [
        "Work on specific pronunciation patterns",
        "Practice consonant clusters",
      ];
    } else {
      analysis.culturalFeedback =
        "Keep practicing! Focus on the fundamental sound differences between Arabic and English.";
      analysis.improvements = [
        "Practice basic pronunciation patterns",
        "Slow down for clarity",
        "Focus on individual sounds",
      ];
    }

    // Arabic-specific feedback
    if (analysis.pronunciationIssues.length > 0) {
      analysis.arabicSpecificFeedback = [
        "As an Arabic speaker, these sounds need extra attention:",
        ...analysis.pronunciationIssues.map((issue) => `• ${issue.feedback}`),
      ];
    }

    return analysis;
  };

  const calculateTextSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.split(" ");
    const words2 = text2.split(" ");
    const maxLength = Math.max(words1.length, words2.length);

    let matches = 0;
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
      if (words1[i] === words2[i]) matches++;
    }

    return Math.round((matches / maxLength) * 100);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);

        // Simulate transcription (in real app, this would call a speech-to-text API)
        setIsAnalyzing(true);
        setTimeout(() => {
          const mockTranscription = generateMockTranscription(expectedText);
          setTranscription(mockTranscription);

          const analysis = analyzePronunciation(
            mockTranscription,
            expectedText
          );
          setAnalysisResults(analysis);
          setIsAnalyzing(false);

          onRecordingComplete(blob, mockTranscription, analysis);
        }, 2000);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      // Toast would show error in real app
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const generateMockTranscription = (expected: string): string => {
    // Simulate common Arabic speaker pronunciation errors
    const commonErrors: Array<{ from: RegExp; to: string }> = [
      { from: /please/gi, to: "blease" },
      { from: /think/gi, to: "sink" },
      { from: /business/gi, to: "buziness" },
      { from: /strategy/gi, to: "sirategy" },
      { from: /three/gi, to: "sree" },
    ];

    let result = expected;

    // Sometimes introduce errors for demonstration
    if (Math.random() > 0.7) {
      const errorToApply =
        commonErrors[Math.floor(Math.random() * commonErrors.length)];
      result = result.replace(errorToApply.from, errorToApply.to);
    }

    return result;
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Expected Text Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">
              Practice This Response:
            </h4>
            <p className="text-blue-800 text-lg leading-relaxed">
              "{expectedText}"
            </p>

            {pronunciationFocus.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-blue-700 mb-2">
                  Focus on these words:
                </p>
                <div className="flex flex-wrap gap-2">
                  {pronunciationFocus.map((word, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={disabled || isAnalyzing}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 ${
                  disabled || isAnalyzing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
                }`}
              >
                <Mic className="w-8 h-8" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center animate-pulse shadow-lg"
              >
                <Square className="w-8 h-8" />
              </button>
            )}
          </div>

          <div>
            {isRecording ? (
              <div className="space-y-2">
                <p className="text-red-600 font-medium">Recording...</p>
                <p className="text-sm text-gray-600">
                  {formatTime(recordingTime)}
                </p>
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: Math.random() * 20 + 10,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-2">
                <p className="text-blue-600 font-medium">
                  Analyzing Arabic Pronunciation Patterns...
                </p>
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <p className="text-gray-600">
                Tap the microphone to start recording
              </p>
            )}
          </div>

          {audioBlob && !isAnalyzing && (
            <div className="flex justify-center gap-3">
              <button
                onClick={isPlaying ? stopPlaying : playRecording}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isPlaying ? "Stop" : "Play"} Recording
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transcription Results */}
      {transcription && (
        <div className="bg-white border rounded-lg p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-gray-600" />
            What You Said:
          </h4>
          <p className="bg-gray-50 p-4 rounded-lg text-gray-800 italic border-l-4 border-gray-300">
            "{transcription}"
          </p>
        </div>
      )}

      {/* Arabic-Specific Pronunciation Analysis */}
      {analysisResults && (
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Pronunciation Analysis</h4>
              <div
                className={`px-4 py-2 rounded-full text-lg font-bold ${
                  analysisResults.overallScore >= 85
                    ? "bg-green-100 text-green-800"
                    : analysisResults.overallScore >= 70
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {analysisResults.overallScore}%
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    analysisResults.overallScore >= 85
                      ? "bg-green-500"
                      : analysisResults.overallScore >= 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${analysisResults.overallScore}%` }}
                />
              </div>
            </div>

            <p className="text-gray-700">{analysisResults.culturalFeedback}</p>
          </div>

          {/* Arabic-Specific Pronunciation Issues */}
          {analysisResults.pronunciationIssues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-amber-900">
                  Arabic Speaker Challenges Detected
                </h4>
              </div>

              {analysisResults.pronunciationIssues.map((issue, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <h5 className="font-medium text-amber-900 mb-2">
                      {issue.type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                      Issue
                    </h5>
                    <p className="text-amber-800 text-sm mb-3">
                      {issue.feedback}
                    </p>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-amber-700">
                        Practice Exercises:
                      </p>
                      {issue.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Zap className="w-3 h-3 text-amber-600" />
                          <span className="text-amber-700">{exercise}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium text-amber-700 mb-1">
                        Affected Words:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {issue.words.map((word, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths and Improvements */}
          <div className="grid md:grid-cols-2 gap-4">
            {analysisResults.strengths.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h5 className="font-medium text-green-900">Strengths</h5>
                </div>
                <ul className="space-y-1">
                  {analysisResults.strengths.map(
                    (strength: string, index: number) => (
                      <li
                        key={index}
                        className="text-green-800 text-sm flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {strength}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {analysisResults.improvements.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h5 className="font-medium text-blue-900">Focus Areas</h5>
                </div>
                <ul className="space-y-1">
                  {analysisResults.improvements.map(
                    (improvement: string, index: number) => (
                      <li
                        key={index}
                        className="text-blue-800 text-sm flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Cultural Bridge Tips */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-900 mb-3">
              Cultural Communication Tips
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-purple-800 mb-1">
                    Western Business Context:
                  </p>
                  <p className="text-purple-700">
                    International visitors expect direct, clear communication.
                    Your role as a guard requires professional English that
                    builds confidence and trust.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-purple-800 mb-1">
                    Cultural Balance:
                  </p>
                  <p className="text-purple-700">
                    Maintain Arab hospitality while using precise English. Say
                    "Welcome" warmly, then be specific about procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Pronunciation Tips */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">
          Quick Tips for Arabic Speakers:
        </h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">P vs B Sounds:</p>
            <p className="text-gray-600">
              Press lips together, release with air: "Please" not "Blease"
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">TH Sounds:</p>
            <p className="text-gray-600">
              Tongue between teeth: "Think" not "Sink"
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Vowel Length:</p>
            <p className="text-gray-600">
              Short 'i' in "ship", long 'ee' in "sheep"
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Silent Letters:</p>
            <p className="text-gray-600">
              Don't pronounce: "Listen" (silent T)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVoiceRecorder;
