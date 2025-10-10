import Footer from "@/app/components/landing/shared/LandingFooter";

export default function CourseGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-6">
            Additional Resources
          </p>
          <h1 className="text-6xl font-bold text-slate-900 leading-tight max-w-5xl">
            The Ultimate Guide to Choosing Quality Online Courses
          </h1>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Card - Main Feature */}
            <div className="bg-slate-50 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-8 left-8 space-y-4">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-lg inline-block">
                  <span className="text-3xl font-bold text-blue-600">
                    3,800
                  </span>
                </div>
                <div className="bg-white rounded-2xl px-6 py-3 shadow-lg inline-block">
                  <span className="text-3xl font-bold text-blue-600">28x</span>
                </div>
                <div className="bg-white rounded-2xl px-6 py-3 shadow-lg inline-block">
                  <span className="text-3xl font-bold text-blue-600">90%</span>
                </div>
              </div>

              <div className="mt-20">
                <h2 className="text-4xl font-bold text-slate-900 mb-6">
                  VerifyLearn&apos;s Course Verification Platform
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Instantly verify course quality worldwide with 200K+
                  authoritative data sources so you can identify courses
                  students willingly trust and use it to provide them with
                  personalized learning experiences and protected educational
                  offers.
                </p>
                <a
                  href="/platform"
                  className="inline-block text-blue-600 font-semibold hover:text-blue-700"
                >
                  Learn more →
                </a>
              </div>
            </div>

            {/* Right Side - Expandable Cards */}
            <div className="space-y-4">
              {/* Audience Network Card - Expanded */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Red Flags to Watch For
                    </h3>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Foster authentic learning and protect students by identifying
                  warning signs in online courses including unrealistic
                  promises, unverified instructors, and outdated content.
                </p>
                <a
                  href="/red-flags"
                  className="inline-block bg-white text-slate-900 font-semibold px-6 py-3 rounded-full border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                >
                  Learn about Red Flags
                </a>
              </div>

              {/* Affinity Network Card - Collapsed */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-slate-300 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Quality Course Indicators
                    </h3>
                  </div>
                  <button className="text-slate-900">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Alliance Network Card - Collapsed */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 hover:border-slate-300 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Verification Process
                    </h3>
                  </div>
                  <button className="text-slate-900">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-16 text-center">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Start Learning with Confidence
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-10">
              Don&apos;t let bad courses waste your time and money. Use
              VerifyLearn to find verified, high-quality courses that deliver
              real results.
            </p>
            <a
              href="/demo"
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold px-12 py-5 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Let&apos;s Work Together
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
