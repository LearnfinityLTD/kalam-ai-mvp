// app/auth/signup/page.tsx
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";

type UserType = "guard" | "guide" | "professional";
type Dialect = "gulf" | "egyptian" | "levantine" | "standard";

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

export default function SignUpPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
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
    return q === "guide" || q === "professional" ? q : "guard";
  }, [sp]);

  // DB constraint only allows guard | professional
  const dbUserType: "guard" | "professional" =
    userType === "guide" ? "guard" : userType;

  const [fullName, setFullName] = useState("");
  const [dialect, setDialect] = useState<Dialect>("standard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            user_type: dbUserType, // used by the trigger
            full_name: fullName || null,
            dialect: dbUserType === "professional" ? null : dialect,
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (authError) throw authError;

      // If your project auto-confirms users, data.user exists now; the trigger already wrote user_profiles.
      if (data.user?.id) {
        router.replace(
          dbUserType === "professional"
            ? "/professionals/dashboard"
            : "/guards/dashboard"
        );
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSignUp}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 space-y-6"
        noValidate
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Sign up as{" "}
          {userType === "guide"
            ? "Tour Guide"
            : userType === "guard"
            ? "Mosque Guard"
            : "Professional"}
        </h1>

        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          placeholder="Email Address"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          placeholder="Password (min 8 chars)"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {dbUserType === "guard" && (
          <Select
            value={dialect}
            onValueChange={(v) => setDialect(v as Dialect)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select dialect" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gulf">Gulf</SelectItem>
              <SelectItem value="egyptian">Egyptian</SelectItem>
              <SelectItem value="levantine">Levantine</SelectItem>
              <SelectItem value="standard">Standard Arabic</SelectItem>
            </SelectContent>
          </Select>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {notice && <p className="text-green-700 text-sm">{notice}</p>}

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto font-semibold"
            onClick={() => router.push(`/auth/signin?type=${userType}`)}
          >
            Sign in
          </Button>
        </p>
      </form>
    </main>
  );
}
