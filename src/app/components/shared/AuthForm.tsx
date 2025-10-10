"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Badge } from "@/ui/badge";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Shield, CheckCircle } from "lucide-react";

type Props = {
  redirectTo?: string;
};

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function AuthForm({ redirectTo }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Enterprise platform configuration
  const config = {
    title: "Enterprise Cultural Intelligence",
    subtitle: "Risk Management & Compliance Platform",
    icon: Shield,
    color: "emerald",
    description:
      "Access enterprise-grade cultural risk assessment and compliance tools",
    signupText: "Request Enterprise Access",
  };

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

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
      if (!userId) {
        throw new Error("No user returned from sign-in.");
      }

      // Check user profile and tenant relationship for enterprise schema
      const { data: userTenant, error: tenantError } = await supabase
        .from("user_tenants")
        .select(
          `
          role,
          tenant_id,
          organizations!inner(name, type, status)
        `
        )
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();

      if (tenantError) {
        console.error("Tenant lookup error:", tenantError);
        throw new Error("Access denied: No valid organization found.");
      }

      if (!userTenant) {
        throw new Error("Access denied: No organization access found.");
      }
      const organization = Array.isArray(userTenant.organizations)
        ? userTenant.organizations[0]
        : userTenant.organizations;
      // Check if organization is active
      if (
        organization?.status !== "active" &&
        organization?.status !== "trial"
      ) {
        throw new Error(
          "Organization access is suspended. Contact your administrator."
        );
      }

      // Route based on role - all users go to enterprise dashboard
      let destination = "/enterprise/dashboard";

      // Override with redirectTo if provided
      if (redirectTo) {
        destination = redirectTo;
      }

      // Store tenant context in session for dashboard
      sessionStorage.setItem("kalam_tenant_id", userTenant.tenant_id);
      sessionStorage.setItem("kalam_user_role", userTenant.role);

      toast.success(
        `Welcome to ${organization?.name || "Kalam AI Enterprise"}`
      );
      router.replace(destination);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in.";
      console.error("Login error:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            كلام
          </div>
          <span className="ml-3 text-3xl font-bold text-gray-900 self-center">
            AI
          </span>
        </div>
        <Badge className="mb-4 bg-emerald-100 text-emerald-700 px-4 py-2">
          Enterprise Platform
        </Badge>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div
          className={`bg-gradient-to-r ${
            config.color === "emerald"
              ? "from-emerald-600 to-emerald-700"
              : config.color === "blue"
              ? "from-blue-600 to-blue-700"
              : "from-slate-700 to-slate-800"
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

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white hover:border-gray-300"
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
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 bg-white hover:border-gray-300"
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
              disabled={loading}
              className={`w-full py-4 text-lg font-semibold ${
                config.color === "emerald"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : config.color === "blue"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-700 hover:bg-slate-800"
              } text-white shadow-lg transition-all duration-200 hover:transform hover:scale-105`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Need access?{" "}
              <Link
                href={`/enterprise/request-access`}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Request Enterprise Access
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                  SOC 2 Compliant
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                  GDPR Protected
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                  Enterprise Security
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Enterprise-grade cultural intelligence platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
