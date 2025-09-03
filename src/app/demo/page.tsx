/* --- file: app/demo/page.tsx --- */
"use client";

import { useState } from "react";
import NavBar from "@/app/components/landing/shared/NavBar";
import Footer from "@/app/components/shared/Footer";
import {
  Shield,
  MessageSquare,
  Target,
  CheckCircle,
  Users,
  TrendingUp,
  Clock,
  Globe,
  Star,
  ArrowRight,
  Calendar,
  Phone,
} from "lucide-react";
import { FAQ } from "../components/landing/shared/FAQ";

type FormState = {
  name: string;
  email: string;
  company: string;
  siteLocation: string;
  teamSize: string;
  preferredLanguage: string;
  goals: string;
  notes: string;
  // honeypot
  website: string;
};

export default function DemoPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    siteLocation: "",
    teamSize: "",
    preferredLanguage: "",
    goals: "",
    notes: "",
    website: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email.";
    if (!form.company.trim()) next.company = "Company is required.";
    if (!form.teamSize) next.teamSize = "Please select your team size.";
    return next;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);
    if (form.website) return; // honeypot

    setLoading(true);
    try {
      // TODO: send to your API route / api service
      console.log("KalamAI demo request:", form);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: MessageSquare,
      title: "AI-Powered Role-Play",
      description:
        "Realistic guard-visitor conversations in English with Arabic cultural context",
      stat: "500+ scenarios",
    },
    {
      icon: TrendingUp,
      title: "Measurable Results",
      description:
        "Track fluency scores, completion rates, and confidence levels per team member",
      stat: "340% avg ROI",
    },
    {
      icon: Clock,
      title: "Prayer-Respectful",
      description:
        "Training automatically pauses during prayer times - technology that understands your values",
      stat: "5x daily breaks",
    },
    {
      icon: Globe,
      title: "Multi-Dialect Support",
      description:
        "Works with Gulf, Egyptian, Levantine, and Modern Standard Arabic speakers",
      stat: "4 Arabic dialects",
    },
  ];

  const testimonials = [
    {
      quote:
        "Our guards went from nervous to confident with international visitors in just 8 weeks. Tourist satisfaction scores increased 40%.",
      author: "Ahmed Al-Rahman",
      title: "Facilities Manager",
      company: "Grand Mosque of Kuwait",
      rating: 5,
    },
    {
      quote:
        "Training time reduced from 6 months to 2 months. Our tour booking revenue increased 60% with better English communication.",
      author: "Fatima Hassan",
      title: "Operations Director",
      company: "Cairo Heritage Tours",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <NavBar />

      {/* FORM SECTION */}
      {submitted ? (
        <section className="py-24 bg-gradient-to-r from-green-600 to-green-700 text-white text-center">
          <div className="mx-auto max-w-2xl px-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Demo Scheduled Successfully!
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Our KalamAI specialist will contact you within 24 hours to confirm
              your personalized demo session.
            </p>
            <div className="bg-white/20 backdrop-blur rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <div className="text-left space-y-2 text-green-100">
                <p>✓ Receive confirmation call/email within 24 hours</p>
                <p>✓ 30-minute personalized demo of KalamAI</p>
                <p>✓ See real scenarios relevant to your organization</p>
                <p>✓ Discuss custom pricing and implementation</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Book Your Personalized Demo
              </h2>
              <p className="text-xl text-gray-600">
                See exactly how KalamAI will work for your team in just 30
                minutes
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 space-y-6"
            >
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={onChange}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-sm bg-white transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Ahmed Al-Rashid"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-sm bg-white transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="name@company.com"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organization *
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={onChange}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-sm bg-white transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.company ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Mosque / Tour Company / Security Provider"
                    required
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Location
                  </label>
                  <input
                    name="siteLocation"
                    value={form.siteLocation}
                    onChange={onChange}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="e.g., Dubai, Kuwait City, Cairo"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Size *
                  </label>
                  <select
                    name="teamSize"
                    value={form.teamSize}
                    onChange={onChange}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-sm bg-white transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.teamSize ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select team size...</option>
                    <option value="1-10">1–10 people</option>
                    <option value="11-50">11–50 people</option>
                    <option value="51-200">51–200 people</option>
                    <option value="200+">200+ people</option>
                  </select>
                  {errors.teamSize && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.teamSize}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Primary Arabic Dialect
                  </label>
                  <select
                    name="preferredLanguage"
                    value={form.preferredLanguage}
                    onChange={onChange}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  >
                    <option value="">Select dialect...</option>
                    <option value="gulf">Gulf Arabic</option>
                    <option value="egyptian">Egyptian Arabic</option>
                    <option value="levantine">Levantine Arabic</option>
                    <option value="standard">Modern Standard Arabic</option>
                    <option value="mixed">Mixed Team</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Training Goal
                </label>
                <select
                  name="goals"
                  value={form.goals}
                  onChange={onChange}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Select primary goal...</option>
                  <option value="front-desk">
                    Improve reception & visitor communication
                  </option>
                  <option value="emergency">
                    Emergency protocol & safety communication
                  </option>
                  <option value="visitor-flow">
                    Visitor guidance & crowd management
                  </option>
                  <option value="cultural">
                    Cultural sensitivity & religious etiquette
                  </option>
                  <option value="tours">
                    Tour guiding & historical explanations
                  </option>
                  <option value="kpi">
                    Manager analytics & team performance tracking
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Context
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={onChange}
                  placeholder="Tell us about your current challenges, timeline, or specific scenarios you'd like to see..."
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Scheduling Demo...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule My Personalized Demo
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <strong>What to expect:</strong> A 30-minute personalized
                    walkthrough showing real scenarios for your industry. No
                    generic sales pitch - just KalamAI working for your specific
                    needs.
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">
                By submitting, you agree to our Terms of Service and Privacy
                Policy. We respect your privacy and will never share your
                information.
              </p>
            </form>
          </div>
        </section>
      )}

      {/* BENEFITS SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You&apos;ll See in Your Demo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience firsthand how KalamAI&apos;s culturally-aware AI
              transforms your team&apos;s English communication skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <benefit.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {benefit.stat}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQ />

      <Footer />
    </div>
  );
}
