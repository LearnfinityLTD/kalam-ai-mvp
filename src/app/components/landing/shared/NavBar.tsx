"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-blue-50 via-green-50 to-yellow-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="flex items-center">
              <div className="relative w-50 h-50 sm:w-50 sm:h-50">
                <Image
                  src="/logo.png"
                  alt="Verify Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Products Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={(e) => toggleDropdown("products", e)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Products
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === "products" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "products" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <Link
                    href="/verify"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">Course Verification</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Independent quality assessment
                    </div>
                  </Link>
                  <Link
                    href="/search"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">
                      Verified Course Directory
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Browse certified courses
                    </div>
                  </Link>
                  <Link
                    href="/badge"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">VerifyLearn Badge</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Trust seal for your courses
                    </div>
                  </Link>
                  <Link
                    href="/api"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">Platform API</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Integration for platforms
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={(e) => toggleDropdown("solutions", e)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Solutions
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === "solutions" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    By User Type
                  </div>
                  <Link
                    href="/learners"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">Course Buyers</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Find verified quality courses
                    </div>
                  </Link>
                  <Link
                    href="/creators"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">Course Creators</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Get verified & boost sales
                    </div>
                  </Link>
                  <Link
                    href="/platforms"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="font-semibold">Platforms</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Enterprise quality assurance
                    </div>
                  </Link>

                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t border-b border-gray-100 mt-2">
                    By Category
                  </div>
                  <Link
                    href="/categories/tech"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Technology Courses
                  </Link>
                  <Link
                    href="/categories/business"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Business Courses
                  </Link>
                  <Link
                    href="/categories/creative"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Creative Arts
                  </Link>
                </div>
              )}
            </div>

            {/* Customers Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={(e) => toggleDropdown("customers", e)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Customers
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === "customers" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "customers" && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <Link
                    href="/case-studies"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Customer Stories
                  </Link>
                  <Link
                    href="/testimonials"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/verified-creators"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Verified Creators Directory
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="dropdown-container relative">
              <button
                onClick={(e) => toggleDropdown("resources", e)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Resources
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    activeDropdown === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <Link
                    href="/blog"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Resource Center
                  </Link>
                  <Link
                    href="/guides"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Guides & Reports
                  </Link>
                  <Link
                    href="/methodology"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Our Methodology
                  </Link>
                  <Link
                    href="/docs"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Documentation
                  </Link>
                  <Link
                    href="/help"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Help Center
                  </Link>
                </div>
              )}
            </div>

            {/* Pricing - Direct Link */}
            <Link
              href="/pricing"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Side CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/login")}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/get-started")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-sm transition-all hover:shadow-md"
            >
              Let&apos;s Talk
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {!isMobileMenuOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {/* Mobile Products */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
                  Products
                </div>
                <Link
                  href="/verify"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Course Verification
                </Link>
                <Link
                  href="/search"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Verified Course Directory
                </Link>
                <Link
                  href="/badge"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  VerifyLearn Badge
                </Link>
              </div>

              {/* Mobile Solutions */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
                  Solutions
                </div>
                <Link
                  href="/learners"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Course Buyers
                </Link>
                <Link
                  href="/creators"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Course Creators
                </Link>
                <Link
                  href="/platforms"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Platforms
                </Link>
              </div>

              {/* Mobile Resources */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2">
                  Resources
                </div>
                <Link
                  href="/blog"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resource Center
                </Link>
                <Link
                  href="/methodology"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Our Methodology
                </Link>
              </div>

              {/* Mobile CTAs */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/pricing"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => {
                    router.push("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-center rounded-full"
                  onClick={() => {
                    router.push("/get-started");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Let&apos;s Talk
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
