"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { UserType } from "@/lib/database.types";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  userType: UserType; // "guard" | "professional" (from ?type=)
  redirectTo?: string; // optional ?next=
};

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function AuthForm({ userType, redirectTo }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = userType === "guard" ? "Guard Sign In" : "Professional Sign In";

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

  // insert profile ONLY if missing; don’t clobber is_admin
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
        e instanceof Error ? e.message : "Failed to load data.";
      toast.error(errorMessage);
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextQ = redirectTo ? `&next=${encodeURIComponent(redirectTo)}` : "";

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
            autoComplete="current-password"
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
          {loading ? "Please wait…" : "Sign In"}
        </Button>
      </form>

      {/* ↓ Keep the “Don’t have an account?” footer, linking to your signup route */}
      <p className="text-center mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/signup?type=${userType}${nextQ}`}
          className="text-blue-600 hover:underline"
        >
          Create one
        </Link>
      </p>

      <p className="mt-4 text-xs text-slate-500 text-center">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
