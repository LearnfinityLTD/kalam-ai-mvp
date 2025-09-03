"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/button";

export const Pricing = () => {
  const plans = [
    {
      name: "Personal",
      price: "$9",
      period: "/month",
      description: "Perfect for individual learners",
      features: [
        "Unlimited practice sessions",
        "AI voice recognition",
        "Cultural context lessons",
        "Prayer-respectful timing",
        "Progress tracking",
        "Mobile & web access",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Team",
      price: "$19",
      period: "/month per user",
      description: "Best for mosques and small businesses",
      features: [
        "Everything in Personal",
        "Team management dashboard",
        "Progress analytics",
        "Custom scenarios",
        "Priority support",
        "Bulk user management",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Team",
        "Custom integrations",
        "Dedicated success manager",
        "On-site training",
        "Advanced analytics",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start with a free trial. No setup fees, no hidden costs, cancel
            anytime.
          </p>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            🎉 14-day free trial on all plans
          </Badge>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-green-600 text-white px-4 py-2 font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-2 border-green-400 shadow-lg"
                    : "border border-gray-200"
                }`}
              >
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-black mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <svg
                            className="w-3 h-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 text-lg font-semibold ${
                      plan.popular
                        ? "bg-green-600 hover:bg-green-700 !text-white shadow-lg"
                        : "bg-white border-2 border-green-600 !text-green-600 hover:bg-green-50 hover:!text-green-700"
                    }`}
                  >
                    {plan.cta}
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
