// lib/database.types.ts

export type UserType = "guard" | "professional" | "tourist_guide" | "admin";
export type Dialect = "gulf" | "egyptian" | "levantine" | "standard";
export type Segment = "guard" | "professional" | "tourist_guide";
export type Difficulty = "a1" | "a2" | "b1" | "b2" | "c1";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type OrgStatus = "trial" | "active" | "inactive";

// Supabase-style JSON type to replace all `any` JSON columns
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
      companies: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          admin_email: string | null;
          license_count: number | null;
          status: OrgStatus | null;
          admin_settings: Json | null;
          custom_branding: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          industry?: string | null;
          admin_email?: string | null;
          license_count?: number | null;
          status?: OrgStatus | null;
          admin_settings?: Json | null;
          custom_branding?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string | null;
          admin_email?: string | null;
          license_count?: number | null;
          status?: OrgStatus | null;
          admin_settings?: Json | null;
          custom_branding?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      mosques: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          admin_email: string | null;
          admin_phone: string | null;
          license_count: number | null;
          contract_value: number | null;
          status: OrgStatus | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          admin_email?: string | null;
          admin_phone?: string | null;
          license_count?: number | null;
          contract_value?: number | null;
          status?: OrgStatus | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          admin_email?: string | null;
          admin_phone?: string | null;
          license_count?: number | null;
          contract_value?: number | null;
          status?: OrgStatus | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      user_profiles: {
        Row: {
          id: string;
          user_type: UserType;
          full_name: string | null;
          company_id: string | null;
          mosque_id: string | null;
          department: string | null;
          english_level: string | null;
          assessment_completed: boolean;
          assessment_score: number | null;
          specialization: string | null;
          total_challenges_completed: number | null;
          average_challenge_score: number | null;
          is_admin: boolean;
          is_super_admin: boolean | null;
          admin_permissions: Json | null;
          data_access_scope: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          user_type: UserType;
          full_name?: string | null;
          company_id?: string | null;
          mosque_id?: string | null;
          department?: string | null;
          english_level?: string | null;
          assessment_completed?: boolean;
          assessment_score?: number | null;
          specialization?: string | null;
          total_challenges_completed?: number | null;
          average_challenge_score?: number | null;
          is_admin?: boolean;
          is_super_admin?: boolean | null;
          admin_permissions?: Json | null;
          data_access_scope?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_type?: UserType;
          full_name?: string | null;
          company_id?: string | null;
          mosque_id?: string | null;
          department?: string | null;
          english_level?: string | null;
          assessment_completed?: boolean;
          assessment_score?: number | null;
          specialization?: string | null;
          total_challenges_completed?: number | null;
          average_challenge_score?: number | null;
          is_admin?: boolean;
          is_super_admin?: boolean | null;
          admin_permissions?: Json | null;
          data_access_scope?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_company_id_fkey";
            columns: ["company_id"];
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_profiles_mosque_id_fkey";
            columns: ["mosque_id"];
            referencedRelation: "mosques";
            referencedColumns: ["id"];
          }
        ];
      };

      scenarios: {
        Row: {
          id: string;
          title: string;
          segment: Segment;
          difficulty: Difficulty | null;
          scenario_text: string;
          expected_response: string | null;
          cultural_context: string | null;
          type: string | null;
          estimated_duration: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          segment: Segment;
          difficulty?: Difficulty | null;
          scenario_text: string;
          expected_response?: string | null;
          cultural_context?: string | null;
          type?: string | null;
          estimated_duration?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          segment?: Segment;
          difficulty?: Difficulty | null;
          scenario_text?: string;
          expected_response?: string | null;
          cultural_context?: string | null;
          type?: string | null;
          estimated_duration?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };

      user_progress: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string | null;
          completion_status: ProgressStatus | null;
          score: number | null;
          attempts: number | null;
          last_attempt: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id?: string | null;
          completion_status?: ProgressStatus | null;
          score?: number | null;
          attempts?: number | null;
          last_attempt?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string | null;
          completion_status?: ProgressStatus | null;
          score?: number | null;
          attempts?: number | null;
          last_attempt?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_progress_scenario_id_fkey";
            columns: ["scenario_id"];
            referencedRelation: "scenarios";
            referencedColumns: ["id"];
          }
        ];
      };

      learning_sessions: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string | null;
          session_duration: number | null;
          completion_rate: number | null;
          pronunciation_score: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id?: string | null;
          session_duration?: number | null;
          completion_rate?: number | null;
          pronunciation_score?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string | null;
          session_duration?: number | null;
          completion_rate?: number | null;
          pronunciation_score?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "learning_sessions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "learning_sessions_scenario_id_fkey";
            columns: ["scenario_id"];
            referencedRelation: "scenarios";
            referencedColumns: ["id"];
          }
        ];
      };

      assessment_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: string | null;
          user_type_selected: string | null;
          self_assessment_level: number | null;
          questions_attempted: number | null;
          questions_correct: number | null;
          final_level: string | null;
          final_score: number | null;
          completed_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type?: string | null;
          user_type_selected?: string | null;
          self_assessment_level?: number | null;
          questions_attempted?: number | null;
          questions_correct?: number | null;
          final_level?: string | null;
          final_score?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: string | null;
          user_type_selected?: string | null;
          self_assessment_level?: number | null;
          questions_attempted?: number | null;
          questions_correct?: number | null;
          final_level?: string | null;
          final_score?: number | null;
          completed_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_sessions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      scenario_results: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          learning_session_id: string | null;
          english_proficiency_score: number | null;
          cultural_sensitivity_score: number | null;
          pronunciation_score: number | null;
          confidence_score: number | null;
          overall_score: number | null;
          completion_time_minutes: number | null;
          attempts: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id: string;
          learning_session_id?: string | null;
          english_proficiency_score?: number | null;
          cultural_sensitivity_score?: number | null;
          pronunciation_score?: number | null;
          confidence_score?: number | null;
          overall_score?: number | null;
          completion_time_minutes?: number | null;
          attempts?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string;
          learning_session_id?: string | null;
          english_proficiency_score?: number | null;
          cultural_sensitivity_score?: number | null;
          pronunciation_score?: number | null;
          confidence_score?: number | null;
          overall_score?: number | null;
          completion_time_minutes?: number | null;
          attempts?: number | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "scenario_results_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scenario_results_scenario_id_fkey";
            columns: ["scenario_id"];
            referencedRelation: "scenarios";
            referencedColumns: ["id"];
          }
        ];
      };

      user_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number | null;
          longest_streak: number | null;
          last_activity: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number | null;
          longest_streak?: number | null;
          last_activity?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number | null;
          longest_streak?: number | null;
          last_activity?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          }
        ];
      };

      achievements: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          badge_icon: string | null;
          achievement_type: string | null;
          requirements: Json | null;
          points: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          badge_icon?: string | null;
          achievement_type?: string | null;
          requirements?: Json | null;
          points?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          badge_icon?: string | null;
          achievement_type?: string | null;
          requirements?: Json | null;
          points?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string | null;
          scenario_result_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          earned_at?: string | null;
          scenario_result_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          earned_at?: string | null;
          scenario_result_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "user_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
