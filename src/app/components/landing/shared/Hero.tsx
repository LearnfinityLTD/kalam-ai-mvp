"use client";
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Mic, Users } from "lucide-react";

// Hero Component
export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
                🚀 Now serving 15+ countries with 500+ active learners
              </Badge>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Bridge Languages,
              <span className="text-green-600 block"> Build Connections</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              AI-powered English learning designed specifically for Arabic
              speakers. Master professional conversations through
              culturally-aware scenarios with prayer-respectful timing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                onClick={() =>
                  document
                    .getElementById("user-selection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start Learning Free →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg hover:bg-gray-50"
              >
                Watch 2-min Demo 🎥
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-500" />4 Arabic
                Dialects
              </div>
              <div className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-green-500" />
                AI Voice Recognition
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Cultural Context
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Live Practice Session
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tourist Welcome Scenario
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Situation:
                  </p>
                  <p className="font-medium">
                    &quot;A confused family approaches the mosque entrance
                    looking for prayer times&quot;
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm text-green-700 mb-2 font-medium">
                    Your Response:
                  </p>
                  <p className="font-medium">
                    &quot;Welcome to our mosque. Prayer time is in 20 minutes.
                    Please come in!&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    Excellent pronunciation! 🎉
                  </Badge>
                </div>
              </div>
            </div>

            {/* Floating elements for visual appeal */}
            <div className="absolute -z-10 top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -z-10 bottom-10 -right-10 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
