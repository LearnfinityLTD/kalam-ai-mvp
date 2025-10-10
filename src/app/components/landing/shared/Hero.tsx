"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
export const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 overflow-hidden pt-32 pb-20">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
      <div className="absolute top-40 right-1/4 w-2 h-2 bg-green-400 rounded-full" />
      <div className="absolute bottom-32 left-20 w-4 h-4 bg-yellow-400 rounded-full opacity-60" />

      {/* Curved Background Shape - Right Side */}
      <div className="absolute -right-10 top-0 w-[600px] h-[900px] hidden lg:block">
        {/* Blue arc */}

        <Image
          src="/shield.png"
          alt="Verify Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Stop Buying Bad Courses.{" "}
              <span className="text-blue-600">Start Learning Smart.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              VerifyLearn&apos;s independent verification system catches
              plagiarism, fake credentials, and outdated content that student
              reviews miss—so you invest in courses that actually deliver
              results.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">100+ Courses Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">48-Hour Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Expert Reviewers</span>
              </div>
            </div>

            {/* Social Proof
            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">
                Trusted by learners at:
              </p>
              <div className="flex flex-wrap gap-6 items-center opacity-60">
          

                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/companies/learnfinity-logo.png"
                    alt="Verify Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div> 
            </div>*/}
          </div>

          {/* Right Side - Image Placeholder Area */}
          <div className="relative lg:block hidden">
            {/* Main circular image container with overlapping profile cards */}
            <div className="relative w-full h-[600px]">
              {/* Decorative sparkle */}
              <div className="absolute bottom-12 right-12 z-30">
                <svg
                  className="w-8 h-8 text-yellow-400 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};
