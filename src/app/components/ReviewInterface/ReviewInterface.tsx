"use client";
import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Rubric {
  name: string;
  label: string;
  max: number;
}

interface Scores {
  [key: string]: number;
}

interface Feedback {
  strengths: string;
  weaknesses: string;
  bestSuitedFor: string;
  recommendation: string;
}

type PlagiarismStatus =
  | "not_checked"
  | "checking"
  | "clear"
  | "warning"
  | "error";
type SubmitStatus = "success" | "error" | null;

interface ReviewInterfaceProps {
  courseId: string;
  courseUrl?: string;
  currentStatus?: string;
}

export default function ReviewInterface({
  courseId,
  courseUrl = "",
  currentStatus = "pending",
}: ReviewInterfaceProps) {
  const rubrics: Rubric[] = [
    { name: "technical_accuracy", label: "Technical Accuracy", max: 5 },
    { name: "depth_coverage", label: "Depth of Coverage", max: 5 },
    { name: "practical_application", label: "Practical Application", max: 5 },
    { name: "content_structure", label: "Content Structure", max: 5 },
    { name: "completeness", label: "Completeness", max: 5 },
    { name: "up_to_date", label: "Up to Date", max: 5 },
    { name: "unique_value", label: "Unique Value", max: 5 },
    { name: "code_quality", label: "Code Quality (if applicable)", max: 5 },
    { name: "expertise_evidence", label: "Expertise Evidence", max: 5 },
    { name: "teaching_clarity", label: "Teaching Clarity", max: 5 },
    { name: "engagement", label: "Engagement", max: 5 },
    {
      name: "professional_background",
      label: "Professional Background",
      max: 5,
    },
    { name: "video_quality", label: "Video Quality", max: 5 },
    { name: "audio_quality", label: "Audio Quality", max: 5 },
    { name: "visual_aids", label: "Visual Aids", max: 5 },
    { name: "pacing", label: "Pacing", max: 5 },
    { name: "clear_objectives", label: "Clear Objectives", max: 5 },
    { name: "assessment_methods", label: "Assessment Methods", max: 5 },
    { name: "student_support", label: "Student Support", max: 5 },
    { name: "career_relevance", label: "Career Relevance", max: 5 },
  ];

  const [scores, setScores] = useState<Scores>(
    rubrics.reduce(
      (acc, rubric) => ({ ...acc, [rubric.name]: 0 }),
      {} as Scores
    )
  );

  const [plagiarismStatus, setPlagiarismStatus] =
    useState<PlagiarismStatus>("not_checked");
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] =
    useState<boolean>(false);

  const [feedback, setFeedback] = useState<Feedback>({
    strengths: "",
    weaknesses: "",
    bestSuitedFor: "",
    recommendation: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [reviewerId, setReviewerId] = useState<string | null>(null);

  useEffect(() => {
    async function getReviewer() {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", "reviewer@verifylearn.com")
        .single();

      if (data) {
        setReviewerId(data.id);
      }
    }
    getReviewer();
  }, []);

  const handleScoreChange = (rubricName: string, value: string): void => {
    setScores((prev) => ({ ...prev, [rubricName]: parseInt(value) }));
  };

  // Future: Full course content plagiarism check
  async function comprehensivePlagiarismCheck(courseId: string) {
    // 1. Extract video transcripts (YouTube API / Deepgram)
    // 2. Extract code from course files
    // 3. Check against:
    //    - Other Udemy courses
    //    - GitHub repositories
    //    - Stack Overflow
    //    - Technical documentation
    // 4. Generate detailed report
  }

  const runPlagiarismCheck = async (): Promise<void> => {
    setIsCheckingPlagiarism(true);
    setPlagiarismStatus("checking");

    try {
      // Get course data from Supabase
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("title, description, course_url")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      // Show manual review instructions
      const shouldProceed = window.confirm(
        `PLAGIARISM CHECK INSTRUCTIONS:\n\n` +
          `You must manually verify:\n\n` +
          `1. Course curriculum (compare with similar courses)\n` +
          `2. Code examples (check GitHub, Stack Overflow)\n` +
          `3. Lecture content (watch at least 3 sample videos)\n` +
          `4. Teaching methodology (ensure it's original)\n\n` +
          `Course URL: ${courseData.course_url}\n\n` +
          `Click OK to continue with automated check of title/description, ` +
          `then you'll enter your manual assessment.`
      );

      if (!shouldProceed) {
        throw new Error("Plagiarism check cancelled");
      }

      // Auto-check title and description
      const textToCheck = `${courseData.title}\n\n${courseData.description}`;

      const response = await fetch("/api/check-plagiarism", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToCheck,
          courseUrl: courseData.course_url,
        }),
      });

      let autoScore = 0;
      if (response.ok) {
        const data = await response.json();
        autoScore = data.score || 0;
      }

      // Get manual assessment from reviewer
      const manualScoreInput = prompt(
        `Automated check of title/description: ${autoScore}%\n\n` +
          `Based on your manual review of the course content:\n` +
          `- Curriculum originality\n` +
          `- Code examples\n` +
          `- Video content\n` +
          `- Teaching approach\n\n` +
          `Enter overall plagiarism score (0-100):\n` +
          `0 = Completely original\n` +
          `15 = Minor similarities (acceptable)\n` +
          `30+ = Significant plagiarism (reject)`
      );

      if (!manualScoreInput) {
        throw new Error("Manual assessment required");
      }

      const finalScore = parseInt(manualScoreInput);

      if (isNaN(finalScore) || finalScore < 0 || finalScore > 100) {
        throw new Error("Invalid score. Please enter a number between 0-100");
      }

      setPlagiarismScore(finalScore);
      setPlagiarismStatus(finalScore > 15 ? "warning" : "clear");
    } catch (error) {
      setPlagiarismStatus("error");
      console.error("Plagiarism check failed:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsCheckingPlagiarism(false);
    }
  };

  const calculateTotalScore = (): {
    total: number;
    maxTotal: number;
    percentage: string;
    grade: string;
  } => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxTotal = rubrics.length * 5;
    const percentage = ((total / maxTotal) * 100).toFixed(1);

    let grade = "F";
    const percentNum = parseFloat(percentage);
    if (percentNum >= 90) grade = "A+";
    else if (percentNum >= 80) grade = "A";
    else if (percentNum >= 70) grade = "B";
    else if (percentNum >= 60) grade = "C";
    else if (percentNum >= 50) grade = "D";

    return { total, maxTotal, percentage, grade };
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const allScoresSet = Object.values(scores).every((score) => score > 0);
      const allFeedbackFilled = Object.values(feedback).every(
        (field) => field.trim().length > 0
      );

      if (!allScoresSet) {
        throw new Error("Please score all rubrics before submitting");
      }

      if (!allFeedbackFilled) {
        throw new Error("Please complete all feedback sections");
      }

      if (plagiarismStatus === "not_checked") {
        throw new Error("Please run plagiarism check before submitting");
      }

      if (!reviewerId) {
        throw new Error("Reviewer not found");
      }

      const { total, grade } = calculateTotalScore();

      const strengthsArray = feedback.strengths
        .split("\n")
        .filter((s) => s.trim().length > 0)
        .map((s) => s.replace(/^[•\-]\s*/, "").trim());

      const weaknessesArray = feedback.weaknesses
        .split("\n")
        .filter((w) => w.trim().length > 0)
        .map((w) => w.replace(/^[•\-]\s*/, "").trim());

      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .insert({
          course_id: courseId,
          reviewer_id: reviewerId,
          ...scores,
          total_score: total,
          grade: grade,
          plagiarism_score: plagiarismScore,
          strengths: strengthsArray,
          weaknesses: weaknessesArray,
          recommendation: feedback.recommendation,
          best_for: feedback.bestSuitedFor,
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      const { error: courseError } = await supabase
        .from("courses")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", courseId);

      if (courseError) throw courseError;

      const badgeCode = `VL-${courseId.slice(0, 8).toUpperCase()}`;
      const verifiedDate = new Date();
      const expiresDate = new Date();
      expiresDate.setFullYear(verifiedDate.getFullYear() + 2);

      const { error: badgeError } = await supabase
        .from("verification_badges")
        .insert({
          course_id: courseId,
          badge_code: badgeCode,
          score: total,
          grade: grade,
          verified_date: verifiedDate.toISOString().split("T")[0],
          expires_date: expiresDate.toISOString().split("T")[0],
          is_active: true,
        });

      if (badgeError) throw badgeError;

      setSubmitStatus("success");

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Submission error:", error);
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const { total, maxTotal, percentage, grade } = calculateTotalScore();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Course</h1>
            <p className="text-gray-600 mt-2">
              Complete all sections to submit your review
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Current Status</div>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                currentStatus === "verified"
                  ? "bg-green-100 text-green-800"
                  : currentStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {currentStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {courseUrl && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Course Preview
          </h2>
          <iframe
            src={courseUrl}
            className="w-full h-96 border-2 border-gray-300 rounded-lg"
            title="Course Preview"
          />
          <p className="text-sm text-gray-500">
            Review the course content thoroughly before scoring
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Rubric Scoring
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {total}/{maxTotal}
            </div>
            <div className="text-sm text-gray-600">
              {percentage}% - Grade: {grade}
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
          {rubrics.map((rubric) => (
            <div
              key={rubric.name}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <label className="w-64 text-sm font-medium text-gray-700">
                {rubric.label}
              </label>
              <input
                type="range"
                min="0"
                max={rubric.max}
                step="1"
                value={scores[rubric.name]}
                onChange={(e) => handleScoreChange(rubric.name, e.target.value)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 text-center font-semibold text-gray-900">
                {scores[rubric.name]}/{rubric.max}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Plagiarism Check
        </h3>

        <button
          type="button"
          onClick={runPlagiarismCheck}
          disabled={isCheckingPlagiarism}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {isCheckingPlagiarism ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            "Run Plagiarism Check"
          )}
        </button>

        {plagiarismStatus !== "not_checked" && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              plagiarismStatus === "clear"
                ? "bg-green-50 border border-green-200"
                : plagiarismStatus === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : plagiarismStatus === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            {plagiarismStatus === "clear" && (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            )}
            {plagiarismStatus === "warning" && (
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            )}
            {plagiarismStatus === "error" && (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            {plagiarismStatus === "checking" && (
              <Loader className="w-6 h-6 text-blue-600 animate-spin flex-shrink-0" />
            )}

            <div>
              <p className="font-semibold">
                {plagiarismStatus === "checking" &&
                  "Checking for plagiarism..."}
                {plagiarismStatus === "clear" &&
                  `Plagiarism Check: ${plagiarismScore}% match found`}
                {plagiarismStatus === "warning" &&
                  `Warning: ${plagiarismScore}% match found`}
                {plagiarismStatus === "error" &&
                  "Error running plagiarism check"}
              </p>
              <p className="text-sm mt-1">
                {plagiarismStatus === "clear" &&
                  "Content appears to be original"}
                {plagiarismStatus === "warning" &&
                  "Significant similarities detected - review carefully"}
                {plagiarismStatus === "error" &&
                  "Please try again or contact support"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Qualitative Feedback
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Strengths (3-5 points, one per line)
          </label>
          <textarea
            value={feedback.strengths}
            onChange={(e) =>
              setFeedback((prev) => ({ ...prev, strengths: e.target.value }))
            }
            placeholder="Well-structured curriculum with clear progression&#10;Excellent real-world examples from industry&#10;High-quality production with clear audio/visual"
            className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Weaknesses (3-5 points, one per line)
          </label>
          <textarea
            value={feedback.weaknesses}
            onChange={(e) =>
              setFeedback((prev) => ({ ...prev, weaknesses: e.target.value }))
            }
            placeholder="Lacks advanced topics for experienced developers&#10;Some outdated library versions used&#10;Could benefit from more hands-on exercises"
            className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Best Suited For
          </label>
          <textarea
            value={feedback.bestSuitedFor}
            onChange={(e) =>
              setFeedback((prev) => ({
                ...prev,
                bestSuitedFor: e.target.value,
              }))
            }
            placeholder="This course is ideal for beginners with basic programming knowledge who want to learn React..."
            className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Final Recommendation
          </label>
          <textarea
            value={feedback.recommendation}
            onChange={(e) =>
              setFeedback((prev) => ({
                ...prev,
                recommendation: e.target.value,
              }))
            }
            placeholder="Overall assessment and whether you recommend this course..."
            className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || currentStatus === "verified"}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Submitting Review...
            </>
          ) : currentStatus === "verified" ? (
            "Course Already Verified"
          ) : (
            "Submit Review & Verify Course"
          )}
        </button>

        {submitStatus === "success" && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="w-5 h-5" />
            Review submitted! Course verified successfully!
          </div>
        )}
      </div>
    </div>
  );
}
