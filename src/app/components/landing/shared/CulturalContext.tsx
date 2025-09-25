"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  TrendingUp,
  Users,
  Star,
  Brain,
} from "lucide-react";

export const CulturalContext = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Enterprise scenario data
  const scenarios = [
    {
      title: "Executive Communication Risk",
      context: "CEO sending directive to Middle Eastern subsidiary",
      riskLevel: "High",
      steps: [
        {
          type: "original",
          message:
            "I need this project completed immediately. No delays acceptable.",
          risk: 92,
          issues: [
            "Direct command inappropriate for hierarchical culture",
            "No cultural respect markers",
          ],
        },
        {
          type: "analysis",
          message: "Cultural Risk Assessment: HIGH",
          details:
            "Direct commands violate cultural hierarchy expectations in GCC markets",
        },
        {
          type: "corrected",
          message:
            "When it aligns with your schedule, we would be honored if you could prioritize this strategic project.",
          risk: 8,
          improvement: "84% risk reduction through cultural adaptation",
        },
      ],
    },
    {
      title: "Knowledge Transfer Compliance",
      context: "German engineer documenting process for Emirati successor",
      riskLevel: "Medium",
      steps: [
        {
          type: "original",
          message: "Follow these 15 technical steps exactly as written.",
          risk: 67,
          issues: ["No cultural context", "Assumes Western learning style"],
        },
        {
          type: "analysis",
          message:
            "Compliance Score: 34% - Insufficient for audit requirements",
          details:
            "Knowledge transfer lacks cultural bridge and actionability markers",
        },
        {
          type: "corrected",
          message:
            "Respected colleague, these steps honor our engineering traditions while adapting to your expertise.",
          risk: 12,
          improvement: "Compliance score: 91% - Audit ready",
        },
      ],
    },
  ];

  // Auto-play scenario steps
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStep < scenarios[activeScenario].steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, activeScenario]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (
      !isPlaying &&
      currentStep >= scenarios[activeScenario].steps.length - 1
    ) {
      setCurrentStep(0);
    }
  };

  const resetScenario = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const riskMetrics = [
    {
      icon: Brain,
      title: "AI Cultural Intelligence",
      description: "Real-time analysis of cultural appropriateness",
      color: "emerald",
    },
    {
      icon: AlertTriangle,
      title: "Risk Prevention",
      description: "Identify issues before they become incidents",
      color: "amber",
    },
    {
      icon: CheckCircle,
      title: "Compliance Assurance",
      description: "Automated audit trail generation",
      color: "blue",
    },
    {
      icon: TrendingUp,
      title: "ROI Measurement",
      description: "Track prevented losses and efficiency gains",
      color: "purple",
    },
  ];

  return (
    <section
      id="cultural-intelligence"
      className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(16,185,129,0.3)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.3)_0%,_transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <Badge className="bg-emerald-100 text-emerald-800 px-6 py-3 text-base font-medium mb-6 rounded-full">
            Enterprise Cultural Intelligence Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See Risk Prevention
            <span className="text-emerald-600 block">In Real Time</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how Kalam AI transforms high-risk communications into
            culturally-appropriate, compliant interactions that prevent costly
            incidents.
          </p>
        </motion.div>

        {/* Interactive Scenario Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Scenario Selector */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {scenarios.map((scenario, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveScenario(index);
                        resetScenario();
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeScenario === index
                          ? "bg-emerald-600 text-white shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {scenario.title}
                    </button>
                  ))}
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold">
                      {scenarios[activeScenario].title}
                    </h3>
                    <Badge
                      className={`${
                        scenarios[activeScenario].riskLevel === "High"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      } text-white px-3 py-1`}
                    >
                      {scenarios[activeScenario].riskLevel} Risk
                    </Badge>
                  </div>
                  <p className="text-slate-300">
                    {scenarios[activeScenario].context}
                  </p>
                </div>
              </div>

              {/* Communication Analysis Display */}
              <div className="p-8">
                <div className="space-y-6 mb-8 min-h-[400px]">
                  {scenarios[activeScenario].steps
                    .slice(0, currentStep + 1)
                    .map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                      >
                        {step.type === "original" && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <span className="font-semibold text-red-800">
                                Original Communication
                              </span>
                              <Badge className="bg-red-600 text-white">
                                Risk: {step.risk}%
                              </Badge>
                            </div>
                            <p className="text-gray-800 mb-3 font-medium">
                              {step.message}
                            </p>
                            <div className="space-y-1">
                              {step.issues?.map((issue, idx) => (
                                <p
                                  key={idx}
                                  className="text-red-700 text-sm flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                  {issue}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {step.type === "analysis" && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <Brain className="w-5 h-5 text-amber-600" />
                              <span className="font-semibold text-amber-800">
                                AI Analysis
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium mb-2">
                              {step.message}
                            </p>
                            <p className="text-amber-700 text-sm">
                              {step.details}
                            </p>
                          </div>
                        )}

                        {step.type === "corrected" && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="font-semibold text-emerald-800">
                                AI Recommendation
                              </span>
                              <Badge className="bg-emerald-600 text-white">
                                Risk: {step.risk}%
                              </Badge>
                            </div>
                            <p className="text-gray-800 mb-3 font-medium">
                              {step.message}
                            </p>
                            <p className="text-emerald-700 text-sm font-semibold">
                              {step.improvement}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 pt-6 border-t">
                  <Button
                    onClick={handlePlayPause}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Demo
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Demo
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetScenario}
                    variant="outline"
                    className="border-gray-300 px-6 py-3 rounded-full"
                  >
                    Reset
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((currentStep + 1) /
                            scenarios[activeScenario].steps.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Step {currentStep + 1} of{" "}
                    {scenarios[activeScenario].steps.length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {riskMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all group-hover:scale-110 ${
                      metric.color === "emerald"
                        ? "bg-emerald-100 group-hover:bg-emerald-200"
                        : metric.color === "amber"
                        ? "bg-amber-100 group-hover:bg-amber-200"
                        : metric.color === "blue"
                        ? "bg-blue-100 group-hover:bg-blue-200"
                        : "bg-purple-100 group-hover:bg-purple-200"
                    }`}
                  >
                    <metric.icon
                      className={`w-7 h-7 ${
                        metric.color === "emerald"
                          ? "text-emerald-600"
                          : metric.color === "amber"
                          ? "text-amber-600"
                          : metric.color === "blue"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {metric.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
