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
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();

  const { type, next } = useMemo(() => {
    const t = sp.get("type");
    return {
      type: isUserType(t) ? t : "guard",
      next: sp.get("next") || null,
    };
  }, [sp]);

  const redirectByType =
    type === "guard"
      ? "/guards/dashboard"
      : type === "guide"
      ? "/guides/dashboard"
      : "/professionals/dashboard";

  // AuthForm expects 'guard' | 'professional' (DB constraint). Map once here.
  const mappedType: "guard" | "professional" =
    type === "guide" ? "guard" : type;

  const go = (t: UserTypeParam) => {
    const search = new URLSearchParams(sp.toString());
    search.set("type", t);
    if (next) search.set("next", next);
    router.replace(`/auth?${search.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-md px-6 py-12">
        <div className="mb-6 grid grid-cols-3 gap-2">
          <Button
            variant={type === "guard" ? "default" : "outline"}
            onClick={() => go("guard")}
          >
            Mosque Guard
          </Button>
          <Button
            variant={type === "guide" ? "default" : "outline"}
            onClick={() => go("guide")}
          >
            Tour Guide
          </Button>
          <Button
            variant={type === "professional" ? "default" : "outline"}
            onClick={() => go("professional")}
          >
            Professional
          </Button>
        </div>

        <AuthForm userType={mappedType} redirectTo={next || redirectByType} />
      </div>
    </main>
  );
}
