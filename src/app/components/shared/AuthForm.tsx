"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Shield,
  MapPin,
  Briefcase,
  CheckCircle,
} from "lucide-react";

type Props = {
  userType: "guard" | "professional"; // For database operations
  displayType?: "guard" | "professional" | "guide"; // For UI display
  redirectTo?: string;
};

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function AuthForm({ userType, displayType, redirectTo }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeForTitle = displayType || userType;

  // Get user-specific configuration
  const getUserConfig = (type: string) => {
    switch (type) {
      case "guard":
        return {
          title: "Mosque Host Sign In",
          subtitle: "Welcome back! Continue your English learning journey",
          icon: Shield,
          color: "green",
          description:
            "Access your personalized mosque scenarios and tourist interaction practice",
          signupText: "Join as Mosque Host",
        };
      case "guide":
        return {
          title: "Tour Guide Sign In",
          subtitle: "Welcome back! Lead with confidence",
          icon: MapPin,
          color: "amber",
          description:
            "Access your tour guide scenarios and cultural communication tools",
          signupText: "Join as Tour Guide",
        };
      case "professional":
        return {
          title: "Business Professional Sign In",
          subtitle: "Welcome back! Excel in international business",
          icon: Briefcase,
          color: "blue",
          description:
            "Access your business scenarios and professional communication training",
          signupText: "Join as Professional",
        };
      default:
        return {
          title: "Sign In",
          subtitle: "Welcome back!",
          icon: Shield,
          color: "green",
          description: "Continue your learning journey",
          signupText: "Create Account",
        };
    }
  };

  const config = getUserConfig(typeForTitle);
  const IconComponent = config.icon;

  const validate = useCallback(() => {
    if (!EMAIL_RE.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return false;
    }
    return true;
  }, [email, password]);

  // insert profile ONLY if missing; don't clobber is_admin
  const ensureProfile = async (userId: string) => {
    const { data: existing, error: existErr } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (existErr) throw existErr;

    if (!existing) {
      const { error: insertErr } = await supabase.from("user_profiles").insert({
        id: userId,
        user_type: userType,
        is_admin: false,
      });
      if (insertErr) throw insertErr;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("invalid login credentials")) {
          throw new Error("Incorrect email or password.");
        }
        if (msg.includes("email not confirmed")) {
          throw new Error(
            "Please confirm your email via the link we emailed you."
          );
        }
        throw error;
      }

      const userId = data.user?.id;
      if (!userId) throw new Error("No user returned from sign-in.");

      await ensureProfile(userId);

      // read profile to decide admin vs normal destination
      const { data: me, error: meErr } = await supabase
        .from("user_profiles")
        .select("user_type, is_admin")
        .eq("id", userId)
        .maybeSingle();
      if (meErr) throw meErr;

      const computedDest =
        userType === "guard"
          ? me?.is_admin
            ? "/guards/admin"
            : "/guards/dashboard"
          : "/professionals/dashboard";

      router.replace(redirectTo || computedDest);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in.";
      toast.error(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextQ = redirectTo ? `&next=${encodeURIComponent(redirectTo)}` : "";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            كلام
          </div>
          <span className="ml-3 text-3xl font-bold text-gray-900 self-center">
            AI
          </span>
        </div>
        <Badge className="mb-4 bg-green-100 text-green-700 px-4 py-2">
          Secure Login
        </Badge>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
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

        {/* Form Section */}
        <div className="p-8">
          <p className="text-gray-600 text-sm mb-6 text-center">
            {config.description}
          </p>

          <div onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
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
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white hover:border-gray-300"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPw ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              onClick={handleAuth}
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
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={`/auth/signup?type=${displayType || userType}${nextQ}`}
                className="font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                {config.signupText}
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Secure
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Privacy Protected
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                By continuing, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
