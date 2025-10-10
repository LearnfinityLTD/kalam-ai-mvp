/* --- file: components/Footer.tsx --- */
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#001433] text-white py-12 relative overflow-hidden">
      {/* Decorative background elements (like SheerID's stars/dots) */}
      <div className="absolute top-10 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-40 right-40 w-2 h-2 bg-green-400 rounded-full opacity-40" />
      <div className="absolute bottom-20 left-1/3 w-4 h-4 border-2 border-yellow-400 rounded-full opacity-30" />

      {/* Curved decorative line (like SheerID's path) */}
      <svg
        className="absolute top-0 right-0 w-1/2 h-full opacity-10"
        viewBox="0 0 500 600"
        fill="none"
      >
        <path
          d="M 500 0 Q 300 200 400 400 T 500 600"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="10 10"
          className="text-blue-400"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Logo + Awards Section */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center mb-6 group">
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

          {/* UNIQUE BRAND ELEMENT: Trust Badges/Awards */}
          {/* TODO: Replace with actual badges once you have them */}
          <div className="flex gap-4 mt-4">
            {/* Placeholder badge 2 - Replace with certification */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center w-24">
              <div className="text-green-400 text-2xl mb-1">✓</div>
              <div className="text-[10px] text-gray-400 leading-tight">
                VERIFIED REVIEWS
              </div>
              <div className="text-[9px] text-gray-500 mt-0.5">CERTIFIED</div>
            </div>

            {/* Placeholder badge 3 - Replace with user count milestone */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-center w-24">
              <div className="text-blue-400 text-2xl mb-1">★</div>
              <div className="text-[10px] text-gray-400 leading-tight">
                COURSES VERIFIED
              </div>
              <div className="text-[9px] text-gray-500 mt-0.5">100+</div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: PRODUCTS */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-300 uppercase tracking-wider">
              Products
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/verify" className="hover:text-white transition">
                  Course Verification
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Verified Course Search
                </Link>
              </li>
              <li>
                <Link href="/api" className="hover:text-white transition">
                  Platform API
                </Link>
              </li>
              <li>
                <Link href="/badge" className="hover:text-white transition">
                  VerifyLearn Badge
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="hover:text-white transition"
                >
                  Verification Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: SOLUTIONS */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-300 uppercase tracking-wider">
              Solutions
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="font-semibold text-gray-300 mb-2">By User</li>
              <li>
                <Link href="/learners" className="hover:text-white transition">
                  Course Buyers
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-white transition">
                  Course Creators
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-white transition">
                  Platforms
                </Link>
              </li>
              <li className="font-semibold text-gray-300 mt-4 mb-2">
                By Category
              </li>
              <li>
                <Link href="/tech" className="hover:text-white transition">
                  Technology Courses
                </Link>
              </li>
              <li>
                <Link href="/business" className="hover:text-white transition">
                  Business Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-300 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Resource Center
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="hover:text-white transition"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition">
                  Press Releases
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Knowledge Base
                </Link>
              </li>
              <li>
                <Link href="/trust" className="hover:text-white transition">
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: COMPANY */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-gray-300 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-white transition">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Resources Section (like SheerID's) */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <h3 className="text-xs font-bold mb-4 text-gray-500 uppercase tracking-wider">
            Additional Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <Link
              href="/guide/choosing-courses"
              className="text-gray-400 hover:text-white transition"
            >
              The Ultimate Guide to Choosing Quality Online Courses
            </Link>
            <Link
              href="/guide/plagiarism"
              className="text-gray-400 hover:text-white transition"
            >
              How to Spot Plagiarized Course Content
            </Link>
            <Link
              href="/guide/roi"
              className="text-gray-400 hover:text-white transition"
            >
              ROI Calculator: Verified Courses vs. Regular Courses
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-xs text-gray-500">
            © 2025 VerifyLearn. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-6 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition">
              Cookies Policy
            </Link>
            <Link
              href="/cookie-settings"
              className="hover:text-white transition"
            >
              Manage Cookie Consents
            </Link>
            <Link href="/accessibility" className="hover:text-white transition">
              Accessibility
            </Link>
            <Link href="/dmca" className="hover:text-white transition">
              DMCA Policy
            </Link>
            <Link href="/compliance" className="hover:text-white transition">
              Compliance
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {/* Twitter/X */}
            <Link
              href="https://twitter.com/verifylearn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition text-gray-400"
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>

            {/* LinkedIn */}
            <Link
              href="https://linkedin.com/company/verifylearn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition text-gray-400"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>

            {/* Facebook */}
            <Link
              href="https://facebook.com/verifylearn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition text-gray-400"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
