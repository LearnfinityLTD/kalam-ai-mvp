// lib/database.types.ts

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type DocumentType =
  | "email"
  | "memo"
  | "presentation"
  | "policy"
  | "manual"
  | "contract";
export type AudienceType =
  | "internal"
  | "external"
  | "government"
  | "international";
export type DocumentStatus =
  | "draft"
  | "analysis_pending"
  | "analyzed"
  | "approved"
  | "rejected";
export type MetricType =
  | "risk_reduction"
  | "compliance_score"
  | "knowledge_transfer_effectiveness"
  | "user_adoption"
  | "cost_savings";
export type TimePeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";
export type ActionType =
  | "login"
  | "logout"
  | "document_upload"
  | "document_analysis"
  | "knowledge_transfer"
  | "data_export"
  | "settings_change"
  | "user_management";
export type ResourceType =
  | "document"
  | "user"
  | "session"
  | "analytics"
  | "system";
export type DataClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          type: "enterprise" | "government" | "consulting";
          industry: string | null;
          country: string;
          region: string | null;
          license_number: string | null;
          compliance_level: "basic" | "advanced" | "government";
          subscription_tier: "pilot" | "standard" | "enterprise" | "government";
          max_users: number;
          contract_value: number | null;
          contact_email: string;
          contact_phone: string | null;
          status: "trial" | "active" | "suspended" | "cancelled";
          data_residency_region: string;
          sso_enabled: boolean;
          audit_logging_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "enterprise" | "government" | "consulting";
          industry?: string | null;
          country?: string;
          region?: string | null;
          license_number?: string | null;
          compliance_level?: "basic" | "advanced" | "government";
          subscription_tier?:
            | "pilot"
            | "standard"
            | "enterprise"
            | "government";
          max_users?: number;
          contract_value?: number | null;
          contact_email: string;
          contact_phone?: string | null;
          status?: "trial" | "active" | "suspended" | "cancelled";
          data_residency_region?: string;
          sso_enabled?: boolean;
          audit_logging_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "enterprise" | "government" | "consulting";
          industry?: string | null;
          country?: string;
          region?: string | null;
          license_number?: string | null;
          compliance_level?: "basic" | "advanced" | "government";
          subscription_tier?:
            | "pilot"
            | "standard"
            | "enterprise"
            | "government";
          max_users?: number;
          contract_value?: number | null;
          contact_email?: string;
          contact_phone?: string | null;
          status?: "trial" | "active" | "suspended" | "cancelled";
          data_residency_region?: string;
          sso_enabled?: boolean;
          audit_logging_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      documents: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          title: string;
          content: string;
          document_type: DocumentType | null;
          source_language: string;
          target_audience: AudienceType | null;
          sensitivity_level: "low" | "normal" | "high" | "confidential";
          status: DocumentStatus;
          created_at: string;
          analyzed_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          title: string;
          content: string;
          document_type?: DocumentType | null;
          source_language?: string;
          target_audience?: AudienceType | null;
          sensitivity_level?: "low" | "normal" | "high" | "confidential";
          status?: DocumentStatus;
          created_at?: string;
          analyzed_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          document_type?: DocumentType | null;
          source_language?: string;
          target_audience?: AudienceType | null;
          sensitivity_level?: "low" | "normal" | "high" | "confidential";
          status?: DocumentStatus;
          created_at?: string;
          analyzed_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
        };
        Relationships: [];
      };

      clarity_scores: {
        Row: {
          id: string;
          tenant_id: string;
          document_id: string;
          analyzed_by: string;
          overall_clarity_score: number | null;
          cultural_appropriateness_score: number | null;
          hierarchy_respect_score: number | null;
          directness_balance_score: number | null;
          formality_level_score: number | null;
          risk_level: RiskLevel | null;
          compliance_risk_score: number | null;
          identified_issues: Json;
          improvement_suggestions: Json;
          cultural_context_notes: string | null;
          suggested_revisions: string | null;
          analysis_model_version: string;
          analysis_duration_ms: number | null;
          confidence_level: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          document_id: string;
          analyzed_by: string;
          overall_clarity_score?: number | null;
          cultural_appropriateness_score?: number | null;
          hierarchy_respect_score?: number | null;
          directness_balance_score?: number | null;
          formality_level_score?: number | null;
          risk_level?: RiskLevel | null;
          compliance_risk_score?: number | null;
          identified_issues?: Json;
          improvement_suggestions?: Json;
          cultural_context_notes?: string | null;
          suggested_revisions?: string | null;
          analysis_model_version?: string;
          analysis_duration_ms?: number | null;
          confidence_level?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          document_id?: string;
          analyzed_by?: string;
          overall_clarity_score?: number | null;
          cultural_appropriateness_score?: number | null;
          hierarchy_respect_score?: number | null;
          directness_balance_score?: number | null;
          formality_level_score?: number | null;
          risk_level?: RiskLevel | null;
          compliance_risk_score?: number | null;
          identified_issues?: Json;
          improvement_suggestions?: Json;
          cultural_context_notes?: string | null;
          suggested_revisions?: string | null;
          analysis_model_version?: string;
          analysis_duration_ms?: number | null;
          confidence_level?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };

      audit_logs: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string | null;
          action_type: ActionType;
          resource_type: ResourceType | null;
          resource_id: string | null;
          action_description: string;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          session_id: string | null;
          risk_level: RiskLevel;
          regulatory_impact: boolean;
          data_classification: DataClassification | null;
          retention_period_days: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id?: string | null;
          action_type: ActionType;
          resource_type?: ResourceType | null;
          resource_id?: string | null;
          action_description: string;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          risk_level?: RiskLevel;
          regulatory_impact?: boolean;
          data_classification?: DataClassification | null;
          retention_period_days?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string | null;
          action_type?: ActionType;
          resource_type?: ResourceType | null;
          resource_id?: string | null;
          action_description?: string;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          risk_level?: RiskLevel;
          regulatory_impact?: boolean;
          data_classification?: DataClassification | null;
          retention_period_days?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_conversations: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          conversation_title: string | null;
          conversation_type:
            | "risk_analysis"
            | "clarity_improvement"
            | "cultural_training"
            | "knowledge_transfer"
            | null;
          document_id: string | null;
          knowledge_session_id: string | null;
          messages: Json;
          total_messages: number;
          user_satisfaction_score: number | null;
          ai_confidence_avg: number | null;
          cultural_accuracy_score: number | null;
          started_at: string;
          last_message_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          conversation_title?: string | null;
          conversation_type?:
            | "risk_analysis"
            | "clarity_improvement"
            | "cultural_training"
            | "knowledge_transfer"
            | null;
          document_id?: string | null;
          knowledge_session_id?: string | null;
          messages?: Json;
          total_messages?: number;
          user_satisfaction_score?: number | null;
          ai_confidence_avg?: number | null;
          cultural_accuracy_score?: number | null;
          started_at?: string;
          last_message_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          user_id?: string;
          conversation_title?: string | null;
          conversation_type?:
            | "risk_analysis"
            | "clarity_improvement"
            | "cultural_training"
            | "knowledge_transfer"
            | null;
          document_id?: string | null;
          knowledge_session_id?: string | null;
          messages?: Json;
          total_messages?: number;
          user_satisfaction_score?: number | null;
          ai_confidence_avg?: number | null;
          cultural_accuracy_score?: number | null;
          started_at?: string;
          last_message_at?: string;
          ended_at?: string | null;
        };
        Relationships: [];
      };
      user_tenants: {
        Row: {
          id: string;
          user_id: string;
          tenant_id: string;
          role:
            | "super_admin"
            | "org_admin"
            | "team_lead"
            | "manager"
            | "employee"
            | "viewer";
          department: string | null;
          permissions: Json;
          is_active: boolean;
          joined_at: string;
          last_active: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tenant_id: string;
          role:
            | "super_admin"
            | "org_admin"
            | "team_lead"
            | "manager"
            | "employee"
            | "viewer";
          department?: string | null;
          permissions?: Json;
          is_active?: boolean;
          joined_at?: string;
          last_active?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tenant_id?: string;
          role?:
            | "super_admin"
            | "org_admin"
            | "team_lead"
            | "manager"
            | "employee"
            | "viewer";
          department?: string | null;
          permissions?: Json;
          is_active?: boolean;
          joined_at?: string;
          last_active?: string;
        };
        Relationships: [];
      };

      user_profiles: {
        Row: {
          id: string;
          tenant_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          department: string | null;
          job_title: string | null;
          employee_id: string | null;
          manager_id: string | null;
          cultural_background:
            | "arabic"
            | "western"
            | "asian"
            | "mixed"
            | "other"
            | null;
          native_language: string;
          target_languages: string[];
          communication_style:
            | "direct"
            | "indirect"
            | "hierarchical"
            | "collaborative"
            | null;
          seniority_level:
            | "junior"
            | "mid"
            | "senior"
            | "executive"
            | "c_level"
            | null;
          onboarding_completed: boolean;
          cultural_training_completed: boolean;
          compliance_training_required: boolean;
          last_login: string | null;
          timezone: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tenant_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          department?: string | null;
          job_title?: string | null;
          employee_id?: string | null;
          manager_id?: string | null;
          cultural_background?:
            | "arabic"
            | "western"
            | "asian"
            | "mixed"
            | "other"
            | null;
          native_language?: string;
          target_languages?: string[];
          communication_style?:
            | "direct"
            | "indirect"
            | "hierarchical"
            | "collaborative"
            | null;
          seniority_level?:
            | "junior"
            | "mid"
            | "senior"
            | "executive"
            | "c_level"
            | null;
          onboarding_completed?: boolean;
          cultural_training_completed?: boolean;
          compliance_training_required?: boolean;
          last_login?: string | null;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          department?: string | null;
          job_title?: string | null;
          employee_id?: string | null;
          manager_id?: string | null;
          cultural_background?:
            | "arabic"
            | "western"
            | "asian"
            | "mixed"
            | "other"
            | null;
          native_language?: string;
          target_languages?: string[];
          communication_style?:
            | "direct"
            | "indirect"
            | "hierarchical"
            | "collaborative"
            | null;
          seniority_level?:
            | "junior"
            | "mid"
            | "senior"
            | "executive"
            | "c_level"
            | null;
          onboarding_completed?: boolean;
          cultural_training_completed?: boolean;
          compliance_training_required?: boolean;
          last_login?: string | null;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      analytics_metrics: {
        Row: {
          id: string;
          tenant_id: string;
          metric_type: MetricType;
          metric_name: string;
          metric_value: number;
          metric_unit: string | null;
          department: string | null;
          time_period: TimePeriod | null;
          user_segment: string | null;
          calculation_method: string | null;
          data_source: string | null;
          confidence_level: number | null;
          recorded_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          metric_type: MetricType;
          metric_name: string;
          metric_value: number;
          metric_unit?: string | null;
          department?: string | null;
          time_period?: TimePeriod | null;
          user_segment?: string | null;
          calculation_method?: string | null;
          data_source?: string | null;
          confidence_level?: number | null;
          recorded_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          metric_type?: MetricType;
          metric_name?: string;
          metric_value?: number;
          metric_unit?: string | null;
          department?: string | null;
          time_period?: TimePeriod | null;
          user_segment?: string | null;
          calculation_method?: string | null;
          data_source?: string | null;
          confidence_level?: number | null;
          recorded_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
