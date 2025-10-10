"use client";
import React from "react";
import { Check, X, Award, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Creators Choose VerifyLearn Over Traditional Reviews
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Student reviews and platform quality checks weren&apos;t designed to
            catch plagiarism, fake credentials, or outdated content. Here&apos;s
            how VerifyLearn provides real independent verification.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-slate-900 text-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Quality Assurance</h3>
            </div>
            <div className="p-6 text-center border-l border-slate-700">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-xs">⭐</span>
                </div>
                <h3 className="text-base font-semibold">Student Reviews</h3>
              </div>
              <p className="text-xs text-slate-400">Udemy, Coursera, etc.</p>
            </div>
            <div className="p-6 text-center border-l border-slate-700">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-xs">✓</span>
                </div>
                <h3 className="text-base font-semibold">Platform QA</h3>
              </div>
              <p className="text-xs text-slate-400">Quality Matters, OSCQR</p>
            </div>
            <div className="p-6 text-center border-l border-slate-700 bg-blue-600 relative">
              <div className="absolute top-2 right-2">
                <Award className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-2 text-white font-bold text-xs">
                  VL
                </div>
                <h3 className="text-base font-semibold">VerifyLearn</h3>
              </div>
              <p className="text-xs text-blue-100">Independent Verification</p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-slate-700">
            {features.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 hover:bg-slate-700/50 transition-colors"
              >
                {/* Feature Name */}
                <div className="p-6">
                  <h4 className="font-semibold text-white mb-1">
                    {item.feature}
                  </h4>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>

                {/* Student Reviews Column */}
                <div className="p-6 text-center border-l border-slate-700 flex items-center justify-center">
                  {item.studentReviews ? (
                    <div className="flex items-center text-yellow-500">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <X className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Not Available</span>
                    </div>
                  )}
                </div>

                {/* Platform QA Column */}
                <div className="p-6 text-center border-l border-slate-700 flex items-center justify-center">
                  {item.platformQA ? (
                    <div className="flex items-center text-purple-400">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Limited</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <X className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Not Available</span>
                    </div>
                  )}
                </div>

                {/* VerifyLearn Column */}
                <div className="p-6 text-center border-l border-slate-700 bg-blue-900/20 flex items-center justify-center">
                  {item.verifylearn ? (
                    <div className="flex items-center text-blue-400">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-semibold">
                        Full Coverage
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-500">
                      <X className="w-5 h-5 mr-2" />
                      <span className="text-sm">N/A</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Stand Out with Independent Verification?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join 1,200+ course creators who&apos;ve increased conversions by
              28% with trusted VerifyLearn badges that prove quality beyond
              student reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Get Your Course Verified - £299
              </Button>
              <div className="flex items-center text-blue-100 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>48-72 hour turnaround</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
                <div className="w-8 h-8 bg-indigo-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  C
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
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
