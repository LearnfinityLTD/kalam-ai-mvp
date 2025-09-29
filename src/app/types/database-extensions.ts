// types/database-extensions.ts
// Additional interfaces that extend your Supabase schema

import type { Database } from "@/lib/database.types";

// Helper types for easier usage
export type DocumentInsert =
  Database["public"]["Tables"]["documents"]["Insert"];
export type DocumentUpdate =
  Database["public"]["Tables"]["documents"]["Update"];
export type ClarityScoreInsert =
  Database["public"]["Tables"]["clarity_scores"]["Insert"];
export type ClarityScoreUpdate =
  Database["public"]["Tables"]["clarity_scores"]["Update"];
export type AnalyticsMetricInsert =
  Database["public"]["Tables"]["analytics_metrics"]["Insert"];
export type AuditLogInsert =
  Database["public"]["Tables"]["audit_logs"]["Insert"];

// Additional interfaces for your specific use cases
export interface InterventionDecisionData {
  analysisId: string;
  decision: "accepted" | "rejected";
  riskReduction: number;
  monetaryImpact: number;
  timestamp: string;
}

export interface CulturalAnalysisInput {
  text: string;
  senderId: string;
  departmentId: string;
  tenantId: string;
}

export interface CulturalAnalysisResult {
  overallRisk: number;
  culturalHierarchyRisk: number;
  complianceRisk: number;
  hierarchyScore: number;
  directnessScore: number;
  formalityScore: number;
  issues: string[];
  suggestions: string[];
  culturalNotes: string;
  revisedText: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high" | "critical";
}
