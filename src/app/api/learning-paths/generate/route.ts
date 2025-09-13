// app/api/learning-paths/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { generateAndSavePersonalizedPath } from "@/lib/ai-learning-path-generator";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate personalized learning path
    const recommendation = await generateAndSavePersonalizedPath(user.id);

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error) {
    console.error("Learning path generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate learning path" },
      { status: 500 }
    );
  }
}
