"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/ui/button";
import { useRouter } from "next/navigation";

export const Pricing = () => {
  const router = useRouter();
  const handleDemo = () => {
    router.replace("/demo");
  };
  const plans = [
    {
      name: "Mosque Starter",
      price: "$15",
      period: "/month per guard",
      originalPrice: "$25",
      description: "Perfect for smaller mosques with 2-10 guards",
      minUsers: "2 guards minimum",
      features: [
        "Tourist interaction scenarios",
        "Prayer-respectful scheduling",
        "Cultural context training",
        "Basic progress tracking",
        "Mobile & web access",
        "Standard AI voice recognition",
        "Email support",
        "Team dashboard (basic)",
      ],
      savings: "Save $120/year vs competitors",
      cta: "Start 30-Day Free Trial",
      popular: false,
      highlight: "Most Popular for Small Mosques",
    },
    {
      name: "Professional Team",
      price: "$35",
      period: "/month per person",
      originalPrice: "$50",
      description:
        "Ideal for mosques, tour companies & businesses with 5-50 people",
      minUsers: "5 users minimum",
      features: [
        "Everything in Mosque Starter",
        "Advanced scenario library (500+ situations)",
        "Custom content creation tools",
        "Advanced AI pronunciation coaching",
        "Team performance analytics",
        "Custom branding options",
        "Priority chat & email support",
        "Manager reporting dashboard",
        "Bulk user management",
        "Integration with HR systems",
      ],
      savings: "Save $180/year per user",
      cta: "Start 30-Day Free Trial",
      popular: true,
      highlight: "Best Value",
      badge: "87% of customers choose this",
    },
    {
      name: "Enterprise Scale",
      price: "Custom",
      period: "",
      description:
        "For large organizations, government agencies & international chains",
      minUsers: "50+ users",
      features: [
        "Everything in Professional Team",
        "Unlimited custom scenarios",
        "White-label solution available",
        "Advanced analytics & reporting",
        "Dedicated customer success manager",
        "On-site training & setup",
        "24/7 phone support",
        "Single Sign-On (SSO)",
        "API access & integrations",
        "Compliance & security certifications",
        "Multi-language admin interface",
        "Custom deployment options",
      ],
      savings: "Typical savings: 40-60% vs building in-house",
      cta: "Schedule Demo",
      popular: false,
      highlight: "White-glove Service",
    },
  ];

  const testimonials = [
    {
      text: "ROI was 340% in the first year. Our guards are now confident welcoming international visitors.",
      author: "Ahmed Al-Rahman",
      title: "Facilities Manager",
      company: "Grand Mosque of Kuwait",
    },
    {
      text: "Reduced training time from 6 months to 2 months. Our tour guides are booking 60% more international tours.",
      author: "Fatima Hassan",
      title: "Operations Director",
      company: "Cairo Heritage Tours",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-green-100 text-green-800 px-6 py-3 text-lg font-semibold mb-6">
            🚀 Join 500+ Organizations Already Training with KalamAI
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pricing Built for Results, Not Just Features
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Unlike generic language apps, KalamAI delivers measurable ROI
            through culturally-aware training specifically designed for
            Arabic-speaking professionals in tourism and hospitality.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200 max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900">
                  30-Day Free Trial
                </h3>
                <p className="text-gray-600">
                  No credit card required • Full access • Cancel anytime
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">$0</div>
                <div className="text-sm text-gray-500">First month</div>
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
                  <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 text-sm font-bold shadow-lg">
                    ⭐ {plan.highlight}
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular
                    ? "border-3 border-green-400 shadow-xl bg-gradient-to-b from-white to-green-50"
                    : "border-2 border-gray-200 bg-white"
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
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-4xl font-bold text-gray-900">
                              {plan.price}
                            </span>
                            <div className="text-left">
                              <div className="text-gray-600 text-sm">
                                {plan.period}
                              </div>
                              {plan.originalPrice && (
                                <div className="text-red-500 line-through text-sm">
                                  {plan.originalPrice}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-green-600 font-semibold">
                            {plan.minUsers}
                          </div>
                          <div className="text-xs text-blue-600 mt-2">
                            {plan.savings}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-4xl font-bold text-gray-900">
                            Custom
                          </span>
                          <div className="text-sm text-gray-600 mt-2">
                            Volume discounts available
                          </div>
                          <div className="text-xs text-blue-600 mt-2">
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
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
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
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl hover:shadow-2xl transform hover:scale-105"
                        : plan.name === "Enterprise Scale"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                        : "bg-white border-2 border-green-600 !text-green-600 hover:bg-green-50 hover:border-green-700 hover:!text-green-700"
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
            Calculate Your ROI
          </h3>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">340%</div>
              <div className="text-sm text-gray-600">Average ROI in Year 1</div>
              <div className="text-xs text-gray-500 mt-2">
                Based on increased tourist revenue
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">67%</div>
              <div className="text-sm text-gray-600">
                Reduction in Training Time
              </div>
              <div className="text-xs text-gray-500 mt-2">
                6 months → 2 months average
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-3xl font-bold text-amber-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">
                User Satisfaction Rate
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Guards report confidence boost
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white shadow-lg border border-gray-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>

                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.title}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div> */}

        {/* Money-Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-green-600 text-white rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-4">
            90-Day Money-Back Guarantee
          </h3>
          <p className="text-green-100 text-lg mb-6 max-w-2xl mx-auto">
            Not seeing improved guest interactions within 90 days? We&apos;ll
            refund every penny. That&apos;s how confident we are in
            KalamAI&apos;s results for Arabic-speaking professionals.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button className="bg-white border-2 border-green-600 !text-green-600 hover:bg-green-50 hover:!text-green-700">
              Start Free Trial Today
            </Button>

            <Button
              onClick={handleDemo}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg font-semibold"
            >
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
