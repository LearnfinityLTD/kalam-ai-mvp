"use client";
import { motion } from "framer-motion";
import { Button } from "@/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Globe, Building2 } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>

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
              <Badge className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-6 py-3 text-sm font-medium mb-4">
                Enterprise Cultural Intelligence Platform
              </Badge>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Eliminate $80B in
              <span className="text-emerald-400 block">
                Communication Costs
              </span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              AI-powered cross-cultural communication platform that prevents
              costly miscommunication, accelerates knowledge transfer, and
              ensures compliance with nationalization mandates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                onClick={() =>
                  document
                    .getElementById("demo-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Schedule Enterprise Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white px-8 py-4 text-lg hover:bg-white/10"
              >
                View ROI Calculator
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-blue-200">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-400" />
                GCC Compliance Ready
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-emerald-400" />
                Multi-Cultural AI
              </div>
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-emerald-400" />
                Enterprise Grade
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-500 rounded-full animate-pulse"></div>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    Real-Time Risk Assessment
                  </h3>
                  <p className="text-sm text-blue-200">
                    Cross-Cultural Communication Analysis
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-500/20 p-4 rounded-lg border border-red-400/30">
                  <p className="text-sm text-red-200 mb-2 font-medium">
                    High Risk Communication Detected:
                  </p>
                  <p className="font-medium text-white text-sm">
                    &quot;We need this done immediately without delay&quot;
                  </p>
                  <p className="text-xs text-red-300 mt-2">
                    Risk: Direct command style inappropriate for hierarchical
                    culture
                  </p>
                </div>

                <div className="bg-emerald-500/20 p-4 rounded-lg border border-emerald-400/30">
                  <p className="text-sm text-emerald-200 mb-2 font-medium">
                    AI Recommendation:
                  </p>
                  <p className="font-medium text-white text-sm">
                    &quot;When convenient, we would be honored if you could
                    prioritize this request&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-3xl font-bold text-emerald-400">
                    Risk Reduced: 87%
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 px-3 py-1 border border-emerald-400/30">
                    Compliance Achieved
                  </Badge>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 top-10 -left-10 w-20 h-20 bg-emerald-400/20 rounded-full animate-bounce"></div>
            <div className="absolute -z-10 bottom-10 -right-10 w-16 h-16 bg-blue-400/20 rounded-full animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
