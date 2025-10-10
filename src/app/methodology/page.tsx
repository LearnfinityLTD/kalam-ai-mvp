"use client";
import React from "react";
import {
  Shield,
  Search,
  FileCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import Footer from "../components/shared/TempFooter";

export default function MethodologyPage() {
  const verificationSteps = [
    {
      icon: Search,
      title: "Course Intake & Initial Screening",
      duration: "Day 1",
      description:
        "We receive your course materials and conduct automated plagiarism detection, checking against millions of sources to identify copied content.",
      checks: [
        "Plagiarism scanning across web sources",
        "Duplicate content detection",
        "AI-generated content identification",
        "Source attribution verification",
      ],
    },
    {
      icon: Users,
      title: "Credential Verification",
      duration: "Days 1-2",
      description:
        "Our team verifies instructor credentials through LinkedIn, published work, portfolios, and professional certifications.",
      checks: [
        "LinkedIn profile authentication",
        "Published work verification",
        "Professional certification checks",
        "Industry experience validation",
      ],
    },
    {
      icon: FileCheck,
      title: "Content Quality Assessment",
      duration: "Days 2-3",
      description:
        "PhD-level experts in your subject area evaluate content accuracy, currency, and pedagogical effectiveness.",
      checks: [
        "Technical accuracy review",
        "Currency check (tools, frameworks, practices)",
        "Learning objectives alignment",
        "Content depth and breadth analysis",
      ],
    },
    {
      icon: Award,
      title: "Scoring & Report Generation",
      duration: "Day 3",
      description:
        "We compile findings into a comprehensive report with a 0-100 score and actionable recommendations.",
      checks: [
        "Transparent scoring across 5 categories",
        "Detailed strengths and weaknesses",
        "Specific improvement recommendations",
        "Verified badge (if score ≥ 75)",
      ],
    },
  ];

  const scoringCategories = [
    {
      category: "Content Accuracy",
      weight: "25%",
      description:
        "Technical correctness, up-to-date information, and factual accuracy",
    },
    {
      category: "Instructor Credentials",
      weight: "20%",
      description:
        "Verified expertise, industry experience, and teaching qualifications",
    },
    {
      category: "Pedagogical Quality",
      weight: "20%",
      description:
        "Learning structure, clarity, engagement, and teaching effectiveness",
    },
    {
      category: "Originality",
      weight: "20%",
      description:
        "Unique content, proper attribution, and freedom from plagiarism",
    },
    {
      category: "Production Quality",
      weight: "15%",
      description:
        "Audio/video quality, visual aids, and professional presentation",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our Verification Methodology
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent, rigorous, and independent. See exactly how we verify
            course quality through our 4-stage process combining AI technology
            with expert human review.
          </p>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                48-72h
              </div>
              <div className="text-sm text-gray-600">Standard Turnaround</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">PhD+</div>
              <div className="text-sm text-gray-600">Expert Reviewers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Scoring Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0-100</div>
              <div className="text-sm text-gray-600">Transparent Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The 4-Stage Verification Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every course goes through our standardized review process,
              ensuring consistent and thorough evaluation.
            </p>
          </div>

          <div className="space-y-8">
            {verificationSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {index + 1}. {step.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold mt-2 sm:mt-0">
                        <Clock className="w-4 h-4" />
                        {step.duration}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{step.description}</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.checks.map((check, checkIndex) => (
                        <div
                          key={checkIndex}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Breakdown */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Calculate Your Score
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your final score (0-100) is calculated from five weighted
              categories. Courses scoring 75+ receive our verified badge.
            </p>
          </div>

          <div className="space-y-4">
            {scoringCategories.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.category}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                        {item.weight}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Badge Qualification
                </h4>
                <p className="text-blue-800 text-sm">
                  Courses must score 75 or higher to receive the VerifyLearn
                  Verified badge. Scores below 75 receive a detailed report with
                  improvement recommendations and one free re-verification after
                  updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The VerifyLearn Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our methodology combines rigorous academic standards with
              practical industry expertise to deliver verification you can
              trust.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Key Differentiators */}
            <div className="space-y-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Independence Guaranteed
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Our reviewers maintain complete independence from course
                  creators and platforms. We receive the same compensation
                  regardless of whether your course passes or fails, eliminating
                  any conflict of interest.
                </p>
                <p className="text-gray-600 text-sm">
                  Unlike student reviews that can be manipulated or platform QA
                  systems that serve institutional interests, our verification
                  process is designed solely to provide honest, objective
                  assessment.
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Subject Matter Expertise
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Every course is reviewed by professionals holding advanced
                  degrees and substantial industry experience in the specific
                  subject area. Our reviewers can identify technical
                  inaccuracies, outdated practices, and pedagogical issues that
                  general audiences cannot detect.
                </p>
                <p className="text-gray-600 text-sm">
                  We match each course with reviewers who have both academic
                  credentials and practical, current experience in the field.
                </p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Technology-Augmented Review
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We leverage AI-powered tools for plagiarism detection, content
                  comparison, and initial screening, allowing our expert
                  reviewers to focus on areas requiring nuanced human judgment.
                </p>
                <p className="text-gray-600 text-sm">
                  This hybrid approach ensures comprehensive coverage while
                  maintaining the efficiency needed for rapid turnaround times.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Actionable Intelligence
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Beyond scoring, we provide detailed, specific recommendations
                  for improvement across all evaluation categories. Each report
                  includes clear action items that course creators can implement
                  immediately.
                </p>
                <p className="text-gray-600 text-sm">
                  Our one-time free re-verification ensures you have the support
                  needed to achieve verified status after implementing
                  improvements.
                </p>
              </div>
            </div>

            {/* Right Column - Comparison Metrics */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:sticky lg:top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                How We Compare
              </h3>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Verification Speed
                      </h4>
                      <p className="text-sm text-gray-600">
                        Time to complete review
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        48-72h
                      </div>
                      <div className="text-xs text-gray-500">vs 4-8 weeks</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Cost Efficiency
                      </h4>
                      <p className="text-sm text-gray-600">
                        Investment required
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        £299
                      </div>
                      <div className="text-xs text-gray-500">vs £3,000+</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Detection Capability
                      </h4>
                      <p className="text-sm text-gray-600">Issues identified</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        12+
                      </div>
                      <div className="text-xs text-gray-500">categories</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Reviewer Expertise
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qualification level
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-600">
                        PhD+
                      </div>
                      <div className="text-xs text-gray-500">specialists</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-600 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600 text-center">
                  Verified methodology trusted by 1,200+ course creators
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
