"use client";
import React from "react";
import { Check, X, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompetitorComparison() {
  const features = [
    {
      feature: "Cultural Risk Assessment",
      generic: false,
      kalam: true,
      description:
        "Real-time analysis of cultural appropriateness and miscommunication risk",
    },
    {
      feature: "Compliance Audit Trail",
      generic: false,
      kalam: true,
      description: "Automated documentation for regulatory compliance",
    },
    {
      feature: "Knowledge Transfer Scoring",
      generic: false,
      kalam: true,
      description: "90%+ clarity scores for audit requirements",
    },
    {
      feature: "Multi-Cultural AI Engine",
      generic: false,
      kalam: true,
      description:
        "Specialized algorithms for Arabic-English, Chinese-English cultural patterns",
    },
    {
      feature: "Enterprise Security",
      generic: false,
      kalam: true,
      description: "SOC 2, GDPR, regional data residency compliance",
    },
    {
      feature: "ROI Measurement",
      generic: false,
      kalam: true,
      description: "Quantify prevented losses and compliance savings",
    },
    {
      feature: "API Integration",
      generic: false,
      kalam: true,
      description:
        "Seamless integration with enterprise communication platforms",
    },
    {
      feature: "Generic Language Training",
      generic: true,
      kalam: false,
      description: "Basic language skills without cultural context",
    },
    {
      feature: "One-Size-Fits-All Content",
      generic: true,
      kalam: false,
      description:
        "Same content regardless of cultural context or business needs",
    },
    {
      feature: "Limited Business Context",
      generic: true,
      kalam: false,
      description: "No understanding of enterprise compliance requirements",
    },
    {
      feature: "Real-Time Risk Prevention",
      generic: false,
      kalam: true,
      description: "Prevent costly cultural incidents before they occur",
    },
    {
      feature: "Government Reporting",
      generic: false,
      kalam: true,
      description: "Automated reporting for nationalization compliance",
    },
  ];

  return (
    <div className="py-16 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Enterprises Choose Kalam AI Over Generic Solutions
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Traditional training platforms weren&apos;t built for
            enterprise-scale cultural risk management. Here&apos;s how Kalam AI
            addresses real compliance and business challenges.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-slate-900 text-white">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Capabilities</h3>
            </div>
            <div className="p-6 text-center border-l border-slate-700">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">🏢</span>
                </div>
                <h3 className="text-lg font-semibold">Generic Platforms</h3>
              </div>
              <p className="text-sm text-slate-400">
                Rosetta Stone, Babbel, etc.
              </p>
            </div>
            <div className="p-6 text-center border-l border-slate-700 bg-emerald-600 relative">
              <div className="absolute top-2 right-2">
                <Crown className="w-4 h-4 text-yellow-300" />
              </div>
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-2 text-white font-bold text-xs">
                  كلام
                </div>
                <h3 className="text-lg font-semibold">Kalam AI</h3>
              </div>
              <p className="text-sm text-emerald-100">
                Enterprise Cultural Intelligence
              </p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-slate-700">
            {features.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 hover:bg-slate-700/50 transition-colors"
              >
                {/* Feature Name */}
                <div className="p-6">
                  <h4 className="font-semibold text-white mb-1">
                    {item.feature}
                  </h4>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>

                {/* Generic Apps Column */}
                <div className="p-6 text-center border-l border-slate-700 flex items-center justify-center">
                  {item.generic ? (
                    <div className="flex items-center text-yellow-500">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Basic</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <X className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Not Available</span>
                    </div>
                  )}
                </div>

                {/* Kalam AI Column */}
                <div className="p-6 text-center border-l border-slate-700 bg-emerald-900/20 flex items-center justify-center">
                  {item.kalam ? (
                    <div className="flex items-center text-emerald-400">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="text-sm font-semibold">
                        Enterprise-Grade
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
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready for Enterprise-Grade Cultural Intelligence?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Join Fortune 500 companies who&apos;ve eliminated cultural
              miscommunication risks and achieved regulatory compliance with
              measurable ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                onClick={() =>
                  document
                    .getElementById("demo-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Schedule Enterprise Demo
              </Button>
              <div className="flex items-center text-emerald-100 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                <span>SOC 2 & GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-400">
            <div className="flex items-center">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  F
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  500
                </div>
                <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  G
                </div>
                <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <span>45+ Enterprise clients trust Kalam AI</span>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400 mr-2">{"★".repeat(5)}</div>
              <span>99% compliance audit success rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
