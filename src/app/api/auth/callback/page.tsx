// app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const supabase = createClient();
  const router = useRouter();
  const sp = useSearchParams();
  const [status, setStatus] = useState<"working" | "ok" | "error">("working");
  const type = sp.get("type") || "guard";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Handles OAuth / magic-link redirects (code in URL)
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (error) throw error;
        if (!mounted) return;
        setStatus("ok");
        const redirect =
          type === "professional"
            ? "/professionals/dashboard"
            : type === "guide"
            ? "/guides/dashboard"
            : "/guards/dashboard";
        router.replace(redirect);
      } catch {
        setStatus("error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router, supabase, type]);

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      {status === "working" && (
        <p className="text-sm text-gray-600">Completing sign-in…</p>
      )}
      {status === "ok" && (
        <p className="text-sm text-gray-600">Signed in. Redirecting…</p>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">
            We couldn’t complete the sign-in.
          </p>
          <a href="/auth" className="text-green-700 underline">
            Go back to sign in
          </a>
        </div>
      )}
    </div>
  );
}
