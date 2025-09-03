"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How is KalamAI different from other English learning apps?",
      answer:
        "KalamAI is specifically designed for Arabic speakers with deep cultural understanding. Unlike generic apps, we provide culturally-aware scenarios, support multiple Arabic dialects, include prayer-respectful timing, and focus on real-world situations you'll actually encounter.",
    },
    {
      question: "Does KalamAI really pause during prayer times?",
      answer:
        "Yes! KalamAI automatically detects prayer times based on your location and Islamic calendar, pausing lessons respectfully. This shows our commitment to technology that aligns with your values and daily worship schedule.",
    },
    {
      question: "Which Arabic dialects are supported?",
      answer:
        "We currently support Gulf Arabic, Egyptian Arabic, Levantine Arabic, and Modern Standard Arabic. Our AI recognizes dialect-specific pronunciations and provides appropriate feedback for each variation.",
    },
    {
      question: "Can mosque administrators track their team's progress?",
      answer:
        "Absolutely! Our team management features allow mosque administrators and business managers to monitor learning progress, engagement metrics, and improvement areas across their entire team while respecting individual privacy.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. Experience the difference of culturally-aware English learning before committing.",
    },
    {
      question: "How does the AI voice recognition work for Arabic speakers?",
      answer:
        "Our AI is trained specifically on Arabic-accented English, understanding common pronunciation challenges faced by Arabic speakers. It provides targeted feedback and corrections that generic voice recognition systems miss.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about KalamAI
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
              <Card className="border-2 border-gray-200 hover:border-green-300 transition-colors">
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
                          className="w-6 h-6 text-green-600"
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
