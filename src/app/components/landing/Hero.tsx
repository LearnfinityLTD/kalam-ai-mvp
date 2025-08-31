"use client";
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Globe, Mic, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Bridge Languages,
              <span className="text-green-600"> Build Connections</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              AI-powered English learning designed for Arabs. Master
              conversation skills through real-world scenarios with cultural
              understanding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                onClick={() =>
                  document.getElementById("user-selection")?.scrollIntoView()
                }
              >
                Start Learning Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-500" />3 Arabic
                Dialects
              </div>
              <div className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-green-500" />
                Voice Recognition
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Practice Session</h3>
                  <p className="text-sm text-gray-500">
                    Welcome Tourist Scenario
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Situation:</p>
                  <p className="font-medium">
                    &quot;A confused family approaches the mosque entrance&quot;
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 mb-2">Your Response:</p>
                  <p className="font-medium">
                    &quot;Welcome to our mosque. Please come in!&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <Badge variant="default">Excellent pronunciation!</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
