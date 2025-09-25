"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  FileCheck,
  TrendingUp,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";

export const UserTypeSelection = () => {
  const solutions = [
    {
      icon: Building,
      title: "Compliance & Risk Management",
      description:
        "Ensure regulatory compliance with automated cultural intelligence",
      color: "emerald",
      features: [
        {
          icon: Shield,
          title: "Audit Trail Generation",
          desc: "Complete documentation for regulatory compliance",
        },
        {
          icon: FileCheck,
          title: "Knowledge Transfer Scoring",
          desc: "90%+ clarity scores mandated for compliance",
        },
        {
          icon: TrendingUp,
          title: "Risk Metrics Dashboard",
          desc: "Real-time cultural miscommunication risk assessment",
        },
      ],
      cta: "Schedule Compliance Demo",
      href: "/compliance",
      popular: true,
    },
    {
      icon: Users,
      title: "Nationalization Programs",
      description: "Accelerate knowledge transfer from expats to local talent",
      color: "blue",
      features: [
        {
          icon: Globe,
          title: "Cultural Bridge Training",
          desc: "Bridge communication gaps between cultures",
        },
        {
          icon: TrendingUp,
          title: "Transfer Effectiveness",
          desc: "30% faster local talent proficiency",
        },
        {
          icon: FileCheck,
          title: "Government Reporting",
          desc: "Automated compliance reporting for authorities",
        },
      ],
      cta: "Explore Nationalization Solution",
      href: "/nationalization",
    },
    {
      icon: Globe,
      title: "Global Operations",
      description:
        "Scale cross-cultural communication across international teams",
      color: "purple",
      features: [
        {
          icon: Users,
          title: "Multi-Cultural Teams",
          desc: "Seamless communication across cultures",
        },
        {
          icon: Shield,
          title: "Enterprise Security",
          desc: "SOC 2, GDPR, regional compliance",
        },
        {
          icon: TrendingUp,
          title: "ROI Analytics",
          desc: "Measure impact on productivity and risk",
        },
      ],
      cta: "Request Enterprise Demo",
      href: "/enterprise",
    },
  ];

  return (
    <section id="solutions" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the solution that addresses your organization&apos;s specific
            cross-cultural communication challenges
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {solution.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-emerald-600 text-white px-4 py-2 font-semibold">
                    Most Critical
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  solution.popular
                    ? "border-emerald-400 shadow-lg bg-emerald-50/50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                        solution.color === "emerald"
                          ? "bg-emerald-100"
                          : solution.color === "blue"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                      }`}
                    >
                      <solution.icon
                        className={`h-8 w-8 ${
                          solution.color === "emerald"
                            ? "text-emerald-600"
                            : solution.color === "blue"
                            ? "text-blue-600"
                            : "text-purple-600"
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {solution.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <feature.icon
                          className={`h-5 w-5 mt-0.5 ${
                            solution.color === "emerald"
                              ? "text-emerald-500"
                              : solution.color === "blue"
                              ? "text-blue-500"
                              : "text-purple-500"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full py-4 text-lg font-semibold transition-all ${
                      solution.color === "emerald"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl"
                        : solution.color === "blue"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    } hover:-translate-y-0.5`}
                  >
                    {solution.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
