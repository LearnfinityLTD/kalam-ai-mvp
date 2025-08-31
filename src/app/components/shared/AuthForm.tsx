"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, TablesInsert } from "@/lib/supabase";
import type { UserType } from "@/lib/database.types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  userType: UserType; // must be 'guard' | 'professional' per your database.types
  redirectTo?: string; // optional override
};

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function AuthForm({ userType, redirectTo }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const title =
    mode === "signin"
      ? userType === "guard"
        ? "Guard Login"
        : "Professional Login"
      : userType === "guard"
      ? "Create Guard Account"
      : "Create Professional Account";

  const validate = useCallback(() => {
    if (!EMAIL_RE.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (mode === "signup" && password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }
    if (mode === "signin" && password.length === 0) {
      toast.error("Please enter your password.");
      return false;
    }
    return true;
  }, [email, password, mode]);

  /** Ensure user_profiles row exists */
  const upsertProfile = async (userId: string) => {
    const payload: TablesInsert<"user_profiles"> = {
      id: userId,
      user_type: userType,
    };

    const { error } = await supabase
      .from("user_profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) throw error;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { user_type: userType },
            emailRedirectTo:
              (
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
              ).replace(/\/$/, "") + "/auth/callback",
          },
        });
        if (error) throw error;
        toast.success("Check your email to verify your account, then sign in.");
        setMode("signin");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const userId = data.user?.id;
        if (userId) await upsertProfile(userId);

        toast.success("Signed in successfully.");
        router.replace(
          redirectTo ||
            (userType === "guard"
              ? "/guards/dashboard"
              : "/professionals/dashboard")
        );
      }
    } catch (err: any) {
      toast.error(
        err?.message ||
          "Something went wrong. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>

      <form onSubmit={handleAuth} className="space-y-4" noValidate>
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          disabled={loading}
        />

        <div className="relative">
          <Input
            type={showPw ? "text" : "password"}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Hide password" : "Show password"}
            disabled={loading}
          >
            {showPw ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait…" : mode === "signup" ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <p className="text-center mt-4 text-sm">
        {mode === "signin"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-green-600 hover:underline"
          disabled={loading}
        >
          {mode === "signin" ? "Sign Up" : "Sign In"}
        </button>
      </p>

      <p className="mt-4 text-xs text-slate-500 text-center">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
