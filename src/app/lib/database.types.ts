export type UserType = "guard" | "professional";
export type Dialect = "gulf" | "egyptian" | "levantine" | "standard";
export type Segment = "guard" | "professional";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type OrgStatus = "trial" | "active" | "inactive";

/** Hand-written Database type (kept in sync with SQL) */
export type Database = {
  public: {
    Tables: {
      mosques: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          admin_email: string | null;
          admin_phone: string | null;
          license_count: number | null;
          contract_value: string | null; // numeric -> string
          status: OrgStatus | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          admin_email?: string | null;
          admin_phone?: string | null;
          license_count?: number | null;
          contract_value?: string | null;
          status?: OrgStatus | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          admin_email?: string | null;
          admin_phone?: string | null;
          license_count?: number | null;
          contract_value?: string | null;
          status?: OrgStatus | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      companies: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          admin_email: string | null;
          license_count: number | null;
          status: OrgStatus | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          industry?: string | null;
          admin_email?: string | null;
          license_count?: number | null;
          status?: OrgStatus | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          industry?: string | null;
          admin_email?: string | null;
          license_count?: number | null;
          status?: OrgStatus | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      user_profiles: {
        Row: {
          id: string; // auth.users.id
          user_type: UserType;
          full_name: string | null;
          dialect: Dialect | null;
          mosque_id: string | null;
          company_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_type: UserType;
          full_name?: string | null;
          dialect?: Dialect | null;
          mosque_id?: string | null;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_type?: UserType;
          full_name?: string | null;
          dialect?: Dialect | null;
          mosque_id?: string | null;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_mosque_id_fkey";
            columns: ["mosque_id"];
            referencedRelation: "mosques";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_profiles_company_id_fkey";
            columns: ["company_id"];
            referencedRelation: "companies";
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
          pronunciation_focus: string[] | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          segment: Segment;
          difficulty?: Difficulty | null;
          scenario_text: string;
          expected_response?: string | null;
          cultural_context?: string | null;
          pronunciation_focus?: string[] | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          segment?: Segment;
          difficulty?: Difficulty | null;
          scenario_text?: string;
          expected_response?: string | null;
          cultural_context?: string | null;
          pronunciation_focus?: string[] | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      user_progress: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          completion_status: ProgressStatus | null;
          score: number | null;
          attempts: number | null;
          last_attempt: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id: string;
          completion_status?: ProgressStatus | null;
          score?: number | null;
          attempts?: number | null;
          last_attempt?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string;
          completion_status?: ProgressStatus | null;
          score?: number | null;
          attempts?: number | null;
          last_attempt?: string | null;
          created_at?: string | null;
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
          session_duration: number | null; // seconds
          completion_rate: string | null; // decimal -> string
          pronunciation_score: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          scenario_id?: string | null;
          session_duration?: number | null;
          completion_rate?: string | null;
          pronunciation_score?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          scenario_id?: string | null;
          session_duration?: number | null;
          completion_rate?: string | null;
          pronunciation_score?: number | null;
          created_at?: string | null;
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

      user_streaks: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number | null;
          longest_streak: number | null;
          last_activity: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number | null;
          longest_streak?: number | null;
          last_activity?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_streak?: number | null;
          longest_streak?: number | null;
          last_activity?: string | null;
          created_at?: string | null;
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
    };
    // Use a non-empty-object-safe type to satisfy @typescript-eslint/no-empty-object-type
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
