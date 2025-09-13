// app/auth/signup/page.tsx
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";
import {
  Shield,
  MapPin,
  Briefcase,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";

type UserType = "guard" | "tourist_guide" | "professional";
type Dialect = "gulf" | "egyptian" | "levantine" | "standard";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" />
      }
    >
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const supabase = createClient();
  const router = useRouter();
  const sp = useSearchParams();

  // Query param: guard | guide | professional
  const userType = useMemo<UserType>(() => {
    const q = sp.get("type");
    return q === "tourist_guide" || q === "professional" ? q : "guard";
  }, [sp]);

  // DB constraint only allows guard | professional
  const dbUserType: "guard" | "professional" =
    userType === "tourist_guide" ? "guard" : userType;

  const [fullName, setFullName] = useState("");
  const [dialect, setDialect] = useState<Dialect>("standard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Get user-specific configuration
  const getUserConfig = (type: UserType) => {
    switch (type) {
      case "guard":
        return {
          title: "Join as Mosque Host",
          subtitle: "Master tourist interactions with cultural confidence",
          icon: Shield,
          color: "green",
          benefits: [
            "Real tourist scenario practice",
            "Prayer-respectful timing",
            "Cultural context training",
            "Team progress tracking",
          ],
        };
      case "tourist_guide":
        return {
          title: "Join as Tour Guide",
          subtitle: "Lead international visitors with confidence",
          icon: MapPin,
          color: "amber",
          benefits: [
            "Ready-to-use tour scripts",
            "Crowd management tips",
            "Cultural briefing materials",
            "Flexible scheduling",
          ],
        };
      case "professional":
        return {
          title: "Join as Business Professional",
          subtitle: "Excel in international business communication",
          icon: Briefcase,
          color: "blue",
          benefits: [
            "Business meeting scenarios",
            "Industry-specific vocabulary",
            "Presentation skills training",
            "Corporate analytics",
          ],
        };
      default:
        return {
          title: "Join KalamAI",
          subtitle: "Start your learning journey",
          icon: Shield,
          color: "green",
          benefits: [],
        };
    }
  };

  const config = getUserConfig(userType);
  const IconComponent = config.icon;

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const validate = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if ((userType === "guard" || userType === "tourist_guide") && !dialect) {
      setError("Please select your Arabic dialect.");
      return false;
    }
    return true;
  };

  // Helper function to get the correct dashboard route
  const getDashboardRoute = (type: UserType) => {
    switch (type) {
      case "professional":
        return "/professionals/dashboard";
      case "tourist_guide":
        return "/guides/dashboard";
      case "guard":
      default:
        return "/guards/dashboard";
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    if (!validate()) {
      setLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            user_type: dbUserType, // used by the trigger
            full_name: fullName.trim() || null,
            dialect: dbUserType === "professional" ? null : dialect,
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (authError) throw authError;

      // If your project auto-confirms users, data.user exists now; the trigger already wrote user_profiles.
      if (data.user?.id) {
        // Use original userType for routing, not dbUserType
        router.replace(getDashboardRoute(userType));
        return;
      }

      // If email confirmation is ON, show guidance
      setNotice(
        "Check your inbox to confirm your email. After verifying, sign in to continue."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits (Hidden on mobile) */}
        <div className="hidden lg:block">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                كلام
              </div>
              <span className="ml-3 text-3xl font-bold text-gray-900 self-center">
                AI
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex justify-center mb-6">
              <IconComponent
                className={`h-12 w-12 ${
                  config.color === "green"
                    ? "text-green-600"
                    : config.color === "amber"
                    ? "text-amber-600"
                    : "text-blue-600"
                }`}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Why Choose KalamAI?
            </h2>

            <div className="space-y-4">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-green-800">
                <strong>14-day free trial</strong> - Experience the difference
                before you commit
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                كلام
              </div>
              <span className="ml-3 text-3xl font-bold text-gray-900 self-center">
                AI
              </span>
            </div>
            <Badge className="bg-green-100 text-green-700 px-4 py-2">
              Free Trial - No Credit Card Required
            </Badge>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${
                config.color === "green"
                  ? "from-green-500 to-green-600"
                  : config.color === "amber"
                  ? "from-amber-500 to-amber-600"
                  : "from-blue-500 to-blue-600"
              } p-6 text-white text-center`}
            >
              <div className="flex justify-center mb-3">
                <IconComponent className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
              <p className="text-white/90 text-sm">{config.subtitle}</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSignUp} className="space-y-6" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    placeholder="your.email@example.com"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white hover:border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Create a strong password (min 8 characters)"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white hover:border-gray-300"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {(userType === "guard" || userType === "tourist_guide") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Dialect
                    </label>
                    <Select
                      value={dialect}
                      onValueChange={(v) => setDialect(v as Dialect)}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white hover:border-gray-300">
                        <SelectValue placeholder="Select your Arabic dialect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gulf">Gulf Arabic</SelectItem>
                        <SelectItem value="egyptian">
                          Egyptian Arabic
                        </SelectItem>
                        <SelectItem value="levantine">
                          Levantine Arabic
                        </SelectItem>
                        <SelectItem value="standard">
                          Modern Standard Arabic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                )}

                {notice && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">
                      {notice}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-lg font-semibold ${
                    config.color === "green"
                      ? "bg-green-600 hover:bg-green-700"
                      : config.color === "amber"
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white shadow-lg transition-all duration-200 hover:transform hover:scale-105`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-semibold text-green-600 hover:text-green-700"
                    onClick={() => router.push(`/auth/signin?type=${userType}`)}
                    disabled={loading}
                  >
                    Sign in
                  </Button>
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Free Trial
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      No Credit Card
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      Cancel Anytime
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    By signing up, you agree to our Terms and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
