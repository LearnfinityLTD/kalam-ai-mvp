
// /types/api.ts

export interface CulturalAnalysisRequest {
  userId: string;
  departmentId: string;
  messageText: string;
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
  riskLevel: RiskLevel;
}

export interface InterventionDecisionRequest {
  analysisId: string;
  decision: DecisionType;
  tenantId: string;
  userId: string;
}

export interface InterventionDecisionResponse {
  success: boolean;
  decision: DecisionType;
  riskReduction: number;
  monetaryImpact: number;
  message: string;
}

export interface DatabaseDocument {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  content: string;
  document_type: DocumentType;
  source_language: string;
  target_audience: AudienceType;
  status: DocumentStatus;
  created_at: string;
  analyzed_at?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface ClarityScore {
  id: string;
  tenant_id: string;
  document_id: string;
  analyzed_by: string;
  overall_clarity_score: number;
  cultural_appropriateness_score: number;
  hierarchy_respect_score: number;
  directness_balance_score: number;
  formality_level_score: number;
  risk_level: RiskLevel;
  compliance_risk_score: number;
  identified_issues: string[];
  improvement_suggestions: string[];
  cultural_context_notes: string;
  suggested_revisions: string;
  analysis_model_version: string;
  confidence_level: number;
  created_at: string;
}

export interface AnalyticsMetric {
  id: string;
  tenant_id: string;
  metric_type: MetricType;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  department: string;
  time_period: TimePeriod;
  calculation_method: string;
  data_source: string;
  confidence_level: number;
  recorded_date: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  tenant_id: string;
  user_id: string;
  action_type: ActionType;
  resource_type: ResourceType;
  resource_id?: string;
  action_description: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  risk_level: RiskLevel;
  regulatory_impact: boolean;
  data_classification: DataClassification;
  retention_period_days: number;
  created_at: string;
}

// Enum types for type safety
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DecisionType = 'accepted' | 'rejected';
export type DocumentType = 'email' | 'memo' | 'presentation' | 'policy' | 'manual' | 'contract';
export type AudienceType = 'internal' | 'external' | 'government' | 'international';
export type DocumentStatus = 'draft' | 'analysis_pending' | 'analyzed' | 'approved' | 'rejected';
export type MetricType = 'risk_reduction' | 'compliance_score' | 'knowledge_transfer_effectiveness' | 'user_adoption' | 'cost_savings';
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type ActionType = 'login' | 'logout' | 'document_upload' | 'document_analysis' | 'knowledge_transfer' | 'data_export' | 'settings_change' | 'user_management';
export type ResourceType = 'document' | 'user' | 'session' | 'analytics' | 'system';
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted';
