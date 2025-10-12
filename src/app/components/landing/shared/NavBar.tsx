"use client";
import React from "react";
import { useEffect, useState } from "react";
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
        isScrolled ? "" : ""
      }`}
    >
      {/* Navigation - contained and rounded */}
      <nav className="relative mt-8 max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-full px-8 shadow-sm">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center h-full py-3 mt-3">
            <div className="relative w-44 h-40">
              <Image
                src="/logo.png"
                alt="Verify Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Products Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => toggleDropdown("products", e)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer text-sm"
              >
                <span className="font-medium">Products</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "products" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {/* <Link
                    href="/products/course-verification"
                    className="block mb-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Course Verification
                    </h3>
                    <p className="text-sm text-gray-600">
                      Independent quality assessment
                    </p>
                  </Link>
                  <Link href="/verified-courses" className="block mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Verified Course Directory
                    </h3>
                    <p className="text-sm text-gray-600">
                      Browse certified courses
                    </p>
                  </Link>
                  <Link
                    href="/products/verifylearn-badge"
                    className="block mb-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      VerifyLearn Badge
                    </h3>
                    <p className="text-sm text-gray-600">
                      Trust seal for your courses
                    </p>
                  </Link>
                  <Link href="/products/platform-api" className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Platform API
                    </h3>
                    <p className="text-sm text-gray-600">
                      Integration for platforms
                    </p>
                  </Link> */}
                  <Link
                    href="/products/course-verification"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Course Verification
                  </Link>
                  <Link
                    href="/verified-courses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Verified Course Directory
                  </Link>
                  <Link
                    href="/products/verifylearn-badge"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    VerifyLearn Badge
                  </Link>
                  <Link
                    href="/products/platform-ap"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Platform API
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => toggleDropdown("solutions", e)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer text-sm"
              >
                <span className="font-medium">Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/solutions/education"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Education
                  </Link>
                  <Link
                    href="/solutions/healthcare"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Healthcare
                  </Link>
                  <Link
                    href="/solutions/enterprise"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Enterprise
                  </Link>
                </div>
              )}
            </div>

            {/* Customers Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => toggleDropdown("customers", e)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer text-sm"
              >
                <span className="font-medium">Customers</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "customers" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/customers/case-studies"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Case Studies
                  </Link>
                  <Link
                    href="/customers/testimonials"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/customers/success-stories"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Success Stories
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={(e) => toggleDropdown("resources", e)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 cursor-pointer text-sm"
              >
                <span className="font-medium">Resources</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/resources/blog"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/resources/documentation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Documentation
                  </Link>
                  <Link
                    href="/resources/support"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Support
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Pricing
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Login
            </Link>
            <Link href="/contact">
              <button className="px-5 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors text-sm">
                Let&apos;s Talk
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
