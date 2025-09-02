// services/guardService.ts
import { createClient } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type UserProfile = Tables["user_profiles"]["Insert"];
type UserType = "guard" | "professional";
type Dialect = "gulf" | "egyptian" | "levantine" | "standard";
type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface CreateGuardData {
  // Auth data
  email: string;
  password: string;

  // Profile data
  full_name: string;
  user_type: UserType;
  dialect?: Dialect | null;
  english_level?: EnglishLevel | null;

  // Organization assignment
  mosque_id?: string | null;
  company_id?: string | null;

  // Admin settings
  is_admin?: boolean;

  // Assessment data
  assessment_completed?: boolean;
  assessment_score?: number | null;
  strengths?: string[];
  recommendations?: string[];
}

export interface Organization {
  id: string;
  name: string;
  type: "mosque" | "company";
  admin_email?: string;
  location?: string;
  industry?: string;
}

class GuardService {
  private supabase = createClient();

  /**
   * Create a new guard user with profile via API route
   */
  async createGuard(
    data: CreateGuardData
  ): Promise<{ success: boolean; user_id?: string; error?: string }> {
    try {
      console.log("Creating guard via API...", {
        email: data.email,
        full_name: data.full_name,
      });

      const response = await fetch("/api/admin/create-guard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Include cookies for authentication
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      console.log("✅ Guard created successfully:", result);

      return {
        success: true,
        user_id: result.user_id,
      };
    } catch (error: unknown) {
      console.error("Guard creation failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Fetch all organizations (mosques and companies) via API
   */
  async fetchOrganizations(): Promise<Organization[]> {
    try {
      const response = await fetch("/api/admin/create-guard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch organizations:", response.status);
        return [];
      }

      const result = await response.json();
      return result.organizations || [];
    } catch (error) {
      console.error("Error fetching organizations:", error);
      return [];
    }
  }

  /**
   * Validate guard data before creation
   */
  validateGuardData(data: CreateGuardData): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Email validation
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.push("Valid email address is required");
    }

    // Password validation
    if (!data.password || data.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    // Full name validation
    if (!data.full_name || data.full_name.trim().length === 0) {
      errors.push("Full name is required");
    }

    // Assessment validation
    if (data.assessment_completed) {
      if (
        !data.assessment_score ||
        data.assessment_score < 0 ||
        data.assessment_score > 100
      ) {
        errors.push(
          "Assessment score must be between 0 and 100 when assessment is marked as completed"
        );
      }
    }

    // Organization validation (can't have both mosque and company)
    if (data.mosque_id && data.company_id) {
      errors.push("Cannot assign to both mosque and company");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.admin.listUsers();

      if (error) {
        console.error("Error checking email existence:", error);
        return false;
      }

      return data.users.some((user) => user.email === email);
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  }

  /**
   * Get guard statistics for validation
   */
  async getGuardStats(): Promise<{
    total: number;
    active: number;
    withAssessment: number;
  }> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("id, assessment_completed, created_at")
        .eq("user_type", "guard");

      if (error) {
        console.error("Error fetching guard stats:", error);
        return { total: 0, active: 0, withAssessment: 0 };
      }

      const total = data?.length || 0;
      const withAssessment =
        data?.filter((guard) => guard.assessment_completed).length || 0;

      // Consider guards active if created in last 30 days (simple heuristic)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const active =
        data?.filter((guard) => new Date(guard.created_at) > thirtyDaysAgo)
          .length || 0;

      return { total, active, withAssessment };
    } catch (error) {
      console.error("Error fetching guard stats:", error);
      return { total: 0, active: 0, withAssessment: 0 };
    }
  }
}

export const guardService = new GuardService();
