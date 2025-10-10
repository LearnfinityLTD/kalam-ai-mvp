import Link from "next/link";
import Image from "next/image";
import Footer from "../components/shared/TempFooter";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-64 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-30 blur-2xl"></div>

      <div className="max-w-[1400px] mx-auto px-12 py-12 relative z-10">
        <div className="grid lg:grid-cols-[1fr_auto] gap-20 items-start">
          {/* Left Column */}
          <div className="max-w-2xl">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="inline-flex items-center group">
                <div className="relative w-50 h-50 sm:w-50 sm:h-50">
                  <Image
                    src="/logo.png"
                    alt="Verify Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Headline */}
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mt-0 mb-4">
                LET&apos;S TALK
              </p>
              <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
                Stop Buying Bad Courses. Start Learning Smart.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                VerifyLearn&apos;s independent verification system catches
                plagiarism, fake credentials, and outdated content that student
                reviews miss—so you invest in courses that actually deliver
                results.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-slate-900 p-10 w-[500px] flex-shrink-0 relative">
            <div className="absolute -top-1 -right-1 w-32 h-32 bg-green-400 rounded-full opacity-40 blur-xl"></div>

            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Ready to get started?
            </h2>

            <div className="space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Single field */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  How did you hear about us?
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Please share any additional information about your request.
                  (Optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Please share any additional information about your request"
                ></textarea>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-4 h-4 border-2 border-slate-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-slate-600">
                  Yes, I agree to receive periodic emails from VerifyLearn
                  related to products and services and can unsubscribe at any
                  time. I accept the VerifyLearn Privacy Policy.{" "}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-bold py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
