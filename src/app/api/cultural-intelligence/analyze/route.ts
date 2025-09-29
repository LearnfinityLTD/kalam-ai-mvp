import { createServerSupabaseClient } from "@/lib/supabase-server";
import { validateInput, sanitizeText, hashUserId } from "@/lib/security";
import { culturalAnalysisEngine } from "@/lib/ai/culturalEngine";
import type { Database } from "@/lib/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";

type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type ClarityScoreInsert =
  Database["public"]["Tables"]["clarity_scores"]["Insert"];
type ClarityScoreRow = Database["public"]["Tables"]["clarity_scores"]["Row"];
type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];

// Add this function after your imports and type definitions
async function ensureUserExists(
  supabase: SupabaseClient<Database>,
  userId: string,
  tenantId: string
) {
  console.log(`Ensuring user exists: ${userId}, tenant: ${tenantId}`);

  try {
    // Check if organization exists
    const { data: orgExists, error: orgCheckError } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", tenantId)
      .single();

    if (orgCheckError || !orgExists) {
      console.log("Creating organization...");
      const { error: orgCreateError } = await supabase
        .from("organizations")
        .insert({
          id: tenantId,
          name: "Kalam AI Demo Organization",
          type: "enterprise",
          country: "Saudi Arabia",
          contact_email: "demo@kalam-ai.com",
          status: "active",
        });

      if (orgCreateError) {
        console.error("Failed to create organization:", orgCreateError);
      } else {
        console.log("Organization created successfully");
      }
    } else {
      console.log("Organization already exists");
    }

    // Check if user profile exists
    const { data: userExists, error: userCheckError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (userCheckError || !userExists) {
      console.log("User profile does not exist. User must authenticate first.");
      console.warn(
        "Skipping user profile creation - user must exist in auth.users first"
      );
    } else {
      console.log("User profile already exists");
    }

    // Check if user_tenant relationship exists
    const { data: tenantExists, error: tenantCheckError } = await supabase
      .from("user_tenants")
      .select("id")
      .eq("user_id", userId)
      .eq("tenant_id", tenantId)
      .single();

    if (tenantCheckError || !tenantExists) {
      console.log("Creating user_tenant relationship...");
      const { error: tenantCreateError } = await supabase
        .from("user_tenants")
        .insert({
          user_id: userId,
          tenant_id: tenantId,
          role: "employee",
          is_active: true,
        });

      if (tenantCreateError) {
        console.error("Failed to create user_tenant:", tenantCreateError);
      } else {
        console.log("User_tenant relationship created successfully");
      }
    } else {
      console.log("User_tenant relationship already exists");
    }
  } catch (error) {
    console.error("Error in ensureUserExists:", error);
  }
}

export async function POST(request: Request) {
  console.log("=== Cultural Analysis API Called ===");

  try {
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { userId, departmentId, messageText, tenantId } = body;

    // Enhanced validation with specific error messages
    if (!userId) {
      console.log("Missing userId");
      return Response.json(
        { success: false, error: "Missing userId" },
        { status: 400 }
      );
    }
    if (!tenantId) {
      console.log("Missing tenantId");
      return Response.json(
        { success: false, error: "Missing tenantId" },
        { status: 400 }
      );
    }
    if (!departmentId) {
      console.log("Missing departmentId");
      return Response.json(
        { success: false, error: "Missing departmentId" },
        { status: 400 }
      );
    }
    if (!messageText) {
      console.log("Missing messageText");
      return Response.json(
        { success: false, error: "Missing messageText" },
        { status: 400 }
      );
    }

    console.log("Basic validation passed, running validateInput...");

    if (!validateInput(userId, departmentId, messageText, tenantId)) {
      console.log("validateInput failed for:", {
        userId,
        tenantId,
        departmentId,
        messageTextLength: messageText.length,
      });
      return Response.json(
        {
          success: false,
          error: "Input validation failed - check UUID format",
        },
        { status: 400 }
      );
    }

    console.log("All validation passed, proceeding with analysis...");

    const sanitizedText = sanitizeText(messageText);
    console.log("Text sanitized, hashing user ID...");

    const anonymizedUserId = await hashUserId(userId);
    console.log("User ID hashed, connecting to Supabase...");

    const supabase = await createServerSupabaseClient();
    console.log("Supabase client created, inserting document...");

    await ensureUserExists(supabase, userId, tenantId);

    // Insert document record with proper typing and type assertion
    const documentData: DocumentInsert = {
      tenant_id: tenantId,
      user_id: userId,
      title: `Communication Analysis ${new Date().toISOString()}`,
      content: sanitizedText,
      document_type: "email",
      source_language: "en",
      target_audience: "internal",
      status: "analysis_pending",
      created_at: new Date().toISOString(),
    };

    const { data: document, error: docError } = (await supabase
      .from("documents")
      .insert(documentData)
      .select()
      .single()) as { data: DocumentRow | null; error: PostgrestError | null };

    if (docError) {
      console.error("Document creation error:", docError);
      return Response.json(
        {
          success: false,
          error: "Document creation failed",
          message: docError.message,
        },
        { status: 500 }
      );
    }

    if (!document) {
      return Response.json(
        {
          success: false,
          error: "Document creation failed",
          message: "No document returned",
        },
        { status: 500 }
      );
    }

    console.log("Document created successfully, running AI analysis...");

    // Run AI cultural analysis
    const analysisResult = await culturalAnalysisEngine.analyze({
      text: sanitizedText,
      senderId: anonymizedUserId,
      departmentId,
      tenantId,
    });

    console.log("AI analysis complete, storing results...");

    // Store analysis results with proper typing and type assertion
    const clarityData: ClarityScoreInsert = {
      tenant_id: tenantId,
      document_id: document.id,
      analyzed_by: userId,
      overall_clarity_score: Math.round(analysisResult.overallRisk),
      cultural_appropriateness_score: Math.round(
        analysisResult.culturalHierarchyRisk
      ),
      hierarchy_respect_score: Math.round(analysisResult.hierarchyScore),
      directness_balance_score: Math.round(analysisResult.directnessScore),
      formality_level_score: Math.round(analysisResult.formalityScore),
      risk_level:
        analysisResult.riskLevel as Database["public"]["Tables"]["clarity_scores"]["Insert"]["risk_level"],
      compliance_risk_score: Math.round(analysisResult.complianceRisk),
      identified_issues: analysisResult.issues,
      improvement_suggestions: analysisResult.suggestions,
      cultural_context_notes: analysisResult.culturalNotes,
      suggested_revisions: analysisResult.revisedText,
      analysis_model_version: "kalam-ai-v1.0",
      confidence_level: analysisResult.confidence,
      created_at: new Date().toISOString(),
    };

    const { data: clarityScore, error: scoreError } = (await supabase
      .from("clarity_scores")
      .insert(clarityData)
      .select()
      .single()) as {
      data: ClarityScoreRow | null;
      error: PostgrestError | null;
    };

    if (scoreError) {
      console.error("Clarity score creation error:", scoreError);
      return Response.json(
        {
          success: false,
          error: "Analysis storage failed",
          message: scoreError.message,
        },
        { status: 500 }
      );
    }

    if (!clarityScore) {
      return Response.json(
        {
          success: false,
          error: "Analysis storage failed",
          message: "No clarity score returned",
        },
        { status: 500 }
      );
    }

    console.log("Analysis stored successfully, creating audit log...");

    // Create audit log
    const auditData: AuditLogInsert = {
      tenant_id: tenantId,
      user_id: userId,
      action_type: "document_analysis",
      resource_type: "document",
      resource_id: document.id,
      action_description:
        "Cultural intelligence analysis performed on communication",
      risk_level:
        analysisResult.riskLevel as Database["public"]["Tables"]["audit_logs"]["Insert"]["risk_level"],
      regulatory_impact:
        analysisResult.riskLevel === "high" ||
        analysisResult.riskLevel === "critical",
      data_classification: "confidential",
      created_at: new Date().toISOString(),
    };

    await supabase.from("audit_logs").insert(auditData);

    // Update document status
    await supabase
      .from("documents")
      .update({
        status: "analyzed",
        analyzed_at: new Date().toISOString(),
      })
      .eq("id", document.id);

    console.log("=== Analysis completed successfully ===");

    return Response.json({
      success: true,
      analysisId: clarityScore.id,
      documentId: document.id,
      results: {
        overallRisk: analysisResult.overallRisk,
        culturalRisk: analysisResult.culturalHierarchyRisk,
        complianceRisk: analysisResult.complianceRisk,
        riskLevel: analysisResult.riskLevel,
        issues: analysisResult.issues,
        suggestions: analysisResult.suggestions,
        revisedText: analysisResult.revisedText,
        confidence: analysisResult.confidence,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("=== Cultural analysis error ===");
    console.error("Error details:", errorMessage);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    return Response.json(
      {
        success: false,
        error: "Analysis failed",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
