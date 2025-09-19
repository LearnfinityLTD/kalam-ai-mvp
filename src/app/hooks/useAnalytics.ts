// /hooks/useAnalytics.ts - Updated with correct Supabase imports
import { useState, useCallback } from "react";
interface AnalyticsData {
  overview: {
    totalEmployees: number;
    activeEmployees: number;
    avgProgress: number;
    completionRate: number;
  };
  departmentStats: Record<string, number>;
  recentSessions: Array<{
    id: string;
    user_id: string;
    created_at: string;
    completion_rate: number;
  }>;
}

export const useAnalytics = (companyId: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/analytics?companyId=${companyId}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analytics");
      }

      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
  };
};
