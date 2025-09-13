// app/guards/dashboard/page.tsx (Updated for new sidebar layout)
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import EnhancedGuardDashboard from "@/components/guards/EnhancedGuardDashboard";
import AssessmentWrapper from "@/components/assessment/AssessmentWrapper";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/button";

export default function GuardDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

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

        // Check if user has completed assessment
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("assessment_completed")
          .eq("id", data.user.id)
          .single();

        if (profile?.assessment_completed) {
          setShowDashboard(true);
        }
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
      router.replace("/");
    }
  };

  const handleAssessmentComplete = () => {
    setShowDashboard(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-lg text-gray-700 mt-6 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5V9m0 0V7m0 2h2m-2 0H10"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your personalized guard dashboard.
          </p>
          <Button
            onClick={() => router.replace("/auth/signin?type=guard")}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            size="lg"
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  // Show assessment wrapper if user hasn't completed assessment
  if (!showDashboard) {
    return (
      <AssessmentWrapper
        userId={userId}
        email={email ?? undefined}
        onAssessmentComplete={handleAssessmentComplete}
      />
    );
  }

  // Show the enhanced dashboard - it now handles its own layout completely
  // Including sidebar, header, and all content areas
  return (
    <EnhancedGuardDashboard
      userId={userId}
      email={email ?? undefined}
      onLogout={handleLogout}
    />
  );
}
