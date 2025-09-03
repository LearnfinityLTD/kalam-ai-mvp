// app/auth/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/shared/AuthForm";
import { Button } from "@/ui/button";
import { createClient } from "@/lib/supabase";

type UserTypeParam = "guard" | "professional" | "guide";
type DatabaseUserType = "guard" | "professional";

const isUserType = (v: string | null): v is UserTypeParam =>
  v === "guard" || v === "professional" || v === "guide";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" />
      }
    >
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

      // Handle routing for all user types including guides
      let dest: string;
      if (me?.user_type === "guard") {
        dest = me?.is_admin ? "/guards/admin" : "/guards/dashboard";
      } else if (type === "guide") {
        // Guides use guard routes but we differentiate in UI
        dest = "/guards/dashboard";
      } else {
        dest = "/professionals/dashboard";
      }

      setSignedInDest(next || dest);
      setChecking(false);
    })();
    return () => {
      cancel = true;
    };
  }, [supabase, next, type]);

  if (checking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </main>
    );
  }

  // Map 'guide' → 'guard' for the DB constraint, but preserve original type for display
  const mappedType: DatabaseUserType = type === "guide" ? "guard" : type;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* If already signed in, show banner instead of auto-redirect */}
        {signedInDest && (
          <div className="mb-6 rounded-xl border bg-white p-6 shadow-xl border-gray-100">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Welcome Back!
              </h3>
              <p className="text-sm text-gray-600">
                You&apos;re signed in
                {signedInEmail ? ` as ${signedInEmail}` : ""}.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.replace(signedInDest)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Continue to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSignedInEmail(null);
                  setSignedInDest(null);
                }}
                className="flex-1"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Pass both the mapped type for DB and original type for display */}
        <AuthForm
          userType={mappedType}
          displayType={type}
          redirectTo={next || undefined}
        />
      </div>
    </main>
  );
}
