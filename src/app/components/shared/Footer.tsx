/* --- file: components/Footer.tsx --- */
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center text-white text-sm font-bold">
                كلام
              </div>
              <span className="ml-2 text-lg font-bold">AI</span>
            </Link>
            <p className="text-gray-400">
              AI English tutor for Arabic speakers, built with Islamic values
              and cultural understanding.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">For Guards</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/guards/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signin?type=guard"
                  className="hover:text-white"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white">
                  View Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Coming Soon</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/tour-guides/coming-soon"
                  className="hover:text-white"
                >
                  Tour Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/professionals/coming-soon"
                  className="hover:text-white"
                >
                  Business Professionals
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-white">
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <div>© 2025 KalamAI. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
