// src/app/api/cultural-intelligence/intervention/route.ts
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/lib/database.types";
import type { PostgrestError } from "@supabase/supabase-js";

// Define type aliases for better readability
type AnalyticsMetricInsert =
  Database["public"]["Tables"]["analytics_metrics"]["Insert"];
type AnalyticsMetricRow =
  Database["public"]["Tables"]["analytics_metrics"]["Row"];
type ClarityScoreRow = Database["public"]["Tables"]["clarity_scores"]["Row"];
type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];
type ClarityScoreUpdate =
  Database["public"]["Tables"]["clarity_scores"]["Update"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { analysisId, decision, tenantId, userId } = body;

    // Input validation
    if (!analysisId || !decision || !tenantId || !userId) {
      return Response.json(
        {
          success: false,
          decision: "rejected",
          riskReduction: 0,
          monetaryImpact: 0,
          message:
            "Missing required parameters: analysisId, decision, tenantId, userId",
        },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected"].includes(decision)) {
      return Response.json(
        {
          success: false,
          decision: "rejected",
          riskReduction: 0,
          monetaryImpact: 0,
          message: "Invalid decision value. Must be 'accepted' or 'rejected'",
        },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get original analysis with better error handling
    const { data: clarityScore, error: fetchError } = await supabase
      .from("clarity_scores")
      .select("*")
      .eq("id", analysisId)
      .eq("tenant_id", tenantId)
      .single();

    if (fetchError) {
      console.error("Analysis fetch error:", fetchError);
      return Response.json(
        {
          success: false,
          decision: "rejected",
          riskReduction: 0,
          monetaryImpact: 0,
          message: `Failed to fetch analysis: ${fetchError.message}`,
        },
        { status: 404 }
      );
    }

    if (!clarityScore) {
      return Response.json(
        {
          success: false,
          decision: "rejected",
          riskReduction: 0,
          monetaryImpact: 0,
          message: "Analysis not found",
        },
        { status: 404 }
      );
    }

    // Type assertion for the clarity score
    const typedClarityScore = clarityScore as ClarityScoreRow;

    // Calculate metrics with safer property access
    const originalRisk = typedClarityScore.overall_clarity_score || 0;
    const confidenceLevel = typedClarityScore.confidence_level || 0.85;
    const riskLevel = typedClarityScore.risk_level || "unknown";

    const riskReduction =
      decision === "accepted" ? Math.round(originalRisk * 0.84) : 0;
    const monetaryImpact =
      decision === "accepted"
        ? Math.round((originalRisk / 100) * 5000)
        : -Math.round((originalRisk / 100) * 5000);

    // Insert metrics record with proper Supabase typing
    const metricsData: AnalyticsMetricInsert = {
      tenant_id: tenantId,
      metric_type: "risk_reduction",
      metric_name:
        decision === "accepted"
          ? "Cultural Risk Successfully Mitigated"
          : "Unmitigated Cultural Risk Exposure",
      metric_value: monetaryImpact,
      metric_unit: "USD",
      department: "UNKNOWN",
      time_period: "monthly",
      calculation_method: `AI intervention ${decision} * average incident cost`,
      data_source: "cultural_intelligence_engine",
      confidence_level: confidenceLevel,
      recorded_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    };

    const { data: metric, error: metricError } = (await supabase
      .from("analytics_metrics")
      .insert(metricsData)
      .select()
      .single()) as {
      data: AnalyticsMetricRow | null;
      error: PostgrestError | null;
    };

    if (metricError) {
      console.error("Metric creation error:", metricError);
      return Response.json(
        {
          success: false,
          decision: "rejected",
          riskReduction: 0,
          monetaryImpact: 0,
          message: `Failed to record metrics: ${metricError.message}`,
        },
        { status: 500 }
      );
    }

    // Create audit log for intervention decision with proper Supabase typing
    const auditData: AuditLogInsert = {
      tenant_id: tenantId,
      user_id: userId,
      action_type: "user_management", // Using available ActionType from your schema
      resource_type: "analytics",
      resource_id: analysisId,
      action_description: `Cultural intervention ${decision} by user`,
      risk_level:
        riskLevel as Database["public"]["Tables"]["audit_logs"]["Insert"]["risk_level"],
      regulatory_impact: decision === "rejected",
      data_classification: "confidential",
      created_at: new Date().toISOString(),
    };

    const { error: auditError } = await supabase
      .from("audit_logs")
      .insert(auditData);

    if (auditError) {
      console.warn("Audit log creation failed:", auditError);
      // Don't fail the request for audit log errors
    }

    // Update the clarity score with intervention decision using proper Supabase typing
    const updateData: ClarityScoreUpdate = {
      // Note: intervention_decision field doesn't exist in your schema
      // You'll need to add it or use existing fields
      cultural_context_notes: `Intervention ${decision} at ${new Date().toISOString()}`,
    };

    const { error: updateError } = await supabase
      .from("clarity_scores")
      .update(updateData)
      .eq("id", analysisId);

    if (updateError) {
      console.warn("Clarity score update failed:", updateError);
      // Don't fail the request for update errors
    }

    return Response.json({
      success: true,
      decision: decision,
      riskReduction: riskReduction,
      monetaryImpact: monetaryImpact,
      message:
        decision === "accepted"
          ? "Intervention accepted - Risk successfully mitigated"
          : "Intervention rejected - Risk exposure maintained",
      metricId: metric?.id,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Intervention decision error:", errorMessage);

    return Response.json(
      {
        success: false,
        decision: "rejected",
        riskReduction: 0,
        monetaryImpact: 0,
        message: "Failed to process decision - Internal server error",
      },
      { status: 500 }
    );
  }
}
