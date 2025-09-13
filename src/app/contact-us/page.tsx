// pages/contact.js or app/contact/page.js (depending on your Next.js version)

"use client"; // If using App Router (Next.js 13+)

import React, { useState } from "react";
import Head from "next/head";
import {
  Shield,
  MapPin,
  Briefcase,
  Mail,
  Building,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",

    // Professional Context
    role: "",
    organization: "",
    organizationType: "",
    teamSize: "",

    // Location & Language
    country: "",
    city: "",
    nativeLanguage: "",
    currentEnglishLevel: "",

    // Use Case & Goals
    primaryGoal: "",
    specificScenarios: "",
    urgency: "",

    // Context & Challenges
    currentChallenges: "",
    previousSolutions: "",
    successMetrics: "",

    // Additional Info
    budget: "",
    timeline: "",
    additionalNotes: "",

    // Preferences
    preferredContactMethod: "",
    bestTimeToCall: "",
    hearAboutUs: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>Thank You - Kalam AI</title>
          <meta
            name="description"
            content="Thank you for contacting Kalam AI. We'll be in touch soon!"
          />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve received your information and will be in touch within
              24 hours to discuss how Kalam AI can help you achieve your English
              communication goals.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-600 transition-colors"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Us - Kalam AI | Professional English Learning</title>
        <meta
          name="description"
          content="Get in touch with Kalam AI to start your professional English learning journey. Specialized training for mosque staff, tour guides, and business professionals."
        />
        <meta
          name="keywords"
          content="English learning, professional English, mosque staff training, tour guide English, Arabic to English"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                  كلام
                </div>
                <span className="ml-3 text-2xl font-bold text-gray-900">
                  AI
                </span>
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                Get Started Today
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Let&apos;s Build Your English Success Story
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us understand your unique needs so we can create the perfect
              learning experience for your professional growth.
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="space-y-10">
              {/* Personal Information */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="w-6 h-6 text-green-500 mr-3" />
                  Tell Us About Yourself
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ahmed Mohammed"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ahmed@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+20 123 456 7890"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current English Level *
                    </label>
                    <select
                      name="currentEnglishLevel"
                      value={formData.currentEnglishLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select your level...</option>
                      <option value="beginner">Beginner (A1-A2)</option>
                      <option value="intermediate">Intermediate (B1-B2)</option>
                      <option value="advanced">Advanced (C1-C2)</option>
                      <option value="unsure">Not sure</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Context */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Briefcase className="w-6 h-6 text-green-500 mr-3" />
                  Your Professional Context
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select your role...</option>
                      <option value="mosque-guard">
                        Mosque Security/Guard
                      </option>
                      <option value="mosque-host">
                        Mosque Host/Receptionist
                      </option>
                      <option value="tour-guide">Tour Guide</option>
                      <option value="hotel-staff">Hotel Staff</option>
                      <option value="restaurant-manager">
                        Restaurant Manager
                      </option>
                      <option value="retail-manager">Retail Manager</option>
                      <option value="business-owner">Business Owner</option>
                      <option value="team-leader">Team Leader/Manager</option>
                      <option value="customer-service">Customer Service</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization/Business
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Al-Azhar Mosque, Nile Hotel, etc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Type *
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select type...</option>
                      <option value="mosque">
                        Mosque/Religious Institution
                      </option>
                      <option value="tourism">Tourism Company</option>
                      <option value="hotel">Hotel/Hospitality</option>
                      <option value="restaurant">Restaurant/Cafe</option>
                      <option value="retail">Retail/Shopping</option>
                      <option value="government">Government Office</option>
                      <option value="corporate">Corporate Business</option>
                      <option value="individual">
                        Individual Professional
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Team Size
                    </label>
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select team size...</option>
                      <option value="individual">Just me</option>
                      <option value="2-5">2-5 people</option>
                      <option value="6-15">6-15 people</option>
                      <option value="16-50">16-50 people</option>
                      <option value="50+">50+ people</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Context */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 text-green-500 mr-3" />
                  Location & Language Context
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      placeholder="Egypt, Saudi Arabia, UAE, etc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Cairo, Riyadh, Dubai, etc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Native Language *
                    </label>
                    <select
                      name="nativeLanguage"
                      value={formData.nativeLanguage}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select language...</option>
                      <option value="arabic-egyptian">Arabic (Egyptian)</option>
                      <option value="arabic-gulf">Arabic (Gulf)</option>
                      <option value="arabic-levantine">
                        Arabic (Levantine)
                      </option>
                      <option value="arabic-maghreb">Arabic (Maghreb)</option>
                      <option value="arabic-standard">
                        Modern Standard Arabic
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Goals & Use Cases */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="w-6 h-6 text-green-500 mr-3" />
                  Your Goals & Use Cases
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Goal *
                    </label>
                    <select
                      name="primaryGoal"
                      value={formData.primaryGoal}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select your main goal...</option>
                      <option value="tourist-communication">
                        Communicate better with English-speaking tourists
                      </option>
                      <option value="business-meetings">
                        Improve business meeting communication
                      </option>
                      <option value="customer-service">
                        Enhance customer service skills
                      </option>
                      <option value="team-training">
                        Train my team for better English communication
                      </option>
                      <option value="career-advancement">
                        Advance my career opportunities
                      </option>
                      <option value="confidence-building">
                        Build confidence in English speaking
                      </option>
                      <option value="specific-scenarios">
                        Master specific workplace scenarios
                      </option>
                      <option value="cultural-understanding">
                        Better understand cultural context in communication
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specific Scenarios You Face *
                    </label>
                    <textarea
                      name="specificScenarios"
                      value={formData.specificScenarios}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Describe the specific situations where you need better English communication (e.g., welcoming mosque visitors, explaining prayer times, handling tourist questions about Islamic culture, etc.)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      How urgent is this need? *
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select urgency...</option>
                      <option value="immediate">
                        Immediate (need to start this week)
                      </option>
                      <option value="soon">Soon (within this month)</option>
                      <option value="planning">
                        Planning ahead (within 3 months)
                      </option>
                      <option value="exploring">Just exploring options</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Current Challenges */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Clock className="w-6 h-6 text-green-500 mr-3" />
                  Current Challenges & Experience
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What challenges do you currently face with English
                      communication? *
                    </label>
                    <textarea
                      name="currentChallenges"
                      value={formData.currentChallenges}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="e.g., feeling nervous when tourists ask questions, not knowing how to explain Islamic practices in English, struggling with pronunciation, etc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Have you tried other English learning solutions before?
                    </label>
                    <textarea
                      name="previousSolutions"
                      value={formData.previousSolutions}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Tell us about other apps, courses, or methods you've tried - what worked and what didn't?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      How will you measure success?
                    </label>
                    <input
                      type="text"
                      name="successMetrics"
                      value={formData.successMetrics}
                      onChange={handleChange}
                      placeholder="e.g., confidently handle 10 tourist interactions per day, lead mosque tours in English, etc."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building className="w-6 h-6 text-green-500 mr-3" />
                  Budget & Timeline
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Monthly Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select budget range...</option>
                      <option value="under-50">Under $50/month</option>
                      <option value="50-100">$50-100/month</option>
                      <option value="100-200">$100-200/month</option>
                      <option value="200-500">$200-500/month</option>
                      <option value="500+">$500+/month</option>
                      <option value="discuss">Prefer to discuss</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Desired Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select timeline...</option>
                      <option value="1-month">
                        See results within 1 month
                      </option>
                      <option value="3-months">
                        Comfortable timeline - 3 months
                      </option>
                      <option value="6-months">
                        Long-term improvement - 6 months
                      </option>
                      <option value="ongoing">Ongoing development</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Preferences */}
              <div className="border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Mail className="w-6 h-6 text-green-500 mr-3" />
                  Contact & Follow-up Preferences
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Contact Method *
                    </label>
                    <select
                      name="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select method...</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Phone Call</option>
                      <option value="video-call">
                        Video Call (Zoom/Teams)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Best Time to Contact You
                    </label>
                    <select
                      name="bestTimeToCall"
                      value={formData.bestTimeToCall}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select time...</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">
                        Afternoon (12 PM - 5 PM)
                      </option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      How did you hear about Kalam AI?
                    </label>
                    <select
                      name="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select source...</option>
                      <option value="google">Google Search</option>
                      <option value="social-media">Social Media</option>
                      <option value="colleague">
                        Colleague/Friend Recommendation
                      </option>
                      <option value="mosque">Through my mosque</option>
                      <option value="tourism-company">Tourism company</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="pb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes or Questions
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Anything else you'd like us to know? Special requirements, concerns, or questions about Kalam AI?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <form onSubmit={handleSubmit}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started with Kalam AI
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-4">
                  We&apos;ll review your information and get back to you within
                  24 hours with a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Secure & Private
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No Spam
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                24hr Response
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
