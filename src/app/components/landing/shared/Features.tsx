"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SearchCheck,
  Shield,
  BarChart3,
  FileText,
  Award,
  Users,
  Zap,
  Eye,
  TrendingUp,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: SearchCheck,
      title: "Expert Course Review",
      description:
        "PhDs and 10+ year professionals thoroughly evaluate every aspect of your course—content accuracy, teaching quality, and learning outcomes",
    },
    {
      icon: Shield,
      title: "Plagiarism Detection",
      description:
        "Advanced AI screening catches copied content, fake credentials, and misrepresented expertise that student reviews miss",
    },
    {
      icon: FileText,
      title: "Detailed VerifyScore Report",
      description:
        "Comprehensive 500-word analysis with your 0-100 VerifyScore, specific improvement recommendations, and quality benchmarks",
    },
    {
      icon: Award,
      title: "Verified Course Badge",
      description:
        "Display the trusted VerifyLearn badge on your course landing page to boost conversions by 25-40% with independent credibility",
    },
    {
      icon: TrendingUp,
      title: "Conversion Optimization",
      description:
        "Verified courses see 28% higher conversion rates—buyers trust independent quality ratings more than star reviews alone",
    },
    {
      icon: Eye,
      title: "Quality Transparency",
      description:
        "Public rubric shows exactly how courses are scored: content quality, instructor credentials, pedagogy, and production value",
    },
    {
      icon: Users,
      title: "B2B Market Access",
      description:
        "Enterprise L&D teams require verified courses for corporate training—unlock Fortune 500 clients with certification",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description:
        "Standard verification in 48-72 hours, Priority in 24-48 hours. Plus one free re-verification after you make improvements",
    },
    {
      icon: BarChart3,
      title: "Creator Analytics",
      description:
        "Track how verification impacts your sales, compare your VerifyScore to category averages, and monitor student feedback trends",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium mb-4">
            Independent Course Verification
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Catch What Student Reviews Miss
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert-verified quality ratings that protect learners from bad
            courses and help creators stand out with proven credibility
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-gray-100 hover:border-blue-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 group-hover:scale-110 transition-all">
                    <feature.icon className="h-6 w-6 text-blue-600" />
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
