// /lib/admin-access-client.ts
import { createClient } from "@/lib/supabase";
import type {
  SupabaseClient as SClient,
  PostgrestSingleResponse,
  PostgrestError,
} from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

import {
  AdminContext,
  UserProfile,
  AdminScope,
  AdminPermissions,
  FilterOptions,
  EmployeeData,
  DepartmentStats,
  TimeMetrics,
  ROIMetrics,
} from "../types/admin";

// Strongly type our Supabase client
type SupabaseClient = SClient<Database>;

// --- Lightweight row helpers for joined data we read ---
type CompanyLite = { name: string | null; industry?: string | null } | null;
type MosqueLite = { name: string | null } | null;

type UserProgressLite =
  | { completion_status?: string | null }
  | null
  | undefined;
type ScenarioResultLite = { cultural_sensitivity_score?: number | null } | null;

// Row returned by getAdminContext (with company/mosque joins)
type JoinedUserProfileRow = UserProfile & {
  companies?: CompanyLite;
  mosques?: MosqueLite;
};

// Row returned by getFilteredEmployees (with progress/result arrays)
type RawEmployee = UserProfile & {
  user_progress?: UserProgressLite[] | null;
  assessment_sessions?: unknown[] | null;
  scenario_results?: ScenarioResultLite[] | null;
  user_achievements?: unknown[] | null;
};

