// app/guards/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import GuardDashboard from "@/components/guards/GuardDashboard";
import { useRouter } from "next/navigation";

export default function GuardDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error || !data.user) {
        setUserId(null);
        setEmail(null);
      } else {
        setUserId(data.user.id);
        setEmail(data.user.email ?? null);
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/"); // always navigate away even if signOut throws
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <p className="text-sm text-gray-600">Loading your dashboard…</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h1 className="text-lg font-semibold mb-2">You&apos;re signed out</h1>
          <p className="text-sm text-gray-600 mb-4">
            Please sign in to view your guard dashboard.
          </p>
          <button
            onClick={() => router.replace("/auth/signin?type=guard")}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* THE ONE AND ONLY HEADER */}
      <header className="flex justify-between items-center bg-white shadow p-4">
        <div>
          <h1 className="text-lg font-semibold">Guard Dashboard</h1>
          {email && (
            <p className="text-sm text-gray-600">Signed in as {email}</p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        {/* Pass email only for display needs in child cards, but no header inside */}
        <GuardDashboard userId={userId} email={email ?? undefined} />
      </main>
    </div>
  );
}
