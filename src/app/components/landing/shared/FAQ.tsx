"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeAudience, setActiveAudience] = useState<
    "all" | "learners" | "creators" | "platforms"
  >("all");

  const faqs = [
    // LEARNER QUESTIONS
    {
      audience: "learners",
      question:
        "How does VerifyLearn catch problems that student reviews miss?",
      answer:
        "Student reviews measure satisfaction ('I liked this course'), but can't evaluate technical accuracy, plagiarism, or instructor credentials. Our expert reviewers check for copied content, outdated information, fake certifications, and pedagogical quality—things beginners can't spot. For example, a Python course with 4.8 stars might teach deprecated code that no longer works, but only an expert would catch it.",
    },
    {
      audience: "learners",
      question: "Why should I trust VerifyLearn scores over regular reviews?",
      answer:
        "We're completely independent—instructors don't pay us for scores, and we have no financial incentive to inflate ratings. Our reviewers are vetted experts with 5+ years experience in each subject area. We publish our methodology publicly and provide detailed breakdowns of every score. If a course scores 65/100, we explain exactly why, unlike vague star ratings.",
    },
    {
      audience: "learners",
      question: "Do verified courses actually help me learn faster?",
      answer:
        "Yes. Our data shows verified courses (80+ VerifyScore) have 45% higher completion rates and 60% fewer refund requests compared to unverified courses. This is because verified courses have accurate content, clear teaching, and proper structure—you're not wasting time on plagiarized or outdated material that doesn't work.",
    },

    // CREATOR QUESTIONS
    {
      audience: "creators",
      question: "What if my course gets a low VerifyScore—can I fix it?",
      answer:
        "Absolutely! When you receive your VerifyScore report, we provide specific feedback on what needs improvement (e.g., 'Module 3 contains outdated React syntax' or 'Missing accessibility in code examples'). Update your course, then request a free re-verification. Most creators improve their scores 15-25 points after addressing our feedback.",
    },
    {
      audience: "creators",
      question: "How does verification increase my course sales?",
      answer:
        "Verified courses see an average 28% conversion rate increase because the VerifyLearn badge removes buyer hesitation. When learners see 'VerifyScore 92/100' from an independent expert, they trust it more than just star ratings. You can also charge 20-30% premium prices—buyers pay more for certified quality, just like they do for certified pre-owned cars.",
    },
    {
      audience: "creators",
      question: "What happens during the verification process?",
      answer:
        "Our expert reviewers (PhDs or 10+ year professionals in your subject) watch your entire course, check all materials for plagiarism, verify your credentials, assess teaching quality, and test any code/exercises. The process takes 5-7 days. You'll receive a detailed 500-word report with your VerifyScore (0-100) and specific feedback. You can then display your badge in marketing materials.",
    },
    {
      audience: "creators",
      question: "Is verification worth £299-499 for a new course creator?",
      answer:
        "If your course earns under £5,000/year, probably not yet—focus on getting your first sales. But if you're earning £10K+/year or launching a premium course (£200+), verification pays for itself quickly. A 25% conversion increase on £20K revenue = £5K additional income, which is a 10-20x ROI on the £299-499 investment.",
    },

    // PLATFORM QUESTIONS
    {
      audience: "platforms",
      question:
        "Why would our platform pay for third-party verification instead of building it internally?",
      answer:
        "Building internal verification looks biased to learners ('Of course they say their courses are good—they profit from sales'). Independent third-party verification is a liability shield and trust signal. Plus, building in-house costs £500K-1M annually (reviewers, legal, compliance, tech)—partnering with VerifyLearn costs £60K-500K and launches in 30 days, not 12 months.",
    },
    {
      audience: "platforms",
      question: "How does VerifyLearn help us close enterprise B2B deals?",
      answer:
        "Fortune 500 L&D buyers require quality assurance before purchasing. When you pitch 'All courses are VerifyLearn certified with independent audits,' it satisfies their procurement requirements. Our clients report 40% faster enterprise sales cycles and 25% higher contract values because verified quality removes the biggest objection corporate buyers have.",
    },
    {
      audience: "platforms",
      question: "What's the ROI for platforms integrating VerifyLearn?",
      answer:
        "Verified courses reduce refund rates by 45% (saving platforms millions in chargeback fees). They also increase course completion rates by 30%, which improves platform reputation and retention. If VerifyLearn saves you £5M annually in refunds and costs £500K, that's a 10x ROI—not counting the enterprise revenue you unlock.",
    },
    {
      audience: "platforms",
      question: "How does the integration work with our existing platform?",
      answer:
        "We provide a REST API that integrates with your course catalog in 2-4 weeks. Creators submit courses for verification through your platform, we verify them within 48-72 hours, and the VerifyScore badge appears automatically on verified course pages. We support SSO, webhook notifications, and custom branding. Our team handles the technical lift—you focus on marketing the verified courses.",
    },

    // UNIVERSAL QUESTIONS
    {
      audience: "all",
      question:
        "How is VerifyLearn different from Quality Matters or other course rating systems?",
      answer:
        "Quality Matters is designed for universities (slow, expensive, focused on institutional compliance). VerifyLearn is built for commercial platforms like Udemy, Teachable, and Coursera—we verify courses in 48-72 hours at accessible price points (£299-499 vs £2,000-5,000). We're the only independent verification service focused on the $341B commercial online learning market.",
    },
    {
      audience: "all",
      question: "What subjects/categories do you verify?",
      answer:
        "We currently verify Technology (Web Dev, Data Science, AI), Business (Marketing, Entrepreneurship), and Creative courses (Design, Photography). We're expanding to Health & Wellness, Language Learning, and Professional Certifications in Q2 2025. We only verify categories where we have expert reviewers with 5+ years proven experience.",
    },
  ];

  const filteredFaqs =
    activeAudience === "all"
      ? faqs
      : faqs.filter(
          (faq) => faq.audience === activeAudience || faq.audience === "all"
        );

  const audienceTabs = [
    { id: "all", label: "All Questions", color: "gray" },
    { id: "learners", label: "For Learners", color: "green" },
    { id: "creators", label: "For Creators", color: "orange" },
    { id: "platforms", label: "For Platforms", color: "blue" },
  ];

  return (
    <section
      id="faq"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about independent course verification
          </p>
        </motion.div>

        {/* Audience Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {audienceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAudience(tab.id as typeof activeAudience)}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                activeAudience === tab.id
                  ? tab.color === "gray"
                    ? "bg-gray-900 text-white shadow-lg"
                    : tab.color === "green"
                    ? "bg-green-500 text-white shadow-lg"
                    : tab.color === "orange"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={`${faq.audience}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all hover:shadow-md bg-white">
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-6 focus:outline-none"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? -1 : index)
                    }
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                        </div>
                        {activeAudience === "all" && (
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              faq.audience === "learners"
                                ? "bg-green-100 text-green-700"
                                : faq.audience === "creators"
                                ? "bg-orange-100 text-orange-700"
                                : faq.audience === "platforms"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {faq.audience === "learners"
                              ? "For Learners"
                              : faq.audience === "creators"
                              ? "For Creators"
                              : faq.audience === "platforms"
                              ? "For Platforms"
                              : "Everyone"}
                          </Badge>
                        )}
                      </div>
                      <div
                        className={`transform transition-transform flex-shrink-0 ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/request-demo"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-900 hover:border-gray-400 transition-all bg-white"
            >
              Contact Support
            </a>
            <a
              href="/methodology"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md"
            >
              View Our Methodology
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
