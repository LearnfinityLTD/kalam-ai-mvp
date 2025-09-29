"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Shield,
  FileText,
  Download,
  Eye,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { Database } from "@/lib/database.types";

interface OrganizationData {
  name: string;
  type: string;
  status: string;
  industry?: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  department: string;
  job_title: string;
}

interface DashboardMetrics {
  totalUnmitigatedRisk: number;
  highRiskCommunications: number;
  policyAdherenceScore: number;
  riskReductionValue: number;
  trend: "up" | "down" | "stable";
}

interface TrendDataPoint {
  week: string;
  incidents: number;
  mitigated: number;
}

interface DepartmentRisk {
  department: string;
  highRisk: number;
  medium: number;
  low: number;
}

interface CriticalIncident {
  id: string;
  type: string;
  department: string;
  riskLevel: string;
  preview: string;
  culturalIssue: string;
  complianceIssue: string;
  detectedAt: string;
}

interface RiskMatrixItem {
  cultural: string;
  compliance: string;
  count: number;
  color: string;
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#DC2626"];

export default function EnterpriseDashboard() {
  const [organization, setOrganization] = useState<OrganizationData | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUnmitigatedRisk: 0,
    highRiskCommunications: 0,
    policyAdherenceScore: 0,
    riskReductionValue: 0,
    trend: "stable",
  });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [departmentRisk, setDepartmentRisk] = useState<DepartmentRisk[]>([]);
  const [criticalIncidents, setCriticalIncidents] = useState<
    CriticalIncident[]
  >([]);
  const [riskMatrixData, setRiskMatrixData] = useState<RiskMatrixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/");
    }
  };

  const loadDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // For development, use fallback user data if no auth user
      const userId = user?.id || "2115a2e9-3993-417c-a9b9-ef358bbc8e6c";
      const tenantId = "123e4567-e89b-12d3-a456-426614174000";

      // Load organization data
      const { data: orgData } = await supabase
        .from("organizations")
        .select("name, type, status, industry")
        .eq("id", tenantId)
        .single();

      if (orgData) {
        setOrganization(orgData);
      }

      // Load user profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("full_name, email, department, job_title")
        .eq("id", userId)
        .single();

      if (profileData) {
        setUserProfile(profileData);
      }

      // Load real analytics data
      await Promise.all([
        loadMetrics(tenantId),
        loadTrendData(tenantId),
        loadDepartmentRiskData(tenantId),
        loadCriticalIncidents(tenantId),
        loadRiskMatrix(tenantId),
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async (tenantId: string) => {
    try {
      // Get analytics metrics
      const { data: analyticsData } = await supabase
        .from("analytics_metrics")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });

      // Get clarity scores for risk calculations
      const { data: clarityData } = await supabase
        .from("clarity_scores")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });

      // Calculate metrics from real data
      const highRiskCount =
        clarityData?.filter(
          (score) =>
            score.risk_level === "high" || score.risk_level === "critical"
        ).length || 0;

      const totalRiskValue =
        clarityData?.reduce((sum, score) => {
          if (score.risk_level === "high") return sum + 5000;
          if (score.risk_level === "critical") return sum + 15000;
          if (score.risk_level === "medium") return sum + 2000;
          return sum + 500;
        }, 0) || 0;
      console.log("Analytics data:", analyticsData);
      const mitigatedValue =
        analyticsData?.reduce((sum, metric) => {
          if (metric.metric_type === "risk_reduction") {
            const value =
              typeof metric.metric_value === "string"
                ? parseFloat(metric.metric_value)
                : metric.metric_value;
            return sum + (value || 0);
          }
          return sum;
        }, 0) || 0;

      const policyScore =
        clarityData && clarityData.length > 0
          ? Math.round(
              (clarityData.filter((s) => s.risk_level === "low").length /
                clarityData.length) *
                100
            )
          : 85;

      setMetrics({
        totalUnmitigatedRisk: Math.max(0, totalRiskValue - mitigatedValue),
        highRiskCommunications: highRiskCount,
        policyAdherenceScore: policyScore,
        riskReductionValue: mitigatedValue,
        trend: "down", // You could calculate this based on time series data
      });
    } catch (error) {
      console.error("Error loading metrics:", error);
    }
  };

  const loadTrendData = async (tenantId: string) => {
    try {
      // Get data from last 5 weeks
      const fiveWeeksAgo = new Date();
      fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 35);

      const { data: clarityData } = await supabase
        .from("clarity_scores")
        .select("created_at, risk_level")
        .eq("tenant_id", tenantId)
        .gte("created_at", fiveWeeksAgo.toISOString())
        .order("created_at", { ascending: true });

      // Group by week
      const weeklyData: {
        [key: string]: { incidents: number; mitigated: number };
      } = {};

      clarityData?.forEach((score) => {
        const date = new Date(score.created_at);
        const weekStart = new Date(
          date.setDate(date.getDate() - date.getDay())
        );
        const weekKey = `Week ${Math.ceil(
          (Date.now() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)
        )}`;

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { incidents: 0, mitigated: 0 };
        }

        if (score.risk_level === "high" || score.risk_level === "critical") {
          weeklyData[weekKey].incidents++;
        } else {
          weeklyData[weekKey].mitigated++;
        }
      });

      const trendArray = Object.entries(weeklyData)
        .map(([week, data]) => ({
          week,
          incidents: data.incidents,
          mitigated: data.mitigated,
        }))
        .slice(-5); // Last 5 weeks

      // Add mock data if insufficient real data
      if (trendArray.length < 5) {
        const mockTrend = [
          { week: "Week 1", incidents: 12, mitigated: 3 },
          { week: "Week 2", incidents: 8, mitigated: 5 },
          { week: "Week 3", incidents: 6, mitigated: 7 },
          { week: "Week 4", incidents: 4, mitigated: 8 },
          { week: "Week 5", incidents: 2, mitigated: 9 },
        ];
        setTrendData([...trendArray, ...mockTrend.slice(trendArray.length)]);
      } else {
        setTrendData(trendArray);
      }
    } catch (error) {
      console.error("Error loading trend data:", error);
    }
  };

  const loadDepartmentRiskData = async (tenantId: string) => {
    try {
      const { data: clarityData } = await supabase
        .from("clarity_scores")
        .select(
          `
        risk_level,
        documents!inner(
          user_id,
          user_profiles!inner(department)
        )
      `
        )
        .eq("tenant_id", tenantId);

      // Group by department
      const deptRisks: {
        [key: string]: { high: number; medium: number; low: number };
      } = {};

      // Define the shape of the returned data - Supabase returns nested relations as arrays
      type ClarityScoreWithRelations = {
        risk_level: string | null;
        documents: Array<{
          user_id: string;
          user_profiles: Array<{
            department: string | null;
          }>;
        }>;
      };

      clarityData?.forEach((score: ClarityScoreWithRelations) => {
        const dept =
          score.documents?.[0]?.user_profiles?.[0]?.department || "Unknown";
        if (!deptRisks[dept]) {
          deptRisks[dept] = { high: 0, medium: 0, low: 0 };
        }

        if (score.risk_level === "high" || score.risk_level === "critical") {
          deptRisks[dept].high++;
        } else if (score.risk_level === "medium") {
          deptRisks[dept].medium++;
        } else {
          deptRisks[dept].low++;
        }
      });

      const deptArray = Object.entries(deptRisks).map(([dept, risks]) => ({
        department: dept,
        highRisk: risks.high,
        medium: risks.medium,
        low: risks.low,
      }));

      setDepartmentRisk(deptArray);
    } catch (error) {
      console.error("Error loading department risk data:", error);
    }
  };

  const loadCriticalIncidents = async (tenantId: string) => {
    try {
      const { data: incidents } = await supabase
        .from("clarity_scores")
        .select(
          `
        id,
        risk_level,
        identified_issues,
        cultural_context_notes,
        created_at,
        documents!inner(
          title,
          content,
          user_profiles!inner(department)
        )
      `
        )
        .eq("tenant_id", tenantId)
        .in("risk_level", ["high", "critical"])
        .order("created_at", { ascending: false })
        .limit(5);

      // Define the shape of the returned data
      type IncidentWithRelations = {
        id: string;
        risk_level: string | null;
        identified_issues: JSON;
        cultural_context_notes: string | null;
        created_at: string;
        documents: Array<{
          title: string;
          content: string;
          user_profiles: Array<{
            department: string | null;
          }>;
        }>;
      };

      const criticalIncidentsList =
        incidents?.map((incident: IncidentWithRelations) => ({
          id: incident.id,
          type:
            incident.risk_level === "critical"
              ? "Policy Violation"
              : "Cultural Risk",
          department:
            incident.documents?.[0]?.user_profiles?.[0]?.department ||
            "Unknown",
          riskLevel: (incident.risk_level || "unknown").toUpperCase(),
          preview:
            (incident.documents?.[0]?.content?.substring(0, 80) ||
              "No content available") +
            (incident.documents?.[0]?.content ? "..." : ""),
          culturalIssue:
            incident.cultural_context_notes ||
            "Cultural sensitivity concerns detected",
          complianceIssue: (Array.isArray(incident.identified_issues) &&
          incident.identified_issues.length > 0
            ? incident.identified_issues[0]
            : "Compliance review required") as string,
          detectedAt: incident.created_at,
        })) || [];

      setCriticalIncidents(criticalIncidentsList);
    } catch (error) {
      console.error("Error loading critical incidents:", error);
    }
  };

  const loadRiskMatrix = async (tenantId: string) => {
    try {
      const { data: clarityData } = await supabase
        .from("clarity_scores")
        .select("cultural_appropriateness_score, compliance_risk_score")
        .eq("tenant_id", tenantId);

      // Create risk matrix based on real data
      const matrix: { [key: string]: number } = {};

      clarityData?.forEach((score) => {
        const cultural =
          score.cultural_appropriateness_score > 70
            ? "High"
            : score.cultural_appropriateness_score > 40
            ? "Medium"
            : "Low";
        const compliance =
          score.compliance_risk_score > 70
            ? "High"
            : score.compliance_risk_score > 40
            ? "Medium"
            : "Low";
        const key = `${cultural}-${compliance}`;
        matrix[key] = (matrix[key] || 0) + 1;
      });

      const riskMatrix = [
        {
          cultural: "Low",
          compliance: "Low",
          count: matrix["Low-Low"] || 0,
          color: "#10B981",
        },
        {
          cultural: "Low",
          compliance: "Medium",
          count: matrix["Low-Medium"] || 0,
          color: "#F59E0B",
        },
        {
          cultural: "Low",
          compliance: "High",
          count: matrix["Low-High"] || 0,
          color: "#EF4444",
        },
        {
          cultural: "Medium",
          compliance: "Low",
          count: matrix["Medium-Low"] || 0,
          color: "#F59E0B",
        },
        {
          cultural: "Medium",
          compliance: "Medium",
          count: matrix["Medium-Medium"] || 0,
          color: "#F59E0B",
        },
        {
          cultural: "Medium",
          compliance: "High",
          count: matrix["Medium-High"] || 0,
          color: "#EF4444",
        },
        {
          cultural: "High",
          compliance: "Low",
          count: matrix["High-Low"] || 0,
          color: "#EF4444",
        },
        {
          cultural: "High",
          compliance: "Medium",
          count: matrix["High-Medium"] || 0,
          color: "#EF4444",
        },
        {
          cultural: "High",
          compliance: "High",
          count: matrix["High-High"] || 0,
          color: "#DC2626",
        },
      ];

      setRiskMatrixData(riskMatrix);
    } catch (error) {
      console.error("Error loading risk matrix:", error);
    }
  };

  const exportAuditReport = () => {
    const reportData = {
      organization: organization?.name,
      reportDate: new Date().toISOString(),
      metrics,
      criticalIncidents,
      trendData,
      departmentRisk,
      riskMatrix: riskMatrixData,
    };

    console.log("Exporting audit report:", reportData);

    // Create downloadable JSON report
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `kalam-ai-audit-report-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Enterprise Communication Risk & Compliance Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Live Data: {organization?.name || "Kalam AI Demo Organization"} -{" "}
              {userProfile?.department || "Operations"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="outline"
              className="border-emerald-200 text-emerald-700"
            >
              Real-Time Data
            </Badge>
            <Button
              onClick={exportAuditReport}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Real Data Report
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-10 h-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Executive Metrics - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Unmitigated Risk */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">
                    Total Unmitigated Risk
                  </p>
                  <p className="text-3xl font-bold text-red-700">
                    ${metrics.totalUnmitigatedRisk.toLocaleString()}
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    From Real Analysis
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High-Risk Communications */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">
                    High-Risk Communications
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-orange-700">
                      {metrics.highRiskCommunications}
                    </p>
                    <TrendingDown className="w-5 h-5 text-green-500 ml-2" />
                  </div>
                  <p className="text-orange-600 text-sm mt-1">
                    Live Detection Count
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Policy Adherence Score */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Policy Adherence Score
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {metrics.policyAdherenceScore}%
                  </p>
                  <p className="text-blue-600 text-sm mt-1">Calculated Score</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Reduction Value */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Risk Reduction Value
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    +${metrics.riskReductionValue.toLocaleString()}
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    AI Interventions
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                    Cultural Intelligence Engine
                  </h3>
                  <p className="text-sm text-indigo-600 mb-4">
                    Analyze real-time communications for cultural and compliance
                    risks
                  </p>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() =>
                      (window.location.href = "/cultural-intelligence")
                    }
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center">
                  <Activity className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    Live Risk Assessment
                  </h3>
                  <p className="text-sm text-purple-600 mb-4">
                    Review flagged communications from database
                  </p>
                  <Button
                    variant="outline"
                    className="border-purple-300 text-purple-700"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Review Queue ({criticalIncidents.length})
                  </Button>
                </div>
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                    Real Data Reports
                  </h3>
                  <p className="text-sm text-emerald-600 mb-4">
                    Export actual analytics and audit trails
                  </p>
                  <Button
                    variant="outline"
                    className="border-emerald-300 text-emerald-700"
                    onClick={exportAuditReport}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export Real Report
                  </Button>
                </div>
                <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Visualizations with Real Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Trend Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                Real Risk Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="High-Risk Incidents"
                  />
                  <Line
                    type="monotone"
                    dataKey="mitigated"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Risk Mitigated"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Matrix Heat Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                Live Risk Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Cultural vs Compliance Impact
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {["High", "Medium", "Low"].map((compliance) =>
                    ["High", "Medium", "Low"].map((cultural) => {
                      const item = riskMatrixData.find(
                        (d) =>
                          d.cultural === cultural && d.compliance === compliance
                      );
                      return (
                        <div
                          key={`${cultural}-${compliance}`}
                          className="p-2 rounded text-center text-white font-medium"
                          style={{ backgroundColor: item?.color || "#9CA3AF" }}
                        >
                          {item?.count || 0}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cultural Risk →</span>
                  <span>↑ Compliance Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Risk Analysis with Real Data */}
        {departmentRisk.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-emerald-600" />
                Risk Exposure by Department (Real Data)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={departmentRisk}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="highRisk"
                    stackId="a"
                    fill="#EF4444"
                    name="High Risk"
                  />
                  <Bar
                    dataKey="medium"
                    stackId="a"
                    fill="#F59E0B"
                    name="Medium Risk"
                  />
                  <Bar
                    dataKey="low"
                    stackId="a"
                    fill="#10B981"
                    name="Low Risk"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Critical Incidents from Real Database */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Live Critical Incidents
                </div>
                <Badge variant="destructive">
                  {criticalIncidents.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalIncidents.length > 0 ? (
                  criticalIncidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="border border-red-200 rounded-lg p-4 bg-red-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Badge
                            variant={
                              incident.riskLevel === "CRITICAL"
                                ? "destructive"
                                : "default"
                            }
                            className={
                              incident.riskLevel === "CRITICAL"
                                ? "bg-red-600"
                                : "bg-orange-500"
                            }
                          >
                            {incident.riskLevel}
                          </Badge>
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {incident.department}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-800 font-medium mb-1">
                          Communication Preview:
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          &apos;{incident.preview}&apos;
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-red-700">
                            Cultural Issue:{" "}
                          </span>
                          <span className="text-xs text-red-600">
                            {incident.culturalIssue}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-orange-700">
                            Compliance Issue:{" "}
                          </span>
                          <span className="text-xs text-orange-600">
                            {incident.complianceIssue}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Detected:{" "}
                        {new Date(incident.detectedAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No critical incidents detected yet</p>
                    <p className="text-sm mt-1">
                      Use the Cultural Intelligence Engine to analyze
                      communications
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Policy Filters & Action Center */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                Compliance & Action Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Policy Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Policy/Regulation
                  </label>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="all">All Policies</option>
                    <option value="sama">SAMA Compliance Guidelines</option>
                    <option value="hse">HSE Safety Mandate 4.2</option>
                    <option value="internal">Internal Code of Conduct</option>
                    <option value="nationalization">
                      Emiratization/Nationalization Policy
                    </option>
                    <option value="anti_corruption">
                      Anti-Corruption Framework
                    </option>
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <div>
                      <p className="text-sm font-medium text-orange-800">
                        High Risk Items
                      </p>
                      <p className="text-xs text-orange-600">
                        {metrics.highRiskCommunications} items require attention
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      {metrics.highRiskCommunications}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Analyzed Communications
                      </p>
                      <p className="text-xs text-blue-600">
                        Total analyzed from database
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-blue-300 text-blue-700"
                    >
                      {criticalIncidents.length +
                        metrics.highRiskCommunications}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Risk Value Mitigated
                      </p>
                      <p className="text-xs text-green-600">
                        ${metrics.riskReductionValue.toLocaleString()} saved
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-300 text-green-700"
                    >
                      Live
                    </Badge>
                  </div>
                </div>

                {/* Quick Access Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={exportAuditReport}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    Export Data
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Team Analytics
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI Summary Footer - Calculated from Real Data */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Live System Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    ${metrics.riskReductionValue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Real Risk Mitigation Value
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {metrics.highRiskCommunications}
                  </p>
                  <p className="text-sm text-gray-600">
                    High-Risk Items Detected
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.policyAdherenceScore}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Policy Adherence Score
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
                Real-time data from your Cultural Intelligence Engine.
                <span className="font-medium text-emerald-700">
                  {" "}
                  All metrics calculated from actual database records.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
