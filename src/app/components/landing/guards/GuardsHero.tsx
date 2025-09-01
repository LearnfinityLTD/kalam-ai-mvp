"use client";
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Mic } from "lucide-react";

export default function GuardsHero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Confident Guards,
              <span className="text-green-400"> Clear Communication</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Train with real security scenarios in English. Handle emergencies,
              guide visitors, and communicate with confidence in any situation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                onClick={() =>
                  document.getElementById("user-selection")?.scrollIntoView()
                }
              >
                Start Guard Training
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-500 text-white px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Security Scenarios
              </div>
              <div className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-green-400" />
                Voice Recognition
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-400" />
                Real Team Training
              </div>
            </div>
          </motion.div>

          {/* Right Demo Card Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Guard Training</h3>
                  <p className="text-sm text-gray-400">
                    Checking Visitor ID Scenario
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Situation:</p>
                  <p className="font-medium text-white">
                    &quot;A visitor approaches the gate without showing an
                    ID&quot;
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 mb-2">Your Response:</p>
                  <p className="font-medium text-gray-900">
                    &quot;Excuse me, may I please see your ID before
                    entering?&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-green-400">88%</div>
                  <Badge variant="default">Strong communication</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
