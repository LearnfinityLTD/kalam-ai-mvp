"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, MapPin, Briefcase } from "lucide-react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserTypeMenu, setShowUserTypeMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserTypeMenu(false);
      setIsMobileMenuOpen(false);
    };

    if (showUserTypeMenu || isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserTypeMenu, isMobileMenuOpen]);

  const userTypes = [
    {
      type: "guard",
      label: "Mosque Guard",
      icon: Shield,
      color: "green",
      description: "Welcome tourists & manage visits",
    },
    {
      type: "guide",
      label: "Tour Guide",
      icon: MapPin,
      color: "amber",
      description: "Lead cultural tours",
    },
  ];

  const handleSignIn = (userType: string) => {
    router.push(`/auth/signin?type=${userType}`);
    setShowUserTypeMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleStartTrial = () => {
    // Scroll to user selection section first
    const userSelection = document.getElementById("user-selection");
    if (userSelection) {
      userSelection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback to guards if section not found
      router.push("/auth/signin?type=guard");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg">
              كلام
            </div>
            <span className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold text-gray-900">
              AI
            </span>
            <Badge className="ml-2 sm:ml-3 bg-green-100 text-green-800 text-xs px-2 py-1">
              Beta
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            {/* Sign In Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserTypeMenu(!showUserTypeMenu);
                }}
              >
                Sign In
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>

              {/* Dropdown Menu */}
              {showUserTypeMenu && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    Choose your role
                  </div>
                  {userTypes.map((userType) => {
                    const IconComponent = userType.icon;
                    return (
                      <button
                        key={userType.type}
                        onClick={() => handleSignIn(userType.type)}
                        className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors flex items-start space-x-3"
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            userType.color === "green"
                              ? "text-green-600"
                              : userType.color === "amber"
                              ? "text-amber-600"
                              : "text-blue-600"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {userType.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {userType.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Business Professional Coming Soon */}
                  <div className="px-3 py-3 flex items-start space-x-3 opacity-60">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm flex items-center">
                        Business Professional
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Soon
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Corporate communications
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-4 lg:px-6 py-2 text-sm font-medium"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
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
          <div className="sm:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-3 pb-3 space-y-3">
              {/* Mobile Sign In Options */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 px-2">
                  Sign in as:
                </div>
                {userTypes.map((userType) => {
                  const IconComponent = userType.icon;
                  return (
                    <Button
                      key={userType.type}
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 justify-start text-sm"
                      onClick={() => handleSignIn(userType.type)}
                    >
                      <IconComponent
                        className={`h-5 w-5 ${
                          userType.color === "green"
                            ? "text-green-600"
                            : userType.color === "amber"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      />
                      {userType.label}
                    </Button>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white justify-center"
                  onClick={handleStartTrial}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
