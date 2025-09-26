"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
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

interface OrganizationData {
  name: string;
  type: string;
  status: string;
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
  trend: 'up' | 'down' | 'stable';
}

// Mock data for MVP demonstration
const mockTrendData = [
  { week: 'Week 1', incidents: 150, mitigated: 25 },
  { week: 'Week 2', incidents: 142, mitigated: 35 },
  { week: 'Week 3', incidents: 135, mitigated: 45 },
  { week: 'Week 4', incidents: 128, mitigated: 52 },
  { week: 'Week 5', incidents: 123, mitigated: 58 },
];

const mockDepartmentRisk = [
  { department: 'Procurement', highRisk: 55, medium: 23, low: 12 },
  { department: 'HR', highRisk: 40, medium: 18, low: 8 },
  { department: 'Operations', highRisk: 28, medium: 15, low: 6 },
  { department: 'Legal', highRisk: 15, medium: 8, low: 3 },
];

const mockCriticalIncidents = [
  {
    id: 1,
    type: 'Policy Violation',
    department: 'Procurement',
    riskLevel: 'CRITICAL',
    preview: 'We must implement this immediately without consultation...',
    culturalIssue: 'Direct command style inappropriate for hierarchical culture',
    complianceIssue: 'Violates stakeholder consultation policy',
    detectedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    type: 'Cultural Miscommunication',
    department: 'HR',
    riskLevel: 'HIGH',
    preview: 'التنفيذ الفوري مطلوب بدون مناقشة (Immediate execution required without discussion)',
    culturalIssue: 'Arabic phrase reinforces authoritarian tone',
    complianceIssue: 'Conflicts with collaborative decision-making policy',
    detectedAt: '2024-01-15T14:22:00Z',
  },
  {
    id: 3,
    type: 'Regulatory Risk',
    department: 'Operations',
    riskLevel: 'HIGH',
    preview: 'All external contractors must comply immediately...',
    culturalIssue: 'Lacks respectful framing for partner relationships',
    complianceIssue: 'SAMA compliance review process bypassed',
    detectedAt: '2024-01-15T16:45:00Z',
  },
];

const riskMatrixData = [
  { cultural: 'Low', compliance: 'Low', count: 15, color: '#10B981' },
  { cultural: 'Low', compliance: 'Medium', count: 8, color: '#F59E0B' },
  { cultural: 'Low', compliance: 'High', count: 3, color: '#EF4444' },
  { cultural: 'Medium', compliance: 'Low', count: 12, color: '#F59E0B' },
  { cultural: 'Medium', compliance: 'Medium', count: 25, color: '#F59E0B' },
  { cultural: 'Medium', compliance: 'High', count: 18, color: '#EF4444' },
  { cultural: 'High', compliance: 'Low', count: 8, color: '#EF4444' },
  { cultural: 'High', compliance: 'Medium', count: 22, color: '#EF4444' },
  { cultural: 'High', compliance: 'High', count: 12, color: '#DC2626' },
];

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#DC2626'];

