"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BookOpen,
  Clock,
  EyeOff,
  CheckCircle,
  Users,
  Play,
  Pause,
  Volume2,
  MessageCircle,
  Star,
} from "lucide-react";

export const CulturalContext = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCorrection, setShowCorrection] = useState(false);

  // Interactive scenario data
  const scenarios = [
    {
      title: "Welcoming Tourist Family",
      context: "A confused family approaches the mosque entrance",
      steps: [
        {
          speaker: "Tourist",
          message: "Excuse me, is this mosque open for visitors?",
          audio: true,
        },
        {
          speaker: "You",
          message:
            "Assalamu alaikum! Welcome to our mosque. Yes, we welcome visitors.",
          correction:
            "Perfect use of Islamic greeting followed by warm welcome",
          cultural: "Starting with 'Assalamu alaikum' shows cultural respect",
        },
        {
          speaker: "Tourist",
          message: "Can we go inside now?",
          audio: true,
        },
        {
          speaker: "You",
          message:
            "Please remove your shoes here. Prayer time is in 15 minutes, so we have time for a short visit.",
          correction: "Excellent - you mentioned both etiquette and timing",
          cultural: "Respectfully explaining etiquette while being helpful",
        },
      ],
    },
    {
      title: "Prayer Time Approach",
      context: "Visitors are inside when prayer time approaches",
      steps: [
        {
          speaker: "You",
          message: "Excuse me, friends. Prayer time begins in 5 minutes.",
          cultural:
            "Polite advance notice shows respect for both worship and visitors",
        },
        {
          speaker: "Tourist",
          message: "Should we leave immediately?",
          audio: true,
        },
        {
          speaker: "You",
          message:
            "You may stay quietly in this area, or return after prayers in 20 minutes. Both are welcome.",
          correction: "Perfect balance of accommodation and boundaries",
          cultural:
            "Offering options shows hospitality while maintaining prayer sanctity",
        },
      ],
    },
    {
      title: "Cultural Questions",
      context: "Visitors asking about Islamic practices",
      steps: [
        {
          speaker: "Tourist",
          message: "Why do you pray 5 times a day?",
          audio: true,
        },
        {
          speaker: "You",
          message:
            "It's our way of staying connected with Allah throughout the day, like checking in with a beloved friend.",
          correction: "Beautiful simple explanation without being preachy",
          cultural:
            "Using relatable metaphors helps cross-cultural understanding",
        },
        {
          speaker: "Tourist",
          message: "That's beautiful. Thank you for explaining.",
          audio: true,
        },
      ],
    },
  ];

  const culturalPrinciples = [
    {
      icon: Users,
      title: "Adab in Action",
      description: "Practice respectful Islamic manners naturally",
      color: "emerald",
    },
    {
      icon: Clock,
      title: "Prayer-First Design",
      description: "Technology that respects your worship schedule",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "Wise Communication",
      description: "Learn to explain faith with wisdom and grace",
      color: "purple",
    },
    {
      icon: Shield,
      title: "Dignity Preserved",
      description: "Scenarios maintain Islamic values and modesty",
      color: "amber",
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
      }, 2500);
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
    setShowCorrection(false);
  };

  return (
    <section
      id="cultural-context"
      className="py-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden"
    >
      {/* Background pattern */}
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
            ✨ Cultural Intelligence in Action
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            See Culture-Aware Learning
            <span className="text-emerald-600 block">Come to Life</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how KalamAI teaches more than words—it teaches the
            cultural wisdom that makes real connections possible.
          </p>
        </motion.div>

        {/* Interactive Scenario Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Scenario Selector */}
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6">
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
                          ? "bg-white text-emerald-700 shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {scenario.title}
                    </button>
                  ))}
                </div>
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">
                    {scenarios[activeScenario].title}
                  </h3>
                  <p className="text-emerald-100">
                    {scenarios[activeScenario].context}
                  </p>
                </div>
              </div>

              {/* Conversation Display */}
              <div className="p-8">
                <div className="space-y-4 mb-6 min-h-[300px]">
                  {scenarios[activeScenario].steps
                    .slice(0, currentStep + 1)
                    .map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          opacity: 0,
                          x: step.speaker === "You" ? 20 : -20,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`flex ${
                          step.speaker === "You"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-md px-6 py-4 rounded-2xl ${
                            step.speaker === "You"
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                step.speaker === "You"
                                  ? "bg-emerald-200"
                                  : "bg-gray-400"
                              }`}
                            />
                            <span className="text-sm font-medium opacity-75">
                              {step.speaker}
                            </span>
                            {step.audio && (
                              <Volume2 className="w-4 h-4 opacity-75" />
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">
                            {step.message}
                          </p>

                          {/* Cultural insight */}
                          {step.cultural && index === currentStep && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: 1 }}
                              className="mt-3 pt-3 border-t border-emerald-300/30"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="w-3 h-3 text-emerald-200" />
                                <span className="text-xs font-medium text-emerald-200">
                                  Cultural Insight
                                </span>
                              </div>
                              <p className="text-xs text-emerald-100 leading-relaxed">
                                {step.cultural}
                              </p>
                            </motion.div>
                          )}
                        </div>
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
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Scenario
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
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
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

        {/* Cultural Principles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {culturalPrinciples.map((principle, index) => (
            <motion.div
              key={principle.title}
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
                      principle.color === "emerald"
                        ? "bg-emerald-100 group-hover:bg-emerald-200"
                        : principle.color === "blue"
                        ? "bg-blue-100 group-hover:bg-blue-200"
                        : principle.color === "purple"
                        ? "bg-purple-100 group-hover:bg-purple-200"
                        : "bg-amber-100 group-hover:bg-amber-200"
                    }`}
                  >
                    <principle.icon
                      className={`w-7 h-7 ${
                        principle.color === "emerald"
                          ? "text-emerald-600"
                          : principle.color === "blue"
                          ? "text-blue-600"
                          : principle.color === "purple"
                          ? "text-purple-600"
                          : "text-amber-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 border-0 shadow-2xl max-w-3xl mx-auto">
            <CardContent className="p-8 text-center text-white">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
              <h3 className="text-2xl font-bold mb-4">
                Experience Culture-Aware Learning
              </h3>
              <p className="text-emerald-100 text-lg mb-6 max-w-2xl mx-auto">
                This is just one scenario. KalamAI offers hundreds of
                culturally-intelligent conversations designed specifically for
                Arabic speakers.
              </p>
              <Button
                onClick={() =>
                  document
                    .getElementById("user-selection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-white border-2 border-green-600 !text-green-600 hover:bg-green-50 hover:border-green-700 hover:!text-green-700"
              >
                Start Learning with Cultural Context
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
