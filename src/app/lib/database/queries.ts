// /lib/database/queries.ts
// Prepared statements for executive dashboard with proper typing

import { RiskLevel } from "@/app/types/api";
import { createClient } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

interface RiskMatrixData {
  risk_level: RiskLevel;
  compliance_risk_score: number;
  count: number;
}

interface ROIData {
  sum: number | null;
}

interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string | null;
  action_type: string;
  resource_type: string | null;
  resource_id: string | null;
  action_description: string;
  risk_level: string;
  regulatory_impact: boolean;
  created_at: string;
  [key: string]: unknown;
}

interface UserAdoptionData {
  user_id: string;
  count: number;
  avg: number | null;
}

export const dashboardQueries = {
  // Risk Matrix data for executive dashboard
  async getRiskMatrix(tenantId: string): Promise<RiskMatrixData[]> {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    const supabase = createClient();

    // Fetch all data and group in JavaScript instead
    const { data, error } = await supabase
      .from("clarity_scores")
      .select("risk_level, compliance_risk_score")
      .eq("tenant_id", tenantId)
      .gte("created_at", thirtyDaysAgo);

    if (error) {
      throw new Error(`Risk matrix query failed: ${error.message}`);
    }

    // Group and count in JavaScript
    const grouped = new Map<string, number>();
    data?.forEach((item) => {
      const key = `${item.risk_level}-${item.compliance_risk_score}`;
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    const result: RiskMatrixData[] = [];
    grouped.forEach((count, key) => {
      const [risk_level, compliance_risk_score] = key.split("-");
      result.push({
        risk_level: risk_level as RiskLevel,
        compliance_risk_score: parseInt(compliance_risk_score),
        count,
      });
    });

    return result;
  },

  // Monthly ROI calculation
  async getMonthlyROI(tenantId: string): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const supabase = createClient();
    const { data, error } = await supabase
      .from("analytics_metrics")
      .select("metric_value")
      .eq("tenant_id", tenantId)
      .eq("metric_type", "risk_reduction")
      .eq("time_period", "monthly")
      .gte("recorded_date", thirtyDaysAgo);

    if (error) {
      throw new Error(`ROI query failed: ${error.message}`);
    }

    // Calculate sum in JavaScript
    const sum =
      data?.reduce((acc, item) => acc + (item.metric_value || 0), 0) || 0;
    return sum;
  },

  // Critical incidents for compliance reporting
  async getCriticalIncidents(
    tenantId: string,
    limit = 10
  ): Promise<AuditLog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("risk_level", "high")
      .eq("regulatory_impact", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Critical incidents query failed: ${error.message}`);
    }

    return data as AuditLog[];
  },

  // User adoption metrics
  async getUserAdoption(tenantId: string): Promise<UserAdoptionData[]> {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_conversations")
      .select("user_id, user_satisfaction_score")
      .eq("tenant_id", tenantId)
      .gte("started_at", thirtyDaysAgo);

    if (error) {
      throw new Error(`User adoption query failed: ${error.message}`);
    }

    // Group and aggregate in JavaScript
    const grouped = new Map<
      string,
      { count: number; total: number; scores: number }
    >();

    data?.forEach((item) => {
      if (!grouped.has(item.user_id)) {
        grouped.set(item.user_id, { count: 0, total: 0, scores: 0 });
      }
      const entry = grouped.get(item.user_id)!;
      entry.count++;
      if (item.user_satisfaction_score !== null) {
        entry.total += item.user_satisfaction_score;
        entry.scores++;
      }
    });

    const result: UserAdoptionData[] = [];
    grouped.forEach((value, user_id) => {
      result.push({
        user_id,
        count: value.count,
        avg: value.scores > 0 ? value.total / value.scores : null,
      });
    });

    return result;
  },
};