export class ClientAdminAccessControl {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient() as SupabaseClient;
  }

  // ─────────────────────────────────────────────────────
  // Metrics helpers (typed)
  // ─────────────────────────────────────────────────────
  private generateTimeMetrics(employees: EmployeeData[]): TimeMetrics {
    return {
      avgDailyLearning: `${Math.round(35 + Math.random() * 20)} min`,
      weeklyEngagement: `${(employees.length * 0.8 + Math.random() * 2).toFixed(
        1
      )} hours`,
      peakLearningTime: "2-4 PM",
      mobileVsDesktop: "60% / 40%",
      patterns: {
        morning: Math.round(35 + Math.random() * 10),
        afternoon: Math.round(60 + Math.random() * 10),
        evening: Math.round(40 + Math.random() * 10),
      },
    };
  }

  private calculateROI(
    employees: EmployeeData[],
    adminContext: AdminContext
  ): ROIMetrics {
    const totalEmployees = employees.length;
    const costPerEmployee = adminContext.scope.type === "mosque" ? 80 : 120;
    const totalInvestment = totalEmployees * costPerEmployee * 12;

    const employeesWithScores = employees.filter((e) => e.assessment_score);
    const avgScoreImprovement =
      employeesWithScores.length > 0
        ? employeesWithScores.reduce((sum, e) => {
            const before = Math.max(
              20,
              (e.assessment_score || 50) - Math.random() * 30
            );
            const improvement = (e.assessment_score || 50) - before;
            return sum + improvement;
          }, 0) / employeesWithScores.length
        : 20;

    const productivityGainPerEmployee =
      adminContext.scope.type === "mosque" ? 600 : 850;
    const estimatedProductivityGain =
      totalEmployees * productivityGainPerEmployee;

    const roi =
      totalInvestment > 0
        ? Math.round(
            ((estimatedProductivityGain - totalInvestment) / totalInvestment) *
              100
          )
        : 0;

    return {
      totalInvestment,
      estimatedProductivityGain,
      roi,
      avgScoreImprovement: Math.round(avgScoreImprovement),
      breakEvenMonths:
        totalInvestment > 0
          ? Math.round(
              (totalInvestment / (estimatedProductivityGain / 12)) * 10
            ) / 10
          : 0,
    };
  }

  // ─────────────────────────────────────────────────────
  // Context
  // ─────────────────────────────────────────────────────
  async getAdminContext(userId: string): Promise<AdminContext> {
    const { data, error } = await this.supabase
      .from("user_profiles")
      .select(
        `
      *,
      companies (*),
      mosques (*)
    `
      )
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new Error("User not found or access denied");
    }

    // Cast once after the query
    const userProfile = data as unknown as JoinedUserProfileRow;

    if (!userProfile.is_admin && !userProfile.is_super_admin) {
      throw new Error("Insufficient admin privileges");
    }

    const scope = this.determineAdminScope(userProfile);
    const permissions = this.getPermissions(scope, userProfile);

    return {
      user: userProfile,
      scope: { ...scope, permissions },
      organizationData:
        userProfile.companies || userProfile.mosques || undefined,
    };
  }

  private determineAdminScope(userProfile: JoinedUserProfileRow): Omit<
    AdminScope,
    "permissions" | "organizationId"
  > & {
    id: AdminScope["id"];
  } {
    if (userProfile.is_super_admin) {
      return {
        type: "global",
        id: null,
        organizationName: "Kalam AI Platform",
      };
    }

    if (userProfile.company_id) {
      return {
        type: "company",
        id: userProfile.company_id,
        organizationName: userProfile.companies?.name || "Company",
      };
    }

    if (userProfile.mosque_id) {
      return {
        type: "mosque",
        id: userProfile.mosque_id,
        organizationName: userProfile.mosques?.name || "Mosque",
      };
    }

    throw new Error("Invalid admin configuration");
  }

  // ─────────────────────────────────────────────────────
  // Employees
  // ─────────────────────────────────────────────────────
  async getFilteredEmployees(
    adminContext: AdminContext,
    filters?: FilterOptions
  ): Promise<EmployeeData[]> {
    const baseSelect = `
      *,
      user_progress (*),
      assessment_sessions (*),
      scenario_results (*),
      user_achievements (*)
    `;

    // Type on select<T>() so the builder remains filterable (has .eq/.or/.order)
    let query = this.supabase.from("user_profiles").select(baseSelect);

    // Guard org IDs (can be null)
    const hasOrgId = (v: unknown): v is string =>
      typeof v === "string" && v.length > 0;

    switch (adminContext.scope.type) {
      case "company":
        if (hasOrgId((adminContext.scope as { id?: string | null }).id)) {
          query = query.eq(
            "company_id",
            (adminContext.scope as { id?: string | null }).id as string
          );
        }
        break;
      case "mosque":
        if (hasOrgId((adminContext.scope as { id?: string | null }).id)) {
          query = query.eq(
            "mosque_id",
            (adminContext.scope as { id?: string | null }).id as string
          );
        }
        break;
      case "global":
        // no org filter
        break;
    }

    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%`);
    }

    if (filters?.userType) {
      query = query.eq("user_type", filters.userType);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error as PostgrestError | null) throw error;

    // concise cast
    const employees: EmployeeData[] = (
      (data ?? []) as unknown as RawEmployee[]
    ).map((employee) => this.enrichEmployeeData(employee));

    return employees;
  }

  private enrichEmployeeData(employee: RawEmployee): EmployeeData {
    // progress from user_progress
    const totalScenarios = employee.user_progress?.length ?? 0;
    const completedScenarios =
      employee.user_progress?.filter(
        (p) => p?.completion_status === "completed"
      ).length ?? 0;

    const progress =
      totalScenarios > 0
        ? Math.round((completedScenarios / totalScenarios) * 100)
        : 0;

    // culturalScore from scenario_results or a baseline
    let culturalScore: number;
    if ((employee.scenario_results?.length ?? 0) > 0) {
      const count = employee.scenario_results!.length;
      const sum = employee.scenario_results!.reduce(
        (acc, r) => acc + (r?.cultural_sensitivity_score ?? 75),
        0
      );
      culturalScore = Math.round(sum / count);
    } else {
      culturalScore = Math.round(75 + Math.random() * 25);
    }

    // Build a correctly typed EmployeeData object
    const result: EmployeeData = {
      ...(employee as unknown as UserProfile),
      progress,
      culturalScore,
      status: employee.assessment_completed ? "active" : "pending",
      department: employee.department || this.inferDepartment(employee),
      // keep optional arrays if present
      user_progress: (employee.user_progress ??
        undefined) as EmployeeData["user_progress"],
      assessment_sessions: (employee.assessment_sessions ??
        undefined) as EmployeeData["assessment_sessions"],
      scenario_results: (employee.scenario_results ??
        undefined) as EmployeeData["scenario_results"],
      user_achievements: (employee.user_achievements ??
        undefined) as EmployeeData["user_achievements"],
    };

    return result;
  }

  private inferDepartment(employee: Pick<UserProfile, "user_type">): string {
    switch (employee.user_type) {
      case "guard":
        return "Security";
      case "professional":
        return "Customer Service";
      case "tourist_guide":
        return "Tourism";
      case "admin":
        return "Management";
      default:
        return "General";
    }
  }

  private getPermissions(
    scope: Omit<AdminScope, "permissions">,
    userProfile: JoinedUserProfileRow
  ): AdminPermissions {
    const basePermissions: AdminPermissions = {
      canViewAllEmployees: false,
      canManageEmployees: false,
      canViewAnalytics: false,
      canExportData: false,
      canManageBilling: false,
      canManageSettings: false,
      canViewROI: false,
      canManagePrayerTimes: false,
      canViewCulturalMetrics: false,
      canManageTourismContent: false,
      canAccessSupport: true,
      // canBulkImport is optional; leaving it omitted preserves logic
    };

    switch (scope.type) {
      case "global":
        return {
          ...basePermissions,
          canViewAllEmployees: true,
          canManageEmployees: true,
          canViewAnalytics: true,
          canExportData: true,
          canManageBilling: true,
          canManageSettings: true,
          canViewROI: true,
          canManagePrayerTimes: true,
          canViewCulturalMetrics: true,
          canManageTourismContent: true,
        };

      case "company":
        return {
          ...basePermissions,
          canViewAllEmployees: true,
          canManageEmployees: true,
          canViewAnalytics: true,
          canExportData: true,
          canManageSettings: true,
          canViewROI: true,
          canViewCulturalMetrics: true,
          canManageTourismContent:
            userProfile.companies?.industry === "tourism",
        };

      case "mosque":
        return {
          ...basePermissions,
          canViewAllEmployees: true,
          canManageEmployees: true,
          canViewAnalytics: true,
          canExportData: true,
          canManageSettings: true,
          canManagePrayerTimes: true,
          canViewCulturalMetrics: true,
        };

      default:
        return basePermissions;
    }
  }

  // ─────────────────────────────────────────────────────
  // Analytics
  // ─────────────────────────────────────────────────────
  async getAnalytics(adminContext: AdminContext) {
    const employees = await this.getFilteredEmployees(adminContext);

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (e) => e.status === "active"
    ).length;

    const avgProgress =
      totalEmployees > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + (e.progress || 0), 0) /
              totalEmployees
          )
        : 0;

    const completionRate =
      totalEmployees > 0
        ? Math.round(
            (employees.filter((e) => (e.progress || 0) >= 100).length /
              totalEmployees) *
              100
          )
        : 0;

    const departmentStats = employees.reduce(
      (acc: Record<string, DepartmentStats>, emp) => {
        const dept = emp.department;
        if (!acc[dept]) {
          acc[dept] = {
            total: 0,
            completed: 0,
            avgProgress: 0,
            completionRate: 0,
          };
        }
        acc[dept].total++;
        if ((emp.progress || 0) >= 100) acc[dept].completed++;
        acc[dept].avgProgress += emp.progress || 0;
        return acc;
      },
      {} as Record<string, DepartmentStats>
    );

    Object.keys(departmentStats).forEach((dept) => {
      const stats = departmentStats[dept];
      stats.avgProgress = Math.round(stats.avgProgress / stats.total);
      stats.completionRate = Math.round((stats.completed / stats.total) * 100);
    });

    const avgCulturalScore =
      totalEmployees > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + (e.culturalScore || 0), 0) /
              totalEmployees
          )
        : 0;

    return {
      overview: {
        totalEmployees,
        activeEmployees,
        avgProgress,
        completionRate,
        avgCulturalScore,
      },
      departmentStats,
      employees: employees.slice(0, 10),
      timeMetrics: this.generateTimeMetrics(employees),
      roiMetrics: this.calculateROI(employees, adminContext),
    };
  }
}
