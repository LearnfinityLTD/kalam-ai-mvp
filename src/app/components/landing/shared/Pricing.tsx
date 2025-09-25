"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export const Pricing = () => {
  const router = useRouter();

  const plans = [
    {
      name: "Compliance Pilot",
      price: "$50,000",
      period: "/6 months",
      description: "Proof of concept for single department or region",
      minUsers: "100 users included",
      features: [
        "Cultural risk assessment dashboard",
        "Basic audit trail generation",
        "Email and chat support",
        "Standard integrations",
        "Regional data residency",
        "Basic analytics and reporting",
        "30-day implementation",
        "Success metrics tracking",
      ],
      savings: "Typical ROI: 200% in pilot period",
      cta: "Start Pilot Program",
      popular: false,
      highlight: "Risk-Free Pilot",
    },
    {
      name: "Enterprise Standard",
      price: "$200,000",
      period: "/year",
      description: "Full-scale deployment for multinational organizations",
      minUsers: "500+ users",
      features: [
        "Everything in Compliance Pilot",
        "Advanced cultural intelligence AI",
        "Comprehensive compliance automation",
        "Custom integration development",
        "Dedicated customer success manager",
        "24/7 priority support",
        "Executive reporting dashboards",
        "Knowledge transfer optimization",
        "Multi-region deployment",
        "Quarterly business reviews",
      ],
      savings: "Average ROI: 340% in first year",
      cta: "Schedule Enterprise Demo",
      popular: true,
      highlight: "Most Popular",
      badge: "75% of clients choose this tier",
    },
    {
      name: "Global Enterprise",
      price: "Custom",
      period: "",
      description:
        "White-glove service for Fortune 500 and government agencies",
      minUsers: "1000+ users",
      features: [
        "Everything in Enterprise Standard",
        "White-label deployment options",
        "Custom AI model training",
        "On-site implementation team",
        "Regulatory compliance certification",
        "Advanced API and integrations",
        "Custom reporting and analytics",
        "Multi-language admin interface",
        "Dedicated infrastructure",
        "Government security clearances",
        "Global deployment coordination",
        "Executive advisory services",
      ],
      savings: "Typical enterprise savings: $10-50M annually",
      cta: "Contact Sales",
      popular: false,
      highlight: "Maximum Scale",
    },
  ];

  const handleDemo = () => {
    router.push("/demo-request");
  };

  return (
    <section id="pricing" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-6 py-3 text-lg font-semibold mb-6">
            Enterprise Pricing for Measurable ROI
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pricing That Scales With Your Risk Reduction
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8">
            Unlike generic training platforms, Kalam AI delivers measurable ROI
            through prevented cultural incidents, compliance automation, and
            accelerated knowledge transfer.
          </p>

          <div className="bg-emerald-600/20 border border-emerald-400/30 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-white">
                  Risk Assessment Included
                </h3>
                <p className="text-emerald-200">
                  Comprehensive cultural risk audit • Implementation roadmap
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">Free</div>
                <div className="text-sm text-emerald-300">
                  With pilot program
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 text-sm font-bold shadow-lg">
                    {plan.highlight}
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular
                    ? "border-2 border-emerald-400 shadow-xl bg-gradient-to-b from-white to-emerald-50"
                    : "border border-slate-300 bg-white"
                }`}
              >
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4 min-h-[48px]">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      {plan.price !== "Custom" ? (
                        <div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-4xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <div className="text-left">
                              <div className="text-gray-600 text-sm">
                                {plan.period}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-emerald-700 font-semibold">
                            {plan.minUsers}
                          </div>
                          <div className="text-xs text-blue-700 mt-2">
                            {plan.savings}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-4xl font-bold text-gray-900">
                            Custom
                          </span>
                          <div className="text-sm text-gray-600 mt-2">
                            Based on organization size and requirements
                          </div>
                          <div className="text-xs text-blue-700 mt-2">
                            {plan.savings}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={handleDemo}
                    className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-105"
                        : plan.name === "Global Enterprise"
                        ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-black shadow-lg"
                        : "bg-black border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  {/* Additional Info */}
                  {plan.badge && (
                    <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                      {plan.badge}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ROI Calculator Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 max-w-4xl mx-auto mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Enterprise ROI Metrics
          </h3>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="text-3xl font-bold text-emerald-700 mb-2">
                $2.5M
              </div>
              <div className="text-sm text-emerald-800 font-medium">
                Average Annual Savings
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Per 1000-employee organization
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-700 mb-2">
                18 days
              </div>
              <div className="text-sm text-blue-800 font-medium">
                Faster Implementation
              </div>
              <div className="text-xs text-gray-600 mt-2">
                vs traditional consulting
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-3xl font-bold text-purple-700 mb-2">99%</div>
              <div className="text-sm text-purple-800 font-medium">
                Compliance Success Rate
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Government audit success
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enterprise Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-emerald-600 text-white rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-4">
            Enterprise Success Guarantee
          </h3>
          <p className="text-emerald-100 text-lg mb-6 max-w-2xl mx-auto">
            Not achieving measurable risk reduction within 90 days? We&apos;ll
            refund your investment and provide a comprehensive cultural risk
            assessment at no cost.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleDemo}
              className="bg-black border-2 border-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 px-8 py-3 text-lg font-semibold"
            >
              Schedule Enterprise Demo
            </Button>

            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 text-lg font-semibold"
              onClick={() => router.push("/roi-calculator")}
            >
              Calculate Your ROI
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
