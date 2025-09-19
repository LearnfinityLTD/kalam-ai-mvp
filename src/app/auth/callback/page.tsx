// app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  // Wrap useSearchParams usage in Suspense to satisfy Next.js CSR bailout rules
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center bg-gray-50">
          <p className="text-sm text-gray-600">Completing sign-in&hellip;</p>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}

function AuthCallbackInner() {
  const supabase = createClient();
  const router = useRouter();
  const sp = useSearchParams();

  const [status, setStatus] = useState<"working" | "ok" | "error">("working");

  const type = useMemo<"guard" | "professional" | "guide">(() => {
    const q = sp.get("type");
    return q === "professional" || q === "guide" ? q : "guard";
  }, [sp]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Handles OAuth / magic-link redirects (code in URL)
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) throw error;
        if (!mounted) return;

        setStatus("ok");

        const redirect =
          type === "professional"
            ? "/professionals/dashboard"
            : type === "guide"
            ? "/tour-guides/dashboard"
            : "/guards/dashboard";

        router.replace(redirect);
      } catch (err) {
        if (!mounted) return;
        setStatus("error");
        console.error(err instanceof Error ? err.message : err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router, supabase, type]);

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      {status === "working" && (
        <p className="text-sm text-gray-600">Completing sign-in&hellip;</p>
      )}
      {status === "ok" && (
        <p className="text-sm text-gray-600">Signed in. Redirecting&hellip;</p>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">
            We couldn&rsquo;t complete the sign-in.
          </p>
          <a href="/auth" className="text-green-700 underline">
            Go back to sign in
          </a>
        </div>
      )}
    </div>
  );
}
