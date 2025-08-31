// app/guards/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import GuardDashboard from "@/components/guards/GuardDashboard";
import Link from "next/link";

export default function GuardDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error) {
        console.error(error);
        setUserId(null);
      } else {
        setUserId(data.user?.id ?? null);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [supabase]);

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
          <h1 className="text-lg font-semibold mb-2">You’re signed out</h1>
          <p className="text-sm text-gray-600 mb-4">
            Please sign in to view your guard dashboard.
          </p>
          <Link
            href="/api/auth?type=guard"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuardDashboard userId={userId} />
    </div>
  );
}
