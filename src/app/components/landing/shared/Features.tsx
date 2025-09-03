"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export const Features = () => {
  const features = [
    {
      icon: Mic,
      title: "AI Voice Recognition",
      description:
        "Advanced pronunciation analysis with Arabic-specific phonetic feedback and real-time corrections",
    },
    {
      icon: Brain,
      title: "Cultural Intelligence",
      description:
        "Learn not just words, but cultural context, appropriate responses, and social etiquette",
    },
    {
      icon: Globe,
      title: "Multi-Dialect Support",
      description:
        "Supports Gulf, Egyptian, Levantine, and Modern Standard Arabic speakers with localized content",
    },
    {
      icon: MessageSquare,
      title: "Real-World Scenarios",
      description:
        "Practice conversations you'll actually have - mosque visits, business meetings, social interactions",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description:
        "Detailed insights show improvement areas, track fluency growth, and celebrate achievements",
    },
    {
      icon: Clock,
      title: "Prayer-Respectful Timing",
      description:
        "Automatically pauses during prayer times - technology that understands and respects your values",
    },
    {
      icon: Users,
      title: "Team Management",
      description:
        "Mosque and company administrators can track team learning progress and engagement metrics",
    },
    {
      icon: Award,
      title: "Gamified Learning",
      description:
        "Streaks, badges, leaderboards, and achievements make consistent learning engaging and rewarding",
    },
    {
      icon: Headphones,
      title: "Native Speaker Audio",
      description:
        "High-quality audio examples with multiple accent variations for comprehensive listening practice",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium mb-4">
            ✨ Powered by Advanced AI
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why KalamAI Works Better
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built specifically for Arabic speakers with deep understanding of
            cultural and linguistic challenges that generic apps miss
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
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-gray-100 hover:border-green-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 group-hover:scale-110 transition-all">
                    <feature.icon className="h-6 w-6 text-green-600" />
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
