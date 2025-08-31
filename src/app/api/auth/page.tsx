// app/auth/page.tsx
"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { Button } from "@/ui/button";

type UserTypeParam = "guard" | "professional" | "guide";

const isUserType = (v: string | null): v is UserTypeParam =>
  v === "guard" || v === "professional" || v === "guide";

export default function AuthPage() {
  // Wrap all usage of useSearchParams in Suspense
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <AuthPageInner />
    </Suspense>
  );
}

function AuthPageInner() {
  const sp = useSearchParams();
  const router = useRouter();

  const type = useMemo<UserTypeParam>(() => {
    const q = sp.get("type");
    return isUserType(q) ? q : "guard";
  }, [sp]);

  // Where to send user after auth based on selected type
  const redirectByType =
    type === "guard"
      ? "/guards/dashboard"
      : type === "guide"
      ? "/guides/dashboard"
      : "/professionals/dashboard";

  // AuthForm currently accepts only "guard" | "professional".
  // Map "guide" -> "guard" without using `any`.
  const mappedType: "guard" | "professional" =
    type === "guide" ? "guard" : type;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-md px-6 py-12">
        {/* Simple role switcher */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          <Button
            variant={type === "guard" ? "default" : "outline"}
            onClick={() => router.replace("/auth?type=guard")}
          >
            Mosque Guard
          </Button>
          <Button
            variant={type === "guide" ? "default" : "outline"}
            onClick={() => router.replace("/auth?type=guide")}
          >
            Tour Guide
          </Button>
          <Button
            variant={type === "professional" ? "default" : "outline"}
            onClick={() => router.replace("/auth?type=professional")}
          >
            Professional
          </Button>
        </div>

        {/* Reuse your existing form; it handles sign in/up */}
        <AuthForm userType={mappedType} redirectTo={redirectByType} />
      </div>
    </main>
  );
}
