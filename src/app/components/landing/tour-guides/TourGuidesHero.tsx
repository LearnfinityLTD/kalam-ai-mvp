"use client";
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mic, Users, Globe, Star } from "lucide-react";

export default function TourGuidesHero() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Confident Guides,
              <span className="text-orange-600"> Captivating Stories</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Practice English for real guiding scenarios. Engage international
              tourists, answer questions clearly, and share stories that make
              every tour unforgettable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg"
                onClick={() =>
                  document.getElementById("user-selection")?.scrollIntoView()
                }
              >
                Start Practicing Now
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
                <Globe className="h-5 w-5 mr-2 text-orange-500" />
                Cultural English
              </div>
              <div className="flex items-center">
                <Mic className="h-5 w-5 mr-2 text-orange-500" />
                Voice Practice
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-500" />
                Real Tourist Scenarios
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
            <div className="bg-white rounded-2xl shadow-2xl p-8 border relative overflow-hidden">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Practice Session</h3>
                  <p className="text-sm text-gray-500">
                    Historic Site Introduction
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Tourist asks:</p>
                  <p className="font-medium">
                    &quot;Why is this place so important in history?&quot;
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 mb-2">Your Response:</p>
                  <p className="font-medium text-gray-800">
                    &quot;This site was the heart of the old kingdom, where
                    leaders welcomed travelers from across the world...&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-orange-600">94%</div>
                  <Badge className="bg-orange-600 text-white">
                    Great storytelling
                  </Badge>
                </div>
              </div>
            </div>

            {/* Floating feedback */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 p-3 rounded-full shadow-lg"
            >
              <Star className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
