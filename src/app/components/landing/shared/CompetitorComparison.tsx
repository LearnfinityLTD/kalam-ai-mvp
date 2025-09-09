"use client";
import React from "react";
import { Check, X, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function CompetitorComparison() {
  const features = [
    {
      feature: "Cultural Context Training",
      generic: false,
      kalam: true,
      description:
        "Learn culturally-appropriate responses for Islamic contexts",
    },
    {
      feature: "Prayer-Aware Learning",
      generic: false,
      kalam: true,
      description: "Automatic breaks during prayer times",
    },
    {
      feature: "Real Tourist Scenarios",
      generic: false,
      kalam: true,
      description:
        "Practice actual situations you face at mosques and tourist sites",
    },
    {
      feature: "Arabic-Native Pronunciation",
      generic: false,
      kalam: true,
      description: "Pronunciation guidance tailored for Arabic speakers",
    },
    {
      feature: "Islamic Etiquette Training",
      generic: false,
      kalam: true,
      description: "Learn to explain Islamic practices respectfully in English",
    },
    {
      feature: "Team Progress Tracking",
      generic: false,
      kalam: true,
      description: "Monitor your mosque or business team's progress",
    },
    {
      feature: "Professional Role-Specific Content",
      generic: false,
      kalam: true,
      description:
        "Content designed for guards, hosts, guides, and business professionals",
    },
    {
      feature: "Generic Conversations",
      generic: true,
      kalam: false,
      description: "Basic everyday English practice",
    },
    {
      feature: "One-Size-Fits-All Approach",
      generic: true,
      kalam: false,
      description: "Same content for everyone regardless of profession",
    },
    {
      feature: "Cultural Sensitivity",
      generic: false,
      kalam: true,
      description:
        "Understand and respect cultural differences in communication",
    },
    {
      feature: "Emergency Situation Training",
      generic: false,
      kalam: true,
      description: "Handle unexpected questions and emergency situations",
    },
    {
      feature: "Regional Arabic Dialect Support",
      generic: false,
      kalam: true,
      description: "Optimized for Egyptian, Gulf, Levantine Arabic speakers",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Kalam AI Over Generic Apps?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Most English learning apps weren&apos;t built for your professional
            reality. Here&apos;s how Kalam AI is specifically designed for
            Arabic-speaking professionals.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-900 text-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Features</h3>
            </div>
            <div className="p-6 text-center border-l border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">📱</span>
                </div>
                <h3 className="text-lg font-semibold">Generic Apps</h3>
              </div>
              <p className="text-sm text-gray-300">Duolingo, Babbel, etc.</p>
            </div>
            <div className="p-6 text-center border-l border-gray-700 bg-green-600 relative">
              <div className="absolute top-2 right-2">
                <Crown className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 text-white font-bold text-xs">
                  كلام
                </div>
                <h3 className="text-lg font-semibold">Kalam AI</h3>
              </div>
              <p className="text-sm text-green-100">
                Purpose-built for professionals
              </p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-gray-100">
            {features.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 hover:bg-gray-50 transition-colors"
              >
                {/* Feature Name */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {item.feature}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                {/* Generic Apps Column */}
                <div className="p-6 text-center border-l border-gray-100 flex items-center justify-center">
                  {item.generic ? (
                    <div className="flex items-center text-orange-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Basic</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <X className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Not Available</span>
                    </div>
                  )}
                </div>

                {/* Kalam AI Column */}
                <div className="p-6 text-center border-l border-gray-100 bg-green-50 flex items-center justify-center">
                  {item.kalam ? (
                    <div className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-semibold">Advanced</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <X className="w-5 h-5 mr-2" />
                      <span className="text-sm">N/A</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of professionals who switched from generic apps to
              culturally-aware, professional English learning designed
              specifically for their needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="md"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                onClick={() =>
                  document
                    .getElementById("user-selection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start Free Trial →
              </Button>
              <div className="flex items-center text-green-100 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <span>500+ professionals trust Kalam AI</span>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">{"★".repeat(5)}</div>
              <span>4.9/5 average rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
