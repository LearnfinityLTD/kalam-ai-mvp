// pages/case-study/learnfinity.js (or app/case-study/learnfinity/page.js for App Router)
// This is a full Next.js page component using Tailwind CSS for styling.
// Assumes Tailwind is configured in your project (e.g., via globals.css with @tailwind directives).
// Place images in /public folder: e.g., /public/images/learnfinity-hero.jpg, /public/images/verify-team-headshot.jpg
// For production, optimize images with Next.js Image component.

import Image from 'next/image';
import Head from 'next/head';

export default function LearnfinityCaseStudy() {
  return (
    <>
      <Head>
        <title>Learnfinity Boosts Enrollment with VerifyLearn Verification | VerifyLearn</title>
        <meta name="description" content="Discover how Learnfinity partnered with VerifyLearn to verify 100% of their courses, achieving a 92+ average quality score and driving enrollment growth through credible, independent validation." />
      </Head>
      <main className="min-h-screen bg-white text-gray-900 font-sans">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <span className="inline-block text-blue-700 text-sm font-semibold uppercase mb-2">Customer Story</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Learnfinity Boosts Enrollment by Integrating Independent Course Verification
              </h1>
            </div>
            <div className="relative w-full md:w-1/3">
              <Image
                src="/case-study/learnfinity/lf66.png"
                alt="Learnfinity branded image of tech education tools"
                width={400}
                height={300}
                className="w-full rounded-lg shadow-lg object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">Learnfinity</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-100 opacity-50 rounded-r-full"></div>
          <div className="absolute top-1/2 right-0 w-1/4 h-1/2 bg-blue-200 opacity-30 rounded-l-full"></div>
        </section>

        {/* Summary Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900">Summary</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Learnfinity, a leading UK-based edtech platform specializing in technology courses, faced the challenge of standing out in a saturated market. With rapid growth in online learning, students demanded verifiable quality. By partnering with VerifyLearn, the first independent verification service for online courses, Learnfinity achieved 100% verification across its catalog, resulting in boosted enrollments and enhanced learner confidence.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Company: <span className="font-semibold">Learnfinity</span> | Industry: <span className="font-semibold">EdTech</span> | Product: <span className="font-semibold">Verified Technology Courses</span>
            </p>
          </div>
        </section>

        {/* Challenge Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-gray-900">Challenge</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              In the booming edtech space, Learnfinity offered high-quality technology courses—from AI and coding to cybersecurity—but struggled with perceived credibility. Students were wary of unverified content, leading to high drop-off rates and slower enrollment growth. Traditional platforms lacked transparent quality checks, and Learnfinity needed a way to validate content accuracy, instructor credentials, and pedagogical effectiveness without building an in-house system.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The pain point was clear: Without independent assurance, even the best courses blended into the noise of low-quality competitors.
            </p>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-gray-900">Solution</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              VerifyLearn provided a rigorous 4-stage verification process: content accuracy review by tech experts, instructor credential validation, AI-powered plagiarism detection, and pedagogical quality assessment. Integrated seamlessly into Learnfinity&apos;s platform, every course received the VerifyLearn badge upon passing—ensuring fast 48-hour turnarounds and a 92+ average quality score.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              This independent seal, likened to the &quot;Good Housekeeping Seal&quot; for education, allowed Learnfinity to highlight verified tech courses, building trust and differentiating in a crowded market.
            </p>
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 mt-6">
              <div>
                <blockquote className="italic text-gray-700 text-lg font-medium mb-2">
                  &ldquo;Adding VerifyLearn verification to our Learnfinity courses has transformed how students perceive our content. Since displaying the verified badges, we&apos;ve seen a noticeable increase in enrollments - students tell us the independent verification gives them confidence they&apos;re investing in quality education. Being able to demonstrate third-party validation of our technical accuracy and instructor credentials has helped us stand out in a crowded market. It&apos;s the credibility boost every serious course platform needs.&rdquo;
                </blockquote>
                <p className="text-sm text-gray-500">— Learnfinity Team, Platform Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-gray-900">Results</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Post-integration, Learnfinity reported a surge in enrollments, with students citing the VerifyLearn badges as a key decision factor. The platform now boasts 100% verified courses, fostering long-term loyalty and positioning it as a leader in quality tech education. Future plans include expanding verification to new course launches for sustained growth.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              VerifyLearn&apos;s model not only protected against common pitfalls like outdated content but also unlocked evergreen trust in an ever-evolving edtech ecosystem.
            </p>
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 mt-6">
              <div>
                <blockquote className="italic text-gray-700 text-lg font-medium mb-2">
                  &ldquo;The partnership with VerifyLearn has exceeded our expectations, delivering measurable ROI through increased conversions and student satisfaction.&rdquo;
                </blockquote>
                <p className="text-sm text-gray-500">— Learnfinity Team, Platform Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Optional CTA Section (inspired by common patterns, as original lacks one) */}
        <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4">Ready to Verify Your Courses?</h2>
            <p className="text-xl mb-8">Join Learnfinity and elevate your platform with independent quality assurance.</p>
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
