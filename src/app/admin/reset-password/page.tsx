// app/admin/reset-password/page.tsx
"use client";

import React, { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
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
  Key,
} from "lucide-react";

interface UserProfile {
  is_super_admin: boolean;
  needs_password_reset: boolean;
  full_name: string;
}

export default function AdminPasswordReset(): JSX.Element {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const router = useRouter();
  const supabase = createClient();

  // Check if user needs password reset
  useEffect(() => {
    checkPasswordResetRequired();
  }, []);

  const checkPasswordResetRequired = async (): Promise<void> => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Please sign in to reset your password");
        router.replace("/admin/signin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("is_super_admin, needs_password_reset, full_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        toast.error("Failed to load user profile");
        router.replace("/admin/signin");
        return;
      }

      setUserProfile(profile as UserProfile);

      // If password reset is not required, redirect to appropriate dashboard
      if (!profile?.needs_password_reset) {
        if (profile?.is_super_admin) {
          router.replace("/super-admin");
        } else {
          router.replace("/guards/admin");
        }
        return;
      }
    } catch (error) {
      console.error("Password reset check failed:", error);
      router.replace("/admin/signin");
    } finally {
      setChecking(false);
    }
  };

  const validatePassword = (
    password: string
  ): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return {
        isValid: false,
        message:
          "Password must contain at least one special character (!@#$%^&*)",
      };
    }
    return { isValid: true };
  };

  const handlePasswordReset = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message || "Invalid password");
      return;
    }

    setLoading(true);
    try {
      // Update password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) {
        throw new Error(passwordError.message || "Failed to update password");
      }

      // Mark password as reset
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Failed to get user information");
      }

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ needs_password_reset: false })
        .eq("id", user.id);

      if (updateError) {
        throw new Error("Failed to update password reset status");
      }

      toast.success("Password updated successfully!");

      // Redirect to appropriate dashboard
      if (userProfile?.is_super_admin) {
        router.replace("/super-admin");
      } else {
        router.replace("/guards/admin");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      toast.error(errorMessage);
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (password: string): string => {
    const validation = validatePassword(password);
    if (password.length === 0) return "bg-gray-200";
    if (!validation.isValid) return "bg-red-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (password: string): string => {
    const validation = validatePassword(password);
    if (password.length === 0) return "Enter password";
    if (!validation.isValid) return "Weak password";
    return "Strong password";
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
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
          <Badge className="mb-4 bg-amber-100 text-amber-700 px-4 py-2 border-amber-200">
            <Key className="w-3 h-3 mr-1" />
            Password Reset Required
          </Badge>
        </div>

        {/* Password Reset Card */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Welcome {userProfile?.full_name}! Please set a new secure password
              to continue.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPassword(e.target.value)
                    }
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={loading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Password strength indicator */}
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor(
                          newPassword
                        )}`}
                        style={{
                          width: newPassword.length > 0 ? "100%" : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {getPasswordStrengthText(newPassword)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfirmPassword(e.target.value)
                    }
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {newPassword === confirmPassword ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        newPassword === confirmPassword
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {newPassword === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  loading ||
                  newPassword !== confirmPassword ||
                  !validatePassword(newPassword).isValid
                }
                className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 hover:transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Update Password & Continue
                    <Shield className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /(?=.*[a-z])/.test(newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /(?=.*[A-Z])/.test(newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /(?=.*\d)/.test(newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  One number
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /(?=.*[!@#$%^&*])/.test(newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  One special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* Security Notice */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">
                    Security Notice
                  </h4>
                  <p className="text-xs text-blue-700">
                    This is a one-time password reset. After setting your new
                    password, you&apos;ll have full access to your admin
                    dashboard.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
