"use client";

import { Button } from "@/ui/button";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
    issueType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = () => {
    console.log("File upload clicked");
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/guards/help-center")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Help Center
                </Button>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    كلام
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    KalamAI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank you for your feedback!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                We&apos;ve received your message and sent a confirmation to your
                email.
              </p>
              <p className="text-gray-500">
                Our support team will review your feedback and respond within
                24-48 hours.
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <Button
                onClick={() => router.push("/guards/help-center")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Back to Help Center
              </Button>
              <Button
                onClick={() => router.push("/guards/dashboard")}
                variant="outline"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular form
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  كلام
                </div>
                <span className="text-xl font-bold text-gray-900">KalamAI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-blue-500">
          <span
            onClick={() => router.back()}
            className="uppercase font-medium cursor-pointer hover:underline"
          >
            HELP CENTER
          </span>
          <span>›</span>
          <span className="uppercase font-medium">FEEDBACK</span>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            What can we help you with?
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your issue
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Please describe the issue you are experiencing in as much
                    detail as possible. This will help us understand what&apos;s
                    going on.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of issue <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.issueType}
                  onChange={(e) =>
                    setFormData({ ...formData, issueType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="">PLEASE SELECT ONE...</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Problem</option>
                  <option value="content">Content Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div
                  onClick={!isSubmitting ? handleFileUpload : undefined}
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
                    !isSubmitting
                      ? "cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="text-blue-500 font-medium">Add file</span>{" "}
                    or drop files here
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
