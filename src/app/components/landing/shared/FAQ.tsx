"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question:
        "How does Kalam AI prevent $80 billion in communication losses?",
      answer:
        "Our AI platform analyzes communications in real-time for cultural appropriateness, hierarchy respect, and clarity. By preventing cultural miscommunication incidents that lead to project delays, compliance violations, and failed business relationships, enterprises save millions annually. Our clients report average ROI of 340% in year one.",
    },
    {
      question: "What compliance requirements does the platform support?",
      answer:
        "Kalam AI generates complete audit trails for GCC nationalization mandates, SOC 2 Type II compliance, GDPR data protection, and regional regulatory requirements. Our automated documentation includes timestamp logs, cultural risk scores, and compliance verification reports required by government auditors.",
    },
    {
      question:
        "How quickly can we see ROI from cultural intelligence training?",
      answer:
        "Most enterprises see measurable results within 30-90 days. Key metrics include: 67% reduction in cross-cultural miscommunication incidents, 30% faster knowledge transfer to local talent, and 85% improvement in regulatory compliance scores. Full ROI typically achieved within 8-12 months.",
    },
    {
      question: "Is the platform secure enough for Fortune 500 enterprises?",
      answer:
        "Yes. Kalam AI maintains SOC 2 Type II certification, supports regional data residency requirements, integrates with enterprise SSO systems, and provides comprehensive audit logging. Our security architecture meets the strictest enterprise and government security standards.",
    },
    {
      question: "How does knowledge transfer scoring work for compliance?",
      answer:
        "Our AI evaluates documentation clarity, cultural context, and actionability on a 0-100 scale. Documents scoring 90%+ meet audit requirements for knowledge transfer mandates. The system flags unclear instructions, missing cultural context, and compliance gaps before regulatory review.",
    },
    {
      question: "Can the platform integrate with existing enterprise systems?",
      answer:
        "Absolutely. Kalam AI provides REST APIs for integration with HR platforms, communication tools, compliance systems, and learning management platforms. We support single sign-on, automated user provisioning, and real-time data synchronization with enterprise workflows.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise Implementation Questions
          </h2>
          <p className="text-xl text-gray-600">
            Common questions from Chief Compliance Officers and VPs of Global
            Operations
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-6 focus:outline-none"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? -1 : index)
                    }
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div
                        className={`transform transition-transform ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
