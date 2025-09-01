"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  Brain,
  Globe,
  BarChart3,
  Users,
  Clock,
  Award,
  Headphones,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "AI Voice Recognition",
    description:
      "Advanced pronunciation analysis with Arabic-specific feedback and corrections",
  },
  {
    icon: Brain,
    title: "Cultural Intelligence",
    description:
      "Learn not just words, but cultural context and appropriate responses",
  },
  {
    icon: Globe,
    title: "Dialect-Aware",
    description:
      "Supports Gulf, Egyptian, Levantine, and Modern Standard Arabic speakers",
  },
  {
    icon: MessageSquare,
    title: "Real-World Scenarios",
    description:
      "Practice conversations you'll actually have in your work environment",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Detailed analytics show improvement areas and celebrate achievements",
  },
  {
    icon: Clock,
    title: "Prayer-Respectful",
    description:
      "Automatically pauses during prayer times - technology that understands your values",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Mosque and company admins can track team learning progress",
  },
  {
    icon: Award,
    title: "Gamification",
    description:
      "Streaks, badges, and achievements make learning engaging and fun",
  },
  {
    icon: Headphones,
    title: "Native Speaker Audio",
    description:
      "High-quality audio examples with multiple accent variations for comprehensive learning",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why KalamAI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built specifically for Arabic speakers with deep understanding of
            cultural and linguistic challenges
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
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
}
