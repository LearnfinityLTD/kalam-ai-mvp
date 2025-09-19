// app/admin/signin/page.tsx - FIXED VERSION
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );
}

function AdminSignInContent() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkExistingSession = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Check if user is admin - FIXED: Added is_super_admin to select
        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("is_admin, user_type, is_super_admin, full_name")
          .eq("id", user.id)
          .single();

        if (!profileError && profile?.is_admin) {
          // User is already signed in as admin, redirect to appropriate dashboard
          if (profile?.is_super_admin) {
            router.replace("/super-admin");
          } else {
            router.replace("/api/admin");
          }
          return;
        }
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkExistingSession();
  }, [checkExistingSession]);

  const validateForm = () => {
    if (!EMAIL_RE.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password) {
      toast.error("Please enter your password");
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      console.log("Attempting signin with:", {
        email: email.trim().toLowerCase(),
        password: "***",
      });

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      console.log("Supabase auth response:", { data, error });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("invalid login credentials")) {
          throw new Error("Invalid email or password");
        }
        if (msg.includes("email not confirmed")) {
          throw new Error("Please confirm your email address");
        }
        throw error;
      }

      if (!data.user) {
        throw new Error("Authentication failed");
      }

      // Check admin privileges - FIXED: Added is_super_admin to select

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select(
          "is_admin, user_type, full_name, is_super_admin, needs_password_reset"
        )
        .eq("id", data.user.id)
        .single();

      if (profile?.needs_password_reset) {
        // Redirect to password reset page instead of dashboard
        router.replace("/admin/reset-password");
        return;
      }
      if (profileError) {
        throw new Error("Failed to verify admin access");
      }

      // FIXED: Check super admin first, then regular admin
      // FIXED: Check super admin first, then regular admin
      if (profile?.is_super_admin) {
        toast.success(`Welcome back, Super Admin!`);
        router.replace("/super-admin");
      } else if (profile?.is_admin) {
        toast.success(`Welcome back, ${profile.full_name || "Admin"}!`);
        router.replace("/api/admin"); // ← Unified admin page for ALL admin types
      } else {
        // Sign out the user since they don't have admin access
        await supabase.auth.signOut();
        throw new Error("Access denied: Admin privileges required");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      toast.error(errorMessage);
      console.error("Admin sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl">
              كلام
            </div>
            <span className="ml-3 text-3xl font-bold text-white self-center">
              AI
            </span>
          </div>
          <Badge className="mb-4 bg-red-100 text-red-700 px-4 py-2 border-red-200">
            <Lock className="w-3 h-3 mr-1" />
            Admin Access
          </Badge>
        </div>

        {/* Sign In Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Admin Sign In
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Access the administrative dashboard with your admin credentials
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email Address
                </label>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Access Admin Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">
                    Security Notice
                  </h4>
                  <p className="text-xs text-amber-700">
                    This is a restricted area. Only authorized administrators
                    should access this page. All login attempts are logged and
                    monitored.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Secure Login
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Encrypted
                </span>
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Monitored
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                By signing in, you agree to maintain confidentiality of admin
                data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Main Site */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminSignInContent />
    </Suspense>
  );
}
