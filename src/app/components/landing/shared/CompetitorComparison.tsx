"use client";
import React from "react";
import { Check, X, Award } from "lucide-react";

export default function CompetitorComparison() {
  const features = [
    {
      feature: "Independent Expert Review",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "PhD-level professionals evaluate content quality, not just friends and family",
    },
    {
      feature: "Plagiarism Detection",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "AI-powered screening catches copied content and fake credentials",
    },
    {
      feature: "Instructor Credential Verification",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "We verify real expertise—LinkedIn profiles, portfolios, published work",
    },
    {
      feature: "Content Currency Check",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "Identifies outdated tools, deprecated code, and obsolete practices",
    },
    {
      feature: "Pedagogical Quality Assessment",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "Teaching structure, clarity, and learning effectiveness measured",
    },
    {
      feature: "Transparent Scoring Rubric",
      studentReviews: false,
      platformQA: true,
      verifylearn: true,
      description: "Public 0-100 score with detailed breakdown by category",
    },
    {
      feature: "Fast Turnaround Time",
      studentReviews: true,
      platformQA: false,
      verifylearn: true,
      description:
        "48-72 hours standard, 24-48 hours priority (vs 4-8 weeks for QM)",
    },
    {
      feature: "Affordable for Individual Creators",
      studentReviews: true,
      platformQA: false,
      verifylearn: true,
      description:
        "£299-499 per course (Quality Matters costs £3,000+ per course)",
    },
    {
      feature: "Manipulation-Resistant",
      studentReviews: false,
      platformQA: true,
      verifylearn: true,
      description:
        "Can't be gamed by fake reviews, friends, or review manipulation",
    },
    {
      feature: "Catches Issues Students Miss",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "Students can't detect plagiarism, fake credentials, or technical errors",
    },
    {
      feature: "Trusted Badge for Marketing",
      studentReviews: false,
      platformQA: true,
      verifylearn: true,
      description: "Display verified quality to increase conversions by 25-40%",
    },
    {
      feature: "Free Re-Verification",
      studentReviews: false,
      platformQA: false,
      verifylearn: true,
      description:
        "One free re-review after making improvements based on feedback",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Creators Choose VerifyLearn Over Traditional Reviews
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Student reviews and platform quality checks weren&apos;t designed to
            catch plagiarism, fake credentials, or outdated content. Here&apos;s
            how VerifyLearn provides real independent verification.
          </p>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-5">
                <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                  {item.feature}
                </h4>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Student Reviews
                    </span>
                    {item.studentReviews ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Platform QA</span>
                    {item.platformQA ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 -mx-5 px-5 py-2">
                    <span className="text-sm font-semibold text-blue-900">
                      VerifyLearn
                    </span>
                    {item.verifylearn ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-blue-600 text-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Quality Assurance</h3>
            </div>
            <div className="p-6 text-center border-l border-blue-500">
              <h3 className="text-base font-semibold mb-1">Student Reviews</h3>
              <p className="text-xs text-blue-100">Udemy, Coursera, etc.</p>
            </div>
            <div className="p-6 text-center border-l border-blue-500">
              <h3 className="text-base font-semibold mb-1">Platform QA</h3>
              <p className="text-xs text-blue-100">Quality Matters, OSCQR</p>
            </div>
            <div className="p-6 text-center border-l border-blue-500 bg-blue-700 relative">
              <div className="absolute top-2 right-2">
                <Award className="w-4 h-4 text-yellow-300" />
              </div>
              <h3 className="text-base font-semibold mb-1">VerifyLearn</h3>
              <p className="text-xs text-blue-100">Independent Verification</p>
            </div>
          </div>

          {/* Feature Rows */}
          <div>
            {features.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-4 border-b border-gray-200 last:border-b-0 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* Feature Name */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {item.feature}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                {/* Student Reviews Column */}
                <div className="p-6 text-center border-l border-gray-200 flex items-center justify-center">
                  {item.studentReviews ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-gray-300" />
                  )}
                </div>

                {/* Platform QA Column */}
                <div className="p-6 text-center border-l border-gray-200 flex items-center justify-center">
                  {item.platformQA ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-gray-300" />
                  )}
                </div>

                {/* VerifyLearn Column */}
                <div className="p-6 text-center border-l border-gray-200 bg-blue-50/50 flex items-center justify-center">
                  {item.verifylearn ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-8 space-y-4 sm:space-y-0 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
                <div className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  C
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <span>1,200+ courses verified across all platforms</span>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">{"★".repeat(5)}</div>
              <span>28% average sales increase for verified creators</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
