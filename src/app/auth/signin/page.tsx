// app/auth/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { Button } from "@/ui/button";
import { createClient } from "@/lib/supabase";

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
  const supabase = useMemo(() => createClient(), []);

  const { type, next } = useMemo(() => {
    const t = sp.get("type");
    return {
      type: isUserType(t) ? t : "guard",
      next: sp.get("next") || null,
    };
  }, [sp]);

  // Session + profile (for banner only; NO auto-redirect)
  const [checking, setChecking] = useState(true);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [signedInDest, setSignedInDest] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancel) setChecking(false);
        return;
      }
      setSignedInEmail(user.email ?? null);

      const { data: me } = await supabase
        .from("user_profiles")
        .select("user_type, is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (cancel) return;

      const dest =
        me?.user_type === "guard"
          ? me?.is_admin
            ? "/guards/admin"
            : "/guards/dashboard"
          : "/professionals/dashboard";

      setSignedInDest(next || dest);
      setChecking(false);
    })();
    return () => {
      cancel = true;
    };
  }, [supabase, next]);

  if (checking) return <main className="min-h-screen bg-gray-50" />;

  // Map ‘guide’ → ‘guard’ for the DB constraint expected by AuthForm
  const mappedType: "guard" | "professional" =
    type === "guide" ? "guard" : type;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-md px-6 py-12">
        {/* If already signed in, show banner instead of auto-redirect */}
        {signedInDest && (
          <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-700">
              You’re signed in{signedInEmail ? ` as ${signedInEmail}` : ""}.
            </p>
            <div className="mt-3 flex gap-2">
              <Button onClick={() => router.replace(signedInDest)}>
                Continue to dashboard
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSignedInEmail(null);
                  setSignedInDest(null);
                  // stay on /auth so user can log in
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        )}

        {/* Do NOT pass a default redirect; AuthForm will compute based on profile */}
        <AuthForm userType={mappedType} redirectTo={next || undefined} />
      </div>
    </main>
  );
}
