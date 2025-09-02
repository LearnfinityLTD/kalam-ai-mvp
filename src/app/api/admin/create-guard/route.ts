// app/api/admin/create-guard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Admin client with service role key (server-side only)
const createAdminClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// Regular client for RLS-protected operations
const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
};

interface CreateGuardData {
  email: string;
  password: string;
  full_name: string;
  user_type: "guard" | "professional";
  dialect?: string | null;
  english_level?: string | null;
  mosque_id?: string | null;
  company_id?: string | null;
  is_admin?: boolean;
  assessment_completed?: boolean;
  assessment_score?: number | null;
  strengths?: string[];
  recommendations?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // 1. Verify the requesting user is authenticated and is an admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if user has admin privileges
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    // 3. Parse and validate request data
    const guardData: CreateGuardData = await request.json();

    // Basic validation
    if (!guardData.email || !guardData.password || !guardData.full_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (guardData.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 4. Check if email already exists
    const { data: existingUsers, error: listError } =
      await adminClient.auth.admin.listUsers();
    if (listError) {
      return NextResponse.json(
        { error: "Failed to check existing users" },
        { status: 500 }
      );
    }

    const emailExists = existingUsers.users.some(
      (u) => u.email === guardData.email
    );
    if (emailExists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // 5. Create user in auth.users using admin client
    const { data: authUser, error: authUserError } =
      await adminClient.auth.admin.createUser({
        email: guardData.email,
        password: guardData.password,
        email_confirm: true, // Skip email verification
      });

    if (authUserError || !authUser.user) {
      return NextResponse.json(
        {
          error: `Failed to create user: ${authUserError?.message}`,
        },
        { status: 500 }
      );
    }

    try {
      // 6. Create profile in user_profiles
      const profileData = {
        id: authUser.user.id,
        user_type: guardData.user_type,
        full_name: guardData.full_name,
        dialect: guardData.dialect || null,
        english_level: guardData.english_level || null,
        mosque_id: guardData.mosque_id || null,
        company_id: guardData.company_id || null,
        is_admin: guardData.is_admin || false,
        assessment_completed: guardData.assessment_completed || false,
        assessment_score: guardData.assessment_score || null,
        strengths: guardData.strengths || [],
        recommendations: guardData.recommendations || [],
      };

      const { error: profileInsertError } = await supabase
        .from("user_profiles")
        .insert(profileData);

      if (profileInsertError) {
        throw new Error(
          `Failed to create profile: ${profileInsertError.message}`
        );
      }

      // 7. Initialize user streak record
      const { error: streakError } = await supabase
        .from("user_streaks")
        .insert({
          user_id: authUser.user.id,
          current_streak: 0,
          longest_streak: 0,
          last_activity: null,
        });

      if (streakError) {
        console.warn("Failed to create streak record:", streakError);
        // Don't fail the whole operation for this
      }

      // 8. Create learning path if assessment is completed
      if (guardData.assessment_completed && guardData.english_level) {
        const { error: pathError } = await supabase
          .from("user_learning_paths")
          .insert({
            user_id: authUser.user.id,
            english_level: guardData.english_level,
            recommended_scenarios: [],
            completed_scenarios: [],
            current_scenario: null,
            progress_percentage: 0,
          });

        if (pathError) {
          console.warn("Failed to create learning path:", pathError);
          // Don't fail the whole operation for this
        }
      }

      return NextResponse.json(
        {
          success: true,
          user_id: authUser.user.id,
          message: "Guard created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      // Cleanup: delete the auth user if profile creation fails
      try {
        await adminClient.auth.admin.deleteUser(authUser.user.id);
      } catch (cleanupError) {
        console.error("Failed to cleanup auth user:", cleanupError);
      }

      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Create guard API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to fetch organizations
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    // Fetch organizations
    const [mosquesResult, companiesResult] = await Promise.all([
      supabase
        .from("mosques")
        .select("id, name, location, admin_email, status")
        .in("status", ["active", "trial"]),
      supabase
        .from("companies")
        .select("id, name, industry, admin_email, status")
        .in("status", ["active", "trial"]),
    ]);

    const organizations = [];

    if (mosquesResult.data) {
      organizations.push(
        ...mosquesResult.data.map((mosque) => ({
          id: mosque.id,
          name: mosque.name,
          type: "mosque",
          location: mosque.location,
          admin_email: mosque.admin_email,
          status: mosque.status,
        }))
      );
    }

    if (companiesResult.data) {
      organizations.push(
        ...companiesResult.data.map((company) => ({
          id: company.id,
          name: company.name,
          type: "company",
          industry: company.industry,
          admin_email: company.admin_email,
          status: company.status,
        }))
      );
    }

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Get organizations API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
