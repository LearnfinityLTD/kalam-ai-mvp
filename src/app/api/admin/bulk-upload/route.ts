import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { ServerAdminAccessControl } from "@/lib/admin-access-server";
import { AdminContext, UserType } from "@/app/types/admin";
import { SupabaseClient } from "@supabase/supabase-js"; // ✅ type supabase

// --- Request / Response types ---
interface BulkUploadRequest {
  csvData: string[][];
  options?: Record<string, string | number | boolean | null | undefined>; // ✅ safer than any
}

interface BulkUploadResult {
  successful: number;
  failed: number;
  details: Array<{
    email: string;
    status?: string;
    error?: string;
  }>;
}

interface BulkUploadResponse extends BulkUploadResult {
  success: boolean;
}

// --- POST handler ---
export async function POST(
  request: Request
): Promise<NextResponse<BulkUploadResponse | { error: string }>> {
  try {
    const body: BulkUploadRequest = await request.json();
    const { csvData, options } = body;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessControl = new ServerAdminAccessControl();
    const adminContext = await accessControl.getAdminContext(user.id);

    if (!adminContext.scope.permissions.canManageEmployees) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const results = await processBulkUpload(
      supabase,
      csvData,
      adminContext,
      options ?? {}
    );

    const response: BulkUploadResponse = {
      ...results,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Bulk upload failed" },
      { status: 500 }
    );
  }
}

// --- Processing function ---
async function processBulkUpload(
  supabase: SupabaseClient, // ✅ not any
  csvData: string[][],
  adminContext: AdminContext,
  options: Record<string, string | number | boolean | null | undefined> = {}
): Promise<BulkUploadResult> {
  const results: BulkUploadResult = {
    successful: 0,
    failed: 0,
    details: [],
  };

  // Skip header row
  const dataRows = csvData.slice(1);

  for (const row of dataRows) {
    try {
      const [fullName, email, department, userType, managerEmail] = row;

      // Validate user type based on admin scope
      const allowedUserTypes = getAllowedUserTypes(adminContext.scope.type);
      if (!allowedUserTypes.includes(userType as UserType)) {
        results.failed++;
        results.details.push({
          email,
          error: `User type '${userType}' not allowed for ${adminContext.scope.type} admins`,
        });
        continue;
      }

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        results.failed++;
        results.details.push({
          email,
          error: "Email already exists",
        });
        continue;
      }

      // Create user profile directly (simulating user creation)
      const userId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      const profileData = {
        id: userId,
        full_name: fullName,
        user_type: userType as UserType,
        department,
        assessment_completed: false,
        assessment_score: null,
        english_level: null,
        specialization: getSpecialization(userType as UserType),
        total_challenges_completed: 0,
        average_challenge_score: 0,
        ...(adminContext.scope.type === "company" && {
          company_id: adminContext.scope.id,
        }),
        ...(adminContext.scope.type === "mosque" && {
          mosque_id: adminContext.scope.id,
        }),
        is_admin: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert(profileData);

      if (profileError) {
        results.failed++;
        results.details.push({ email, error: profileError.message });
        continue;
      }

      // Send invitation email (simulated)
      await sendInvitationEmail(email, fullName, adminContext);

      results.successful++;
      results.details.push({ email, status: "success" });
    } catch (error) {
      results.failed++;
      results.details.push({
        email: row[1] || "unknown",
        error: (error as Error).message || "Unknown error",
      });
    }
  }

  return results;
}

// --- Helpers ---
function getAllowedUserTypes(scopeType: string): UserType[] {
  switch (scopeType) {
    case "mosque":
      return ["guard", "admin"];
    case "company":
      return ["professional", "tourist_guide", "guard", "admin"];
    case "global":
      return ["guard", "professional", "tourist_guide", "admin"];
    default:
      return [];
  }
}

function getSpecialization(userType: UserType): string {
  switch (userType) {
    case "guard":
      return "mosque_security";
    case "professional":
      return "business_communication";
    case "tourist_guide":
      return "tourist_guide";
    case "admin":
      return "management";
    default:
      return "general";
  }
}

async function sendInvitationEmail(
  email: string,
  fullName: string,
  adminContext: AdminContext
): Promise<void> {
  console.log(
    `Sending invitation to ${email} from ${adminContext.scope.organizationName}`
  );

  // In a real implementation, you would integrate with an email service
}
