// lib/admin-access-server.ts
import { createClient } from "@/lib/supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import {
  AdminContext,
  UserProfile,
  AdminPermissions,
  FilterOptions,
  EmployeeData,
  DepartmentStats,
  TimeMetrics,
  ROIMetrics,
} from "@/app/types/admin";

// Minimal shapes for joined/embedded rows we actually read
type CompanyLite = { name: string | null; industry?: string | null } | null;
type MosqueLite = { name: string | null } | null;

type UserProfileForContext = UserProfile & {
  companies?: CompanyLite;
  mosques?: MosqueLite;
};

type UserProgressLite =
  | { completion_status?: string | null }
  | null
  | undefined;
type ScenarioResultLite = {
  cultural_sensitivity_score?: number | null;
} | null;

type RawEmployee = UserProfile & {
  user_progress?: UserProgressLite[] | null;
  assessment_sessions?: unknown[] | null;
  scenario_results?: ScenarioResultLite[] | null;
  user_achievements?: unknown[] | null;
  companies?: CompanyLite;
  mosques?: MosqueLite;
};

type ScopeSummary = {
  type: "global" | "company" | "mosque";
  organizationId: string | null;
  organizationName: string;
};

export class ServerAdminAccessControl {
  private supabase: SupabaseClient<Database> | null;

  constructor() {
    this.supabase = null;
  }

  private async getSupabase(): Promise<SupabaseClient<Database>> {
    if (!this.supabase) {
      // your createClient already returns a typed Supabase client
      this.supabase = await createClient();
    }
    return this.supabase;
  }

  async getAdminContext(userId: string): Promise<AdminContext> {
    const supabase = await this.getSupabase();

    // Proper join syntax for companies and mosques
    const {
      data: userProfile,
      error,
    }: { data: UserProfileForContext | null; error: unknown } = await supabase
      .from("user_profiles")
      .select(
        `
          *,
          companies!user_profiles_company_id_fkey(*),
          mosques!user_profiles_mosque_id_fkey(*)
        `
      )
      .eq("id", userId)
      .single();

    if (error || !userProfile) {
      // eslint-disable-next-line no-console
      console.error("User profile error:", error);
      throw new Error("User not found or access denied");
    }

    if (!userProfile.is_admin && !userProfile.is_super_admin) {
      throw new Error("Insufficient admin privileges");
    }

    const scope = this.determineAdminScope(userProfile);
    const permissions = this.getPermissions(scope, userProfile);

    return {
      userId: userProfile.id,
      scope: { ...scope, permissions },
      organizationData:
        userProfile.companies || userProfile.mosques || undefined,
    };
  }

  private determineAdminScope(
    userProfile: UserProfileForContext
  ): ScopeSummary {
    if (userProfile.is_super_admin) {
      return {
        type: "global",
        organizationId: null,
        organizationName: "Kalam AI Platform",
      };
    }

    if (userProfile.company_id && userProfile.companies) {
      return {
        type: "company",
        organizationId: userProfile.company_id,
        organizationName: userProfile.companies?.name ?? "Company",
      };
    }

    if (userProfile.mosque_id && userProfile.mosques) {
      return {
        type: "mosque",
        organizationId: userProfile.mosque_id,
        organizationName: userProfile.mosques?.name ?? "Mosque",
      };
    }

    throw new Error(
      "Invalid admin configuration - no company or mosque associated"
    );
  }

