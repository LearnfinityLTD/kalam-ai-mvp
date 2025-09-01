"use client";
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  Globe,
} from "lucide-react";

export default function ProfessionalsHero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Power Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6 font-bold"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Unlock 30-50% Higher Salaries with English Fluency
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Career Trajectory
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Break through the English barrier that&apos;s limiting your
              professional growth. Master business communication, presentations,
              and negotiations with AI-powered training designed specifically
              for ambitious Arab professionals.
            </p>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Higher Earnings</p>
                  <p className="text-sm text-gray-600">
                    20-50% salary increase
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Leadership Ready</p>
                  <p className="text-sm text-gray-600">C-suite communication</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() =>
                  document.getElementById("user-selection")?.scrollIntoView()
                }
              >
                Start Career Acceleration
                <TrendingUp className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 px-8 py-4 text-lg hover:bg-gray-50"
              >
                See Success Stories
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                Executive Training
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Business Networks
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                Global Opportunities
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Interactive Demo Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border relative overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl opacity-20 animate-pulse"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Executive Presentation
                    </h3>
                    <p className="text-sm text-gray-500">
                      Q4 Board Meeting Scenario
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Your Challenge:
                    </p>
                    <p className="font-medium">
                      &quot;Present quarterly results to international
                      investors&quot;
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-2">AI Coaching:</p>
                    <p className="font-medium text-gray-800">
                      &quot;Good morning, distinguished board members. Our Q4
                      performance exceeded expectations...&quot;
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      96%
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Executive Level!
                    </Badge>
                  </div>

                  {/* Progress indicators */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-green-100 p-2 rounded text-center">
                      <div className="text-xs text-green-600 font-bold">
                        Confidence
                      </div>
                      <div className="text-sm font-bold">95%</div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded text-center">
                      <div className="text-xs text-blue-600 font-bold">
                        Clarity
                      </div>
                      <div className="text-sm font-bold">92%</div>
                    </div>
                    <div className="bg-purple-100 p-2 rounded text-center">
                      <div className="text-xs text-purple-600 font-bold">
                        Impact
                      </div>
                      <div className="text-sm font-bold">98%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating achievement badges */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 p-3 rounded-full shadow-lg"
            >
              <Award className="w-6 h-6" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 p-3 rounded-full shadow-lg"
            >
              <TrendingUp className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
