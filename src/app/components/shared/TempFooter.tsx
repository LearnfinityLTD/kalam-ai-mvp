/* --- file: components/TempFooter.tsx --- */
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0a1741] text-white py-12 px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Section - Logo centered */}
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

        {/* Bottom Section - Copyright, Links, and Social Icons */}
        <div className="flex items-center justify-between">
          {/* Left - Copyright */}
          <div className="flex items-center">
            <p className="text-gray-400 text-sm whitespace-nowrap">
              © 2025 VerifyLearn. All rights reserved.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-10 text-sm">
            <Link
              href="/privacy-policy"
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Terms of Use
            </Link>
            <Link
              href="/cookies-settings"
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Cookies Settings
            </Link>
          </div>

          {/* Right - Social Icons */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
