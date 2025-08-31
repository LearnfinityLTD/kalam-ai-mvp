"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import VoiceRecorder from "../../components/shared/VoiceRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Progress } from "@/ui/progress";
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Scenario {
  id: string;
  title: string;
  difficulty: string;
  scenario_text: string;
  expected_response: string;
  cultural_context: string;
  pronunciation_focus: string[];
}

interface ScenarioPracticeProps {
  userId: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export default function ScenarioPractice({
  userId,
  difficulty = "beginner",
}: ScenarioPracticeProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [practicing, setPracticing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchScenarios();
  }, [difficulty]);

  const fetchScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from("scenarios")
        .select("*")
        .eq("segment", "guard")
        .eq("difficulty", difficulty)
        .order("created_at");

      if (error) throw error;
      setScenarios(data || []);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      toast.error("Could not load scenarios");
    } finally {
      setLoading(false);
    }
  };

  const currentScenario = scenarios[currentIndex];

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setPracticing(true);

    try {
      // Transcribe audio
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const transcribeResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const { transcription } = await transcribeResponse.json();
      setUserResponse(transcription);

      // Get AI feedback
      const feedbackResponse = await fetch("/api/scenario-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: currentScenario.scenario_text,
          expectedResponse: currentScenario.expected_response,
          userResponse: transcription,
          focusWords: currentScenario.pronunciation_focus,
        }),
      });

      const feedbackData = await feedbackResponse.json();
      setScore(feedbackData.score);
      setFeedback(feedbackData.feedback);
      setAiResponse(feedbackData.aiResponse);

      // Save progress
      await saveProgress(feedbackData.score);
    } catch (error) {
      console.error("Error processing recording:", error);
      toast.error("Could not process recording");
    } finally {
      setPracticing(false);
    }
  };

  const saveProgress = async (userScore: number) => {
    try {
      const { error } = await supabase.from("user_progress").upsert({
        user_id: userId,
        scenario_id: currentScenario.id,
        completion_status: userScore >= 70 ? "completed" : "in_progress",
        score: userScore,
        last_attempt: new Date().toISOString(),
      });

      if (error) throw error;

      // Update streak
      await supabase.rpc("update_user_streak", { user_id: userId });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const nextScenario = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetPractice();
    }
  };

  const previousScenario = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetPractice();
    }
  };

  const resetPractice = () => {
    setUserResponse("");
    setAiResponse("");
    setScore(null);
    setFeedback("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading scenarios...
      </div>
    );
  }

  if (!currentScenario) {
    return (
      <div className="text-center p-8">
        No scenarios available for this difficulty level.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              {currentScenario.title}
              <Badge variant="secondary">{currentScenario.difficulty}</Badge>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} / {scenarios.length}
            </div>
          </div>
          <Progress
            value={((currentIndex + 1) / scenarios.length) * 100}
            className="mt-2"
          />
        </CardHeader>
      </Card>

      {/* Scenario Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Situation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{currentScenario.scenario_text}</p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Cultural Context:
            </h4>
            <p className="text-blue-800 text-sm">
              {currentScenario.cultural_context}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Focus on these words:</h4>
            <div className="flex flex-wrap gap-2">
              {currentScenario.pronunciation_focus.map((word, index) => (
                <Badge key={index} variant="outline">
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Practice */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Your Response</CardTitle>
        </CardHeader>
        <CardContent>
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            expectedText={currentScenario.expected_response}
            disabled={practicing}
          />

          {practicing && (
            <div className="mt-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-600 mt-2">
                Analyzing your pronunciation...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {score !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Your Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Score:</span>
              <Badge
                variant={
                  score >= 80
                    ? "default"
                    : score >= 60
                    ? "secondary"
                    : "destructive"
                }
              >
                {score}%
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">What you said:</h4>
              <p className="bg-gray-100 p-3 rounded italic">
                &quot;{userResponse}&quot;
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Expected response:</h4>
              <p className="bg-green-50 p-3 rounded">
                &quot;{currentScenario.expected_response}&quot;
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">AI Feedback:</h4>
              <p className="text-gray-700">{feedback}</p>
            </div>

            {aiResponse && (
              <div>
                <h4 className="font-medium mb-2">AI Response:</h4>
                <p className="bg-blue-50 p-3 rounded">{aiResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={previousScenario}
          disabled={currentIndex === 0}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button onClick={resetPractice} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>

        <Button
          onClick={nextScenario}
          disabled={currentIndex === scenarios.length - 1}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
