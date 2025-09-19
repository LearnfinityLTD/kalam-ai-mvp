// app/api/admin/dashboard/route.ts
import { ServerAdminAccessControl } from "@/lib/admin-access-server";
import { NextResponse } from "next/server";
import {
  AdminContext,
  AnalyticsOverview,
  TimeMetrics,
  ROIMetrics,
  DepartmentStats,
  EmployeeData,
} from "@/app/types/admin";
import { createClient } from "@/lib/supabase-server";

interface DashboardAnalytics {
  overview: AnalyticsOverview;
  departmentStats: Record<string, DepartmentStats>;
  employees: unknown[];
  timeMetrics: TimeMetrics;
  roiMetrics: ROIMetrics;
}

interface DashboardResponse {
  adminContext: AdminContext;
  analytics: DashboardAnalytics;
  employees: EmployeeData[];
  success: boolean;
}

interface ErrorResponse {
  error: string;
}

export async function GET(
  request: Request
): Promise<NextResponse<DashboardResponse | ErrorResponse>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessControl = new ServerAdminAccessControl();
    const adminContext = await accessControl.getAdminContext(user.id);
    const analytics = await accessControl.getAnalytics(adminContext);
    const employees = await accessControl.getFilteredEmployees(adminContext);

    const response: DashboardResponse = {
      adminContext,
      analytics,
      employees: employees.slice(0, 20), // Limit for dashboard display
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to load admin dashboard" },
      { status: 500 }
    );
  }
}
