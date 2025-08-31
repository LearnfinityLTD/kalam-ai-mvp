/* --- file: app/demo/page.tsx --- */
"use client";

import { useState } from "react";
import NavBar from "@/app/components/landing/NavBar";
import Footer from "@/app/components/shared/Footer";
import {
  Shield,
  MessageSquare,
  Target,
  Clock,
  CheckCircle,
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <NavBar />

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Book a KalamAI Walkthrough
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          See how KalamAI boosts front-line{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            English communication
          </span>
          , accelerates training with{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            AI role-play
          </span>
          , and gives managers clear progress analytics.
        </p>

        {/* Value props tuned to KalamAI */}
        <div className="mt-8 grid gap-6 text-left md:grid-cols-3 text-sm">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p>
              <span className="font-semibold">AI Conversations:</span> Realistic
              guard–visitor role-play in English/Arabic.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p>
              <span className="font-semibold">Measured Outcomes:</span> Scores,
              streaks, and scenario mastery per guard.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p>
              <span className="font-semibold">Ops-ready:</span> Scenarios for
              reception, parking, emergencies & compliance.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      {submitted ? (
        <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
          <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-600 dark:text-green-500" />
          <h2 className="text-3xl font-bold mb-2">Thanks — we’ve got it!</h2>
          <p className="text-slate-600 dark:text-slate-300">
            A KalamAI teammate will reach out to schedule your session.
          </p>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <form
            onSubmit={onSubmit}
            className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 p-8 space-y-6"
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
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., Ahmed Al-Rashid"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="name@company.com"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Company
                </label>
                <input
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 ${
                    errors.company ? "border-red-500" : ""
                  }`}
                  placeholder="Facility / Security Provider"
                  required
                />
                {errors.company && (
                  <p className="mt-1 text-xs text-red-600">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Site / Location
                </label>
                <input
                  name="siteLocation"
                  value={form.siteLocation}
                  onChange={onChange}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Dubai HQ Reception"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Size
                </label>
                <select
                  name="teamSize"
                  value={form.teamSize}
                  onChange={onChange}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select…</option>
                  <option value="1-10">1–10 guards</option>
                  <option value="11-50">11–50 guards</option>
                  <option value="51-200">51–200 guards</option>
                  <option value="200+">200+ guards</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Training Language
                </label>
                <select
                  name="preferredLanguage"
                  value={form.preferredLanguage}
                  onChange={onChange}
                  className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select…</option>
                  <option value="english">English</option>
                  <option value="arabic">Arabic</option>
                  <option value="both">Both (English + Arabic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                What are your top goals?
              </label>
              <select
                name="goals"
                value={form.goals}
                onChange={onChange}
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select…</option>
                <option value="front-desk">
                  Improve reception communication
                </option>
                <option value="emergency">Emergency protocol readiness</option>
                <option value="visitor-flow">
                  Visitor flow & registration
                </option>
                <option value="kpi">Manager analytics & KPIs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                rows={4}
                value={form.notes}
                onChange={onChange}
                placeholder="Any context, timelines, or requirements?"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Submitting…" : "Request KalamAI Demo"}
            </button>

            <p className="text-[13px] text-slate-500 dark:text-slate-400 text-center">
              By submitting, you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </section>
      )}

      <Footer />
    </div>
  );
}
