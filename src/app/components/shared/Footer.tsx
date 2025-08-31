/* --- file: components/Footer.tsx --- */
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Link href="/guards/scenarios" className="hover:text-white">
                    Practice Scenarios
                  </Link>
                </li>
                <li>
                  <Link href="/guards/emergency" className="hover:text-white">
                    Emergency Phrases
                  </Link>
                </li>
                <li>
                  <Link href="/guards/admin" className="hover:text-white">
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">For Professionals</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/professionals/coming-soon"
                    className="hover:text-white"
                  >
                    Join Waitlist
                  </Link>
                </li>
                <li>
                  <Link
                    href="/professionals/enterprise"
                    className="hover:text-white"
                  >
                    Enterprise Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white">
                    Request Demo
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
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <div>© 2025 KalamAI. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Data Protection
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