export default function EnterpriseDashboard() {
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUnmitigatedRisk: 380000,
    highRiskCommunications: 123,
    policyAdherenceScore: 82,
    riskReductionValue: 45000,
    trend: 'down'
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user tenant and organization data
      const { data: userTenant } = await supabase
        .from("user_tenants")
        .select(`
          role,
          tenant_id,
          organizations!inner(name, type, status, industry)
        `)
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (userTenant?.organizations) {
        setOrganization(userTenant.organizations as any);
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("full_name, email, department, job_title")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // In a real implementation, you would load actual metrics from your analytics tables
      // For MVP, we're using mock data that demonstrates the value proposition

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportAuditReport = () => {
    // In real implementation, this would generate a comprehensive PDF report
    const reportData = {
      organization: organization?.name,
      reportDate: new Date().toISOString(),
      metrics,
      criticalIncidents: mockCriticalIncidents,
      trendData: mockTrendData,
      departmentRisk: mockDepartmentRisk,
    };
    
    console.log("Exporting audit report:", reportData);
    alert("Audit report export functionality would generate a comprehensive PDF with all risk data, compliance metrics, and actionable insights for board presentation.");
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
              Pilot: {organization?.name || 'Saudi Petroleum Enterprise'} - {userProfile?.department || 'Digital Transformation'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
              Live Monitoring
            </Badge>
            <Button onClick={exportAuditReport} className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              Export Audit Report
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Executive Metrics - The Headlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Unmitigated Risk */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Total Unmitigated Risk</p>
                  <p className="text-3xl font-bold text-red-700">${metrics.totalUnmitigatedRisk.toLocaleString()}</p>
                  <p className="text-red-600 text-sm mt-1">This Month</p>
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
                  <p className="text-orange-600 text-sm font-medium">High-Risk Communications</p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-orange-700">{metrics.highRiskCommunications}</p>
                    <TrendingDown className="w-5 h-5 text-green-500 ml-2" />
                  </div>
                  <p className="text-orange-600 text-sm mt-1">vs. 150 last month</p>
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
                  <p className="text-blue-600 text-sm font-medium">Policy Adherence Score</p>
                  <p className="text-3xl font-bold text-blue-700">{metrics.policyAdherenceScore}%</p>
                  <p className="text-blue-600 text-sm mt-1">SAMA Compliance</p>
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
                  <p className="text-green-600 text-sm font-medium">Risk Reduction Value</p>
                  <p className="text-3xl font-bold text-green-700">+${metrics.riskReductionValue.toLocaleString()}</p>
                  <p className="text-green-600 text-sm mt-1">Averted This Month</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Trend Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                Risk Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockTrendData}>
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
                Risk Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Cultural vs Compliance Impact</div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {['High', 'Medium', 'Low'].map((compliance) => (
                    ['High', 'Medium', 'Low'].map((cultural) => {
                      const item = riskMatrixData.find(d => d.cultural === cultural && d.compliance === compliance);
                      return (
                        <div
                          key={`${cultural}-${compliance}`}
                          className="p-2 rounded text-center text-white font-medium"
                          style={{ backgroundColor: item?.color || '#9CA3AF' }}
                        >
                          {item?.count || 0}
                        </div>
                      );
                    })
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Cultural Risk →</span>
                  <span>↑ Compliance Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Risk Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-emerald-600" />
              Risk Exposure by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockDepartmentRisk}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="highRisk" stackId="a" fill="#EF4444" name="High Risk" />
                <Bar dataKey="medium" stackId="a" fill="#F59E0B" name="Medium Risk" />
                <Bar dataKey="low" stackId="a" fill="#10B981" name="Low Risk" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Critical Incidents & Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Critical Incidents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Critical Incidents Requiring Review
                </div>
                <Badge variant="destructive">3 Overdue</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCriticalIncidents.map((incident) => (
                  <div key={incident.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Badge 
                          variant={incident.riskLevel === 'CRITICAL' ? 'destructive' : 'default'}
                          className={incident.riskLevel === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'}
                        >
                          {incident.riskLevel}
                        </Badge>
                        <span className="ml-2 text-sm font-medium text-gray-700">{incident.department}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-800 font-medium mb-1">Communication Preview:</p>
                      <p className="text-sm text-gray-600 italic">&apos;{incident.preview}&apos;</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-red-700">Cultural Issue: </span>
                        <span className="text-xs text-red-600">{incident.culturalIssue}</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-orange-700">Compliance Issue: </span>
                        <span className="text-xs text-orange-600">{incident.complianceIssue}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Detected: {new Date(incident.detectedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
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
                    <option value="nationalization">Emiratization/Nationalization Policy</option>
                    <option value="anti_corruption">Anti-Corruption Framework</option>
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Overdue Reviews</p>
                      <p className="text-xs text-orange-600">12 items require immediate attention</p>
                    </div>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      12
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Pending Approvals</p>
                      <p className="text-xs text-blue-600">8 communications awaiting clearance</p>
                    </div>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      8
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                    <div>
                      <p className="text-sm font-medium text-green-800">Successfully Mitigated</p>
                      <p className="text-xs text-green-600">67 risks resolved this month</p>
                    </div>
                    <Badge variant="outline" className="border-green-300 text-green-700">
                      67
                    </Badge>
                  </div>
                </div>

                {/* Quick Access Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200">
                  <Button size="sm" variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Generate Report
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
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI Summary Footer */}
        <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Pilot Program ROI Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">$45,000</p>
                  <p className="text-sm text-gray-600">Risk Mitigation Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">67%</p>
                  <p className="text-sm text-gray-600">Incident Reduction</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">890%</p>
                  <p className="text-sm text-gray-600">ROI on Pilot Investment</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
                Based on 3-month pilot data. Projected annual savings: $540,000 with full enterprise deployment.
                <span className="font-medium text-emerald-700"> Ready for board presentation.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
