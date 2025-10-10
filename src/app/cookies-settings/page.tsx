"use client";
import React, { useState } from "react";
import { Shield, Cookie, CheckCircle2, Info, Save } from "lucide-react";

export default function CookieSettingsPage() {
  const [essentialEnabled, setEssentialEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [preferencesEnabled, setPreferencesEnabled] = useState(false);

  const handleSavePreferences = () => {
    // Logic to save cookie preferences
    console.log({
      essential: essentialEnabled,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      preferences: preferencesEnabled,
    });
    alert("Your cookie preferences have been saved!");
  };

  const handleAcceptAll = () => {
    setAnalyticsEnabled(true);
    setMarketingEnabled(true);
    setPreferencesEnabled(true);
  };

  const handleRejectAll = () => {
    setAnalyticsEnabled(false);
    setMarketingEnabled(false);
    setPreferencesEnabled(false);
  };

  const cookieCategories = [
    {
      id: "essential",
      title: "Essential Cookies",
      description:
        "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.",
      examples: "Session cookies, security cookies, authentication tokens",
      enabled: essentialEnabled,
      setEnabled: setEssentialEnabled,
      required: true,
    },
    {
      id: "analytics",
      title: "Analytics Cookies",
      description:
        "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and see how visitors move around the site.",
      examples: "Google Analytics, page view tracking, user behavior analysis",
      enabled: analyticsEnabled,
      setEnabled: setAnalyticsEnabled,
      required: false,
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      description:
        "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites. They work by uniquely identifying your browser and device.",
      examples: "Facebook Pixel, Google Ads, retargeting cookies",
      enabled: marketingEnabled,
      setEnabled: setMarketingEnabled,
      required: false,
    },
    {
      id: "preferences",
      title: "Preference Cookies",
      description:
        "These cookies enable the website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features. They may also be used to provide services you have asked for.",
      examples: "Language settings, theme preferences, location data",
      enabled: preferencesEnabled,
      setEnabled: setPreferencesEnabled,
      required: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Cookie className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Cookie Settings
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            We use cookies to enhance your experience, analyze site traffic, and
            personalize content. Choose which cookies you&apos;re comfortable
            with below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                  <p className="text-sm text-gray-600">
                    Set all cookies at once
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Reject All
                </button>
              </div>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="space-y-6">
            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {category.title}
                        </h3>
                        {category.required && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-4">
                        <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Examples:
                          </p>
                          <p className="text-sm text-gray-600">
                            {category.examples}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() =>
                          !category.required &&
                          category.setEnabled(!category.enabled)
                        }
                        disabled={category.required}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          category.enabled ? "bg-blue-600" : "bg-gray-300"
                        } ${
                          category.required
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            category.enabled ? "translate-x-7" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Save Your Preferences
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your choices will be saved and applied immediately. You can
                    change these settings at any time.
                  </p>
                </div>
              </div>
              <button
                onClick={handleSavePreferences}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">
              More About Cookies
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed mb-3">
              Cookies are small text files that are placed on your device to
              help websites provide a better user experience. You can control
              and manage cookies in various ways. Please note that removing or
              blocking cookies can impact your user experience and some
              functionality may no longer be available.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-use"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Terms of Service
              </a>
              <a
                href="/request-demo"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
