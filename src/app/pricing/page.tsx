import Footer from "../components/landing/shared/LandingFooter";

export default function PricingComponent() {
  return (
    <>
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Connect with Your <br />
              <span className="text-blue-400">Most Valuable</span> Customers
            </h1>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Our team of experts will collaborate with you to develop a
              tailored strategy, leveraging VerifyLearn&apos;s Course
              Verification Platform to deliver personalized experiences and
              exclusive offers that build deeper relationships and drive
              long-term growth. Ready to exceed your marketing goals? Explore
              our platform and let&apos;s talk.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-slate-50 rounded-2xl p-12 max-w-5xl mx-auto">
            <h3 className="text-4xl font-semibold text-slate-900 mb-12 text-center">
              Individual Course Verification Engine
            </h3>

            <div className="grid md:grid-cols-2 gap-16 mb-12">
              {/* Left Column - Includes */}
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6">
                  Includes:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Unlimited Core Course Categories (Development, Design,
                      Business, Marketing)
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      3+ Languages
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Unlimited Geographies
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Unlimited Programs
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      200K+ Authoritative Data Sources
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Plagiarism Detection
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Fake Credential Detection
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Content Freshness Monitoring
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      2 Customizable Verification Fields
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Platform Integration Tools
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Branded Verification & Course Management
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-900 text-base">
                      Student Alerts
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Services */}
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6">
                  Services and support:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">
                      24/7 Product and Student Support
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">
                      Customer Experience Center, Implementation, and Support
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">
                      Verified Courses Directory
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">
                      Performance Reporting
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">Global SMS</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">
                      Custom API Integrations
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-slate-900 text-2xl leading-none mt-1">
                      •
                    </span>
                    <span className="text-slate-900 text-base">Biometrics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="text-center pt-8 border-t border-slate-300">
              <h4 className="text-2xl font-semibold text-slate-900 mb-8">
                Ready to get started?
              </h4>
              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold px-12 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Schedule a Consultation
              </a>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Not Sure Where to Begin?
                <br />
                Talk to Our Experts.
              </h2>
              <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                Our consultative sales approach is designed to match you with
                the ideal solution that aligns with your unique needs and goals.
                We work closely with you to understand your objectives, target
                the right audiences, and implement proven strategies for maximum
                impact.
              </p>
              <a
                href="/demo"
                className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold px-10 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Let&apos;s Work Together
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
