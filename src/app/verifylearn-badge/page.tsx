// app/verifylearn-badge/page.tsx
import Link from "next/link";
import Image from "next/image";
import NavBar from "../components/landing/shared/NavBar";
import Footer from "../components/shared/TempFooter";
export default function VerifyLearnBadgePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 text-blue-600 mt-30">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">VerifyLearn Badge</h1>
              <p className="text-xl text-blue-600 mb-8">
                Stand out from 200,000+ online courses with independent expert
                verification. Build instant trust with learners and increase
                your course sales by 20-30%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/submit"
                  className="bg-blue-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-400 transition-colors text-center"
                >
                  Get Your Course Verified
                </Link>
                <a
                  href="#pricing"
                  className="border-2 border-blue text-blue font-bold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-700 transition-colors text-center"
                >
                  View Pricing
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-8 flex flex-col items-center">
                  <div className="relative w-15 h-15 sm:w-15 sm:h-15 text-center">
                    <Image
                      src="/shield.png"
                      alt="Verify Learn Shield"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-sm font-semibold mb-2">VERIFIED</span>
                  <span className="text-4xl font-bold mb-2">92/100</span>
                  <span className="text-lg">Grade: A+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Course Creators Need VerifyLearn
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              In a market flooded with courses, standing out is harder than
              ever. Platform reviews can be gamed, and learners are increasingly
              skeptical.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">
                Low Trust
              </h3>
              <p className="text-gray-600">
                73% of learners hesitate to buy courses due to concerns about
                quality and credibility
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">
                Fake Reviews
              </h3>
              <p className="text-gray-600">
                Platform reviews can be manipulated, making it hard for genuine
                quality courses to stand out
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">
                Expensive Accreditation
              </h3>
              <p className="text-gray-600">
                Traditional accreditation costs £3,000+ and takes months - out
                of reach for solo instructors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The VerifyLearn Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Independent expert verification that proves your course quality -
              without the £3,000 price tag or 6-month wait
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    Expert Review
                  </h3>
                  <p className="text-gray-600">
                    Domain experts with 10+ years experience evaluate your
                    course against 20 comprehensive quality rubrics
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    Fast Turnaround
                  </h3>
                  <p className="text-gray-600">
                    Get verified in 48-72 hours, not 6 months. Start building
                    trust with learners immediately
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    Technical Accuracy
                  </h3>
                  <p className="text-gray-600">
                    We verify code quality, up-to-date content, and plagiarism -
                    things platform reviews can&apos;t check
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    Credible Badge
                  </h3>
                  <p className="text-gray-600">
                    Display your verification badge on course pages, marketing
                    materials, and LinkedIn to build instant credibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get verified in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Submit Your Course</h3>
              <p className="text-gray-600 text-sm">
                Fill out our simple form with your course URL and details
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Review</h3>
              <p className="text-gray-600 text-sm">
                Our experts evaluate your course against 20 quality rubrics
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Get Your Badge</h3>
              <p className="text-gray-600 text-sm">
                Receive your verification badge, certificate, and embed code
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Increase Sales</h3>
              <p className="text-gray-600 text-sm">
                Display your badge and watch your conversion rates improve
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What We Verify */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Verify
            </h2>
            <p className="text-lg text-gray-600">
              20-point comprehensive evaluation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-blue-700">
                Content Quality (40%)
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Technical accuracy</li>
                <li>✓ Depth of coverage</li>
                <li>✓ Practical application</li>
                <li>✓ Content structure</li>
                <li>✓ Completeness</li>
                <li>✓ Up-to-date information</li>
                <li>✓ Unique value</li>
                <li>✓ Code quality</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-green-700">
                Instructor (20%)
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Expertise evidence</li>
                <li>✓ Teaching clarity</li>
                <li>✓ Student engagement</li>
                <li>✓ Professional background</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-blue-700">
                Production (20%)
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Video quality</li>
                <li>✓ Audio quality</li>
                <li>✓ Visual aids</li>
                <li>✓ Pacing</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-orange-700">
                Learning Outcomes (20%)
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Clear objectives</li>
                <li>✓ Assessment methods</li>
                <li>✓ Student support</li>
                <li>✓ Career relevance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing</h2>
            <p className="text-lg text-gray-600">
              Affordable verification without the £3,000 institutional price tag
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Single Course */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold mb-2">Single Course</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">£149</span>
                <span className="text-gray-600">/course</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Expert review</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Verification badge</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Certificate PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>48-72hr turnaround</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Listed in directory</span>
                </li>
              </ul>
              <Link
                href="/submit"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Bundle - Most Popular */}
            <div className="bg-blue-600 text-white rounded-lg shadow-2xl border-2 border-green p-8 transform scale-105">
              <div className="bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">3 Course Bundle</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">£399</span>
                <span className="text-blue-200">/bundle</span>
                <div className="text-sm text-blue-200 mt-1">
                  £133 per course • Save £48
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>All Single Course features</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>3 courses verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Priority review</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Featured placement</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>36hr turnaround</span>
                </li>
              </ul>
              <Link
                href="/submit"
                className="block w-full text-center bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Bundle */}
            <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold mb-2">5 Course Bundle</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">£599</span>
                <span className="text-gray-600">/bundle</span>
                <div className="text-sm text-gray-600 mt-1">
                  £120 per course • Save £146
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>All Bundle features</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>5 courses verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>VIP priority review</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Homepage featured spot</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>24hr turnaround</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Social media kit</span>
                </li>
              </ul>
              <Link
                href="/submit"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Compare to traditional accreditation:{" "}
              <span className="font-bold text-red-600 line-through">
                £3,000+
              </span>{" "}
              and 6-12 months
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof / Results */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proven Results
            </h2>
            <p className="text-lg text-gray-600">
              Based on our pilot program with 50+ verified courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                20-30%
              </div>
              <div className="text-gray-600">
                Average increase in course sales
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">73%</div>
              <div className="text-gray-600">
                Of learners changed their purchase decision after seeing
                verification
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">48hrs</div>
              <div className="text-gray-600">
                Average verification turnaround time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Course Creators Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  MA
                </div>
                <div>
                  <div className="font-bold">Mohamed A.</div>
                  <div className="text-sm text-gray-600">Course Creator</div>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "I was skeptical at first, but the verification badge made a
                huge difference. Students trust my course more, and my sales
                increased by 25% in the first month."
              </p>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  SJ
                </div>
                <div>
                  <div className="font-bold">Sarah J.</div>
                  <div className="text-sm text-gray-600">Tech Instructor</div>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                "CPD wanted £3,000 and 6 months. VerifyLearn gave me the same
                credibility for £149 in 3 days. Absolute game-changer for solo
                instructors."
              </p>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* FAQ */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">
                How is this different from platform reviews?
              </h3>
              <p className="text-gray-600">
                Platform reviews show popularity and student satisfaction, but
                don&apos;t verify technical accuracy, content quality, or
                plagiarism. Our expert reviewers check what platform reviews
                can&apos;t - whether the code is correct, content is up-to-date,
                and teaching is effective.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">
                Who are your reviewers?
              </h3>
              <p className="text-gray-600">
                All reviewers have 10+ years of industry experience in their
                domain. For tech courses, our reviewers are senior software
                engineers, CTOs, and technical educators who actively work in
                the field.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">
                What if my course doesn&apos;t pass verification?
              </h3>
              <p className="text-gray-600">
                All courses receive a score (0-100) and grade (A+ to F). If you
                score below 60, we provide detailed feedback on improvements
                needed. You can resubmit after making changes for 50% off the
                original price.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">
                How long does verification last?
              </h3>
              <p className="text-gray-600">
                Verification is valid for 12 months. After that, you can renew
                for £99 to ensure your badge reflects current content quality.
                Major course updates may require re-verification.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">
                Can I display the badge anywhere?
              </h3>
              <p className="text-gray-600">
                Yes! You receive a badge image, embed code, and certificate PDF.
                Display it on your course page, marketing materials, LinkedIn,
                website, email signature - anywhere you promote your course.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg mb-2">
                Do you verify courses in all subjects?
              </h3>
              <p className="text-gray-600">
                Currently, we focus on tech courses (web development, software
                engineering, data science, DevOps, cloud). We&apos;re expanding
                to business, design, and marketing courses in Q2 2025.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Trust with Your Learners?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 50+ course creators who&apos;ve increased their sales with
            VerifyLearn verification
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="bg-white text-blue-700 font-bold px-10 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg"
            >
              Get Verified Today
            </Link>
            <Link
              href="/verified-courses"
              className="border-2 border-white text-white font-bold px-10 py-4 rounded-lg hover:bg-white hover:text-blue-700 transition-colors text-lg"
            >
              View Verified Courses
            </Link>
          </div>
          <p className="mt-8 text-blue-200 text-sm">
            48-72 hour turnaround • Money-back guarantee if not satisfied
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
