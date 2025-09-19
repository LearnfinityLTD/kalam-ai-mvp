import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { ServerAdminAccessControl } from "@/lib/admin-access-server";
import {
  AdminContext,
  AnalyticsOverview,
  DepartmentStats,
  TimeMetrics,
  ROIMetrics,
  EmployeeData,
} from "@/app/types/admin";
import { SupabaseClient } from "@supabase/supabase-js"; // ✅ to type supabase

// --- Session + Analytics Types ---
interface Session {
  created_at: string;
  session_duration?: number;
  user_profiles?: {
    company_id?: string;
    mosque_id?: string;
  };
}

interface DailyStats {
  [date: string]: {
    sessions: number;
    totalDuration: number;
  };
}

interface AnalyticsResponse {
  overview: AnalyticsOverview;
  departmentStats: Record<string, DepartmentStats>;
  employees: EmployeeData[];
  timeMetrics: TimeMetrics;
  roiMetrics: ROIMetrics;
  timeframed?: {
    dailyStats: DailyStats;
    totalSessions: number;
    avgSessionDuration: number;
  };
  adminContext: AdminContext;
  success: boolean;
}

// --- GET handler ---
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "30d";
    const metric = searchParams.get("metric") || "all";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessControl = new ServerAdminAccessControl();
    const adminContext = await accessControl.getAdminContext(user.id);

    if (!adminContext.scope.permissions.canViewAnalytics) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const analytics = await accessControl.getAnalytics(adminContext);
    const timeframedData = await getTimeframedAnalytics(
      supabase,
      adminContext,
      timeframe
    );

    const response: AnalyticsResponse = {
      ...analytics,
      timeframed: timeframedData,
      adminContext,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// --- Timeframed Analytics ---
async function getTimeframedAnalytics(
  supabase: SupabaseClient, // ✅ not any
  adminContext: AdminContext,
  timeframe: string
): Promise<{
  dailyStats: DailyStats;
  totalSessions: number;
  avgSessionDuration: number;
}> {
  const now = new Date();
  let startDate: Date;

  switch (timeframe) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  let baseQuery = supabase
    .from("learning_sessions")
    .select(
      `
      *,
      user_profiles!inner (
        company_id,
        mosque_id
      )
    `
    )
    .gte("created_at", startDate.toISOString());

  if (adminContext.scope.type === "company") {
    baseQuery = baseQuery.eq("user_profiles.company_id", adminContext.scope.id);
  } else if (adminContext.scope.type === "mosque") {
    baseQuery = baseQuery.eq("user_profiles.mosque_id", adminContext.scope.id);
  }

  const { data: sessions } = await baseQuery;
  const typedSessions: Session[] = sessions || [];

  const dailyStats: DailyStats = typedSessions.reduce(
    (acc: DailyStats, session: Session) => {
      const date = session.created_at.split("T")[0];
      if (!acc[date]) {
        acc[date] = { sessions: 0, totalDuration: 0 };
      }
      acc[date].sessions++;
      acc[date].totalDuration += session.session_duration || 0;
      return acc;
    },
    {}
  );

  return {
    dailyStats,
    totalSessions: typedSessions.length,
    avgSessionDuration: typedSessions.length
      ? Math.round(
          typedSessions.reduce((sum, s) => sum + (s.session_duration || 0), 0) /
            typedSessions.length
        )
      : 0,
  };
}
