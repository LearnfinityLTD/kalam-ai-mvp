// app/types/admin.ts

// ------- Helpers -------
export type ID = string;
export type ISODateString = string;

// app/types/admin.ts
export const USER_TYPES = [
  "guard",
  "professional",
  "tourist_guide",
  "admin",
] as const;
export type UserType = (typeof USER_TYPES)[number];

export const isUserType = (v: unknown): v is UserType =>
  typeof v === "string" && (USER_TYPES as readonly string[]).includes(v);

export type OrgStatus = "trial" | "active" | "inactive";

// Generic key–value bag without using `any`
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// ------- Admin -------
export interface AdminPermissions {
  canViewAllEmployees?: boolean;
  canManageEmployees?: boolean;
  canViewAnalytics?: boolean;
  canExportData?: boolean;
  canManageBilling?: boolean;
  canManageSettings?: boolean;
  canViewROI?: boolean;
  canManagePrayerTimes?: boolean;
  canViewCulturalMetrics?: boolean;
  canManageTourismContent?: boolean;
  canAccessSupport?: boolean;
  canBulkImport?: boolean;
}

export interface AdminScope {
  type: "global" | "company" | "mosque";
  id?: ID | null;
  organizationName: string;
  organizationId?: ID | null;
  permissions: AdminPermissions;
}

// ------- Organizations -------
export interface AdminSettings {
  notificationsEnabled?: boolean;
  locale?: string;
  timezone?: string;
  // allow future settings without `any`
  [key: string]: JsonValue | undefined;
}

export interface CustomBranding {
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  // allow future branding fields
  [key: string]: JsonValue | undefined;
}

export interface Company {
  id: ID;
  name: string;
  industry: string | null;
  admin_email: string | null;
  license_count: number | null;
  status: OrgStatus | null;
  admin_settings?: AdminSettings;
  custom_branding?: CustomBranding;
}

export interface Mosque {
  id: ID;
  name: string;
  location: string | null;
  admin_email: string | null;
  admin_phone: string | null;
  license_count: number | null;
  contract_value: number | null;
  status: OrgStatus | null;
}

// ------- Users -------
export interface UserProfile {
  id: ID;
  user_type: UserType;
  full_name: string | null;

  department?: string;
  english_level?: string | null;

  assessment_completed: boolean;
  assessment_score?: number | null;

  specialization?: string | null;
  total_challenges_completed?: number | null;
  average_challenge_score?: number | null;

  company_id?: ID | null;
  mosque_id?: ID | null;

  is_admin: boolean;
  is_super_admin?: boolean;

  companies?: Company; // kept as-is (singular object)
  mosques?: Mosque;

  admin_permissions?: AdminPermissions;

  // Narrowed to your AdminScope types
  data_access_scope?: AdminScope["type"];

  created_at?: ISODateString;
  updated_at?: ISODateString;
}

// ------- Progress / Results -------
export interface UserProgressEntry {
  date: ISODateString;
  progress: number; // 0..100
  // extensible
  [key: string]: JsonValue | undefined;
}

export interface AssessmentSession {
  id: ID;
  started_at?: ISODateString;
  completed_at?: ISODateString;
  score?: number | null;
  // extensible
  [key: string]: JsonValue | undefined;
}

export interface ScenarioResult {
  id: ID;
  scenario_id?: ID;
  score?: number;
  completed_at?: ISODateString;
  // extensible
  [key: string]: JsonValue | undefined;
}

export interface UserAchievementRef {
  achievement_id: ID;
  earned_at: ISODateString;
  points?: number;
  // extensible
  [key: string]: JsonValue | undefined;
}

// ------- Employee (extends user) -------
export interface EmployeeData extends UserProfile {
  progress: number; // 0..100
  culturalScore: number; // 0..100
  status: "active" | "pending" | "inactive" | "training";

  // You had `department` in UserProfile as optional; here it’s required
  department: string;

  email?: string;
  invitation_sent?: boolean;

  user_progress?: UserProgressEntry[];
  assessment_sessions?: AssessmentSession[];
  scenario_results?: ScenarioResult[];
  user_achievements?: UserAchievementRef[];
}

// ------- Context -------
export interface AdminContext {
  userId?: ID;
  user?: UserProfile;
  scope: AdminScope;
  organizationData?: Company | Mosque;
}

// ------- Filtering / Stats / Errors -------
export interface FilterOptions {
  search?: string;
  department?: string;
  userType?: UserType;
}
export interface AnalyticsData {
  overview: AnalyticsOverview;
  departmentStats: Record<string, DepartmentStats>;
  employees: EmployeeData[];
  timeMetrics: TimeMetrics;
  roiMetrics: ROIMetrics;
}

export interface DepartmentStats {
  total: number;
  completed: number;
  avgProgress: number;
  completionRate?: number;
}

export interface ErrorResponse {
  error: string;
}

export interface AnalyticsOverview {
  totalEmployees: number;
  activeEmployees: number;
  avgProgress: number;
  completionRate: number;
  avgCulturalScore: number;
}

export interface TimeMetrics {
  avgDailyLearning: string;
  weeklyEngagement: string;
  peakLearningTime: string;
  mobileVsDesktop: string;
  patterns: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}

export interface ROIMetrics {
  totalInvestment: number;
  estimatedProductivityGain: number;
  roi: number;
  avgScoreImprovement: number;
  breakEvenMonths: number;
}