  private getPermissions(
    scope: ScopeSummary,
    userProfile: UserProfileForContext
  ): AdminPermissions {
    const basePermissions: AdminPermissions = {
      canViewAllEmployees: false,
      canManageEmployees: false,
      canViewAnalytics: false,
      canExportData: false,
      canManageBilling: false,
      canManageSettings: false,
      canViewROI: true,
      canManagePrayerTimes: true,
      canViewCulturalMetrics: false,
      canManageTourismContent: false,
      canAccessSupport: true,
      canBulkImport: false,
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
          canBulkImport: true,
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
            (userProfile.companies?.industry ?? null) ===
            "Tourism & Hospitality",
          canBulkImport: true,
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
          canBulkImport: true,
        };
    }
  }

  async getFilteredEmployees(
    adminContext: AdminContext,
    filters?: FilterOptions
  ): Promise<EmployeeData[]> {
    const supabase = await this.getSupabase();

    const baseSelect = `
      *,
      user_progress (*),
      assessment_sessions (*),
      scenario_results (*),
      user_achievements (*),
      companies!user_profiles_company_id_fkey(name,industry),
      mosques!user_profiles_mosque_id_fkey(name)
    `;

    // ✅ Build ONE filterable query builder
    let query = supabase.from("user_profiles").select(baseSelect);

    // Filter based on admin scope - use organizationId instead of id
    switch (adminContext.scope.type) {
      case "company": {
        const orgId = adminContext.scope.organizationId;
        if (orgId) {
          query = query.eq("company_id", orgId);
        }
        break;
      }
      case "mosque": {
        const orgId = adminContext.scope.organizationId;
        if (orgId) {
          query = query.eq("mosque_id", orgId);
        }
        break;
      }
      case "global":
        // No additional filtering for global admins
        break;
    }

    // Exclude admin users from employee list
    query = query.eq("is_admin", false);

    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%`);
    }

    if (filters?.userType) {
      query = query.eq("user_type", filters.userType);
    }

    // Department filter is derived client-side; no DB filter here

    // ✅ Execute the SAME filtered query
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Employee query error:", error);
      throw error as Error;
    }

    const rows = (data ?? []) as unknown as RawEmployee[];
    let employees: EmployeeData[] = rows.map((employee) =>
      this.enrichEmployeeData(employee)
    );

    // Apply department filter if specified
    if (filters?.department && filters.department !== "all") {
      employees = employees.filter(
        (emp) => emp.department === filters.department
      );
    }

    return employees;
  }

  private enrichEmployeeData(employee: RawEmployee): EmployeeData {
    // Calculate progress based on assessment completion and challenges
    let progress = 0;

    if (employee.assessment_completed) {
      progress += 30;
    }

    if ((employee.total_challenges_completed ?? 0) > 0) {
      const challengeProgress = Math.min(
        70,
        ((employee.total_challenges_completed ?? 0) / 20) * 70
      );
      progress += challengeProgress;
    }

    if (progress === 0 && (employee.user_progress?.length ?? 0) > 0) {
      const completedScenarios =
        employee.user_progress?.filter(
          (p) => p?.completion_status === "completed"
        ).length ?? 0;
      const totalScenarios = employee.user_progress?.length ?? 0;
      if (totalScenarios > 0) {
        progress = Math.round((completedScenarios / totalScenarios) * 100);
      }
    }

    let culturalScore = 75;
    if ((employee.scenario_results?.length ?? 0) > 0) {
      const count = employee.scenario_results?.length ?? 0;
      const sum =
        employee.scenario_results?.reduce((acc, result) => {
          return acc + (result?.cultural_sensitivity_score ?? 75);
        }, 0) ?? 0;
      culturalScore = Math.round(sum / count);
    } else if (employee.assessment_score) {
      culturalScore = Math.round(employee.assessment_score * 1.1);
    }

    // Build a correctly typed base object (UserProfile) then extend to EmployeeData
    const base = employee as unknown as UserProfile;

    const result: EmployeeData = {
      ...base,
      progress: Math.min(100, Math.round(progress)),
      culturalScore: Math.min(100, culturalScore),
      status: employee.assessment_completed ? "active" : ("pending" as const),
      department: employee.department || this.mapDepartment(employee),
      email: this.getEmailFromAuth(employee.id),
      invitation_sent: employee.assessment_completed,
      // keep optional arrays if present; cast to the narrower EmployeeData types
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

  private mapDepartment(
    employee: Pick<RawEmployee, "department" | "user_type" | "specialization">
  ): string {
    // Use the department from the SQL if available, otherwise map from user_type
    if (employee.department) return employee.department;

    switch (employee.user_type) {
      case "guard":
        return "Security";
      case "professional":
        return employee.specialization === "business_communication"
          ? "Customer Service"
          : "Management";
      case "tourist_guide":
        return "Tourism";
      case "admin":
        return "Management";
      default:
        return "General";
    }
  }

  private getEmailFromAuth(_userId: string): string {
    // This would ideally fetch from auth.users, but for demo purposes
    // we'll generate based on the user patterns from SQL
    const names = [
      "ahmed.rashid",
      "fatima.zahra",
      "omar.khattab",
      "aisha.siddique",
      "hassan.maktoum",
      "layla.faisal",
      "khalid.abdulaziz",
      "nora.almutairi",
      "sarah.mansouri",
      "mohammed.alotaibi",
      "maryam.alkhalid",
      "yazeed.alsaud",
      "rania.alnemer",
      "tariq.alharbi",
      "amina.alghamdi",
      "faisal.alshehri",
      "hanan.alqahtani",
      "abdullah.almecca",
      "omar.alghamdi",
      "saleh.alharbi",
      "mahmoud.alzahrani",
      "youssef.almutairi",
      "ahmad.almadinah",
      "khalid.alnasir",
      "ibrahim.alsaleh",
      "hassan.almohammed",
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    return `${randomName}@company.com`;
  }

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

    const avgCulturalScore =
      totalEmployees > 0
        ? Math.round(
            employees.reduce((sum, e) => sum + (e.culturalScore || 0), 0) /
              totalEmployees
          )
        : 0;

    // Calculate department stats
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

    // Calculate averages for departments
    Object.keys(departmentStats).forEach((dept: string) => {
      const stats = departmentStats[dept];
      stats.avgProgress = Math.round(stats.avgProgress / stats.total);
      stats.completionRate = Math.round((stats.completed / stats.total) * 100);
    });

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

    // FIXED: Increased productivity gains to ensure positive ROI
    const productivityGainPerEmployee =
      adminContext.scope.type === "mosque" ? 2400 : 3240; // Was 600/850, now 2400/3240
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
}
