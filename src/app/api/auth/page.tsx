// app/auth/page.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { Button } from "@/ui/button";

const isUserType = (
  v: string | null
): v is "guard" | "professional" | "guide" =>
  v === "guard" || v === "professional" || v === "guide";

export default function AuthPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const type = useMemo(
    () =>
      isUserType(sp.get("type"))
        ? (sp.get("type") as "guard" | "professional" | "guide")
        : "guard",
    [sp]
  );

  const redirectByType =
    type === "guard"
      ? "/guards/dashboard"
      : type === "guide"
      ? "/guides/dashboard"
      : "/professionals/dashboard";

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
            onClick={() => router.replace("/api/auth?type=guide")}
          >
            Tour Guide
          </Button>
          <Button
            variant={type === "professional" ? "default" : "outline"}
            onClick={() => router.replace("/api/auth?type=professional")}
          >
            Professional
          </Button>
        </div>

        {/* Reuse your existing form; it handles sign in/up */}
        <AuthForm
          // Our AuthForm currently accepts only "guard" | "professional".
          // If you’ve already extended it to include "guide", pass `userType={type as any}`.
          userType={
            type === "guide"
              ? ("guard" as any)
              : (type as "guard" | "professional")
          }
          redirectTo={redirectByType}
        />
      </div>
    </main>
  );
}
