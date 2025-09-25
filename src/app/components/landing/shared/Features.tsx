"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Shield,
  BarChart3,
  Clock,
  FileCheck,
  Globe,
  Users,
  Zap,
  Lock,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Cultural Intelligence Engine",
      description:
        "AI-powered analysis of cultural appropriateness, hierarchy respect, and communication effectiveness across multiple cultures",
    },
    {
      icon: FileCheck,
      title: "Compliance Audit Trail",
      description:
        "Automated documentation generation for regulatory compliance with timestamped cultural interaction logs",
    },
    {
      icon: Shield,
      title: "Risk Assessment Dashboard",
      description:
        "Real-time identification and scoring of cultural miscommunication risks before they become costly incidents",
    },
    {
      icon: Globe,
      title: "Multi-Cultural Support",
      description:
        "Specialized algorithms for Arabic-English, Chinese-English, and other high-risk cultural communication patterns",
    },
    {
      icon: BarChart3,
      title: "Enterprise Analytics",
      description:
        "ROI measurement, knowledge transfer effectiveness, and compliance metrics with executive reporting",
    },
    {
      icon: Clock,
      title: "Real-Time Intervention",
      description:
        "Instant feedback and correction suggestions during live communications to prevent cultural missteps",
    },
    {
      icon: Users,
      title: "Team Knowledge Transfer",
      description:
        "Structured capture and validation of expert knowledge with cultural context for effective handovers",
    },
    {
      icon: Zap,
      title: "API Integration",
      description:
        "Seamless integration with existing enterprise communication platforms, HR systems, and compliance tools",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "SOC 2 Type II, GDPR compliance, regional data residency, and enterprise-grade access controls",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium mb-4">
            Enterprise-Grade Cultural Intelligence
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Prevent $80B in Communication Losses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI platform designed for enterprise-scale cross-cultural
            risk management and compliance automation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-gray-100 hover:border-emerald-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 group-hover:scale-110 transition-all">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
