"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building, Shield, Users } from "lucide-react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSolutionsMenu, setShowSolutionsMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSolutionsMenu(false);
      setIsMobileMenuOpen(false);
    };

    if (showSolutionsMenu || isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showSolutionsMenu, isMobileMenuOpen]);

  const solutions = [
    {
      type: "compliance",
      label: "Compliance & Risk",
      icon: Shield,
      color: "emerald",
      description: "Regulatory compliance automation",
    },
    {
      type: "nationalization",
      label: "Nationalization Programs",
      icon: Users,
      color: "blue",
      description: "Knowledge transfer acceleration",
    },
    {
      type: "enterprise",
      label: "Global Operations",
      icon: Building,
      color: "purple",
      description: "Enterprise-wide deployment",
    },
  ];

  const handleSolutionSelect = (solutionType: string) => {
    router.push(`/solutions/${solutionType}`);
    setShowSolutionsMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleDemo = () => {
    router.push("/demo-request");
    setIsMobileMenuOpen(false);
  };

  const handleEnterpriseLogin = () => {
    // Route to enterprise login - defaults to professional type for enterprise users
    router.push("/auth/signin");
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg"
          : "bg-slate-900/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg">
              كلام
            </div>
            <span className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold text-white">
              AI
            </span>
            <Badge className="ml-2 sm:ml-3 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs px-2 py-1">
              Enterprise
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            {/* Solutions Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSolutionsMenu(!showSolutionsMenu);
                }}
              >
                Solutions
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
              {showSolutionsMenu && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                  <div className="px-3 py-2 text-xs font-medium text-slate-400 border-b border-slate-700">
                    Choose your solution
                  </div>
                  {solutions.map((solution) => {
                    const IconComponent = solution.icon;
                    return (
                      <button
                        key={solution.type}
                        onClick={() => handleSolutionSelect(solution.type)}
                        className="w-full px-3 py-3 text-left hover:bg-slate-700 transition-colors flex items-start space-x-3"
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            solution.color === "emerald"
                              ? "text-emerald-400"
                              : solution.color === "blue"
                              ? "text-blue-400"
                              : "text-purple-400"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-white text-sm">
                            {solution.label}
                          </div>
                          <div className="text-xs text-slate-400">
                            {solution.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 text-sm font-medium"
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Pricing
            </Button>

            {/* Enterprise Login Button */}
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 text-sm font-medium"
              onClick={handleEnterpriseLogin}
            >
              Enterprise Login
            </Button>

            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 lg:px-6 py-2 text-sm font-medium"
              onClick={handleDemo}
            >
              Schedule Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
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
          <div className="sm:hidden border-t border-slate-700 bg-slate-900/95 backdrop-blur-md">
            <div className="px-2 pt-3 pb-3 space-y-3">
              {/* Mobile Solutions */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-400 px-2">
                  Solutions:
                </div>
                {solutions.map((solution) => {
                  const IconComponent = solution.icon;
                  return (
                    <Button
                      key={solution.type}
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 text-sm"
                      onClick={() => handleSolutionSelect(solution.type)}
                    >
                      <IconComponent className="h-5 w-5 mr-2" />
                      {solution.label}
                    </Button>
                  );
                })}
              </div>

              <div className="border-t border-slate-700 pt-3 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => router.push("/#pricing")}
                >
                  Pricing
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={handleEnterpriseLogin}
                >
                  Enterprise Login
                </Button>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-center"
                  onClick={handleDemo}
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
