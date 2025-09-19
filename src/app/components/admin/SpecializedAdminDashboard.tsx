import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  BarChart3,
  Settings,
  Download,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Award,
  Target,
  DollarSign,
  Calendar,
  Building,
  Building2,
  Globe,
  Shield,
  MapPin,
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Loader2,
  LucideIcon,
  Upload,
  Send,
  X,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  AdminContext,
  EmployeeData,
  Company,
  Mosque,
  DepartmentStats,
  AnalyticsData,
} from "@/app/types/admin";
import TourismContentManagement from "@/app/components/content/tourism-content/TourismContentManagement";
import AramcoContentManagement from "@/app/components/content/aramco-content/AramcoContentManagement";
import AviationContentManagement from "@/app/components/content/aviation-content/AviationContentManagement";
import AirportContentManagement from "@/app/components/content/airport-content/AirportContentManagement";
import MosqueContentManagement from "@/app/components/content/mosque-content/MosqueContentManagement";
import PrayerManagementSection from "@/components/prayer-management/PrayerManagementSection";
interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface Stat {
  label: string;
  value: string | number;
  change: string;
  color: string;
  icon: LucideIcon;
}

interface SectionProps {
  adminContext: AdminContext;
  analytics?: AnalyticsData;
  loading?: boolean;
  employees: EmployeeData[];
}

interface EmployeeSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

const SpecializedAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [adminContext, setAdminContext] = useState<AdminContext | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load dashboard data");
        }

        setAdminContext(data.adminContext);
        setAnalytics(data.analytics);
        setEmployees(data.employees);
        setError(null);
      } catch (err) {
        console.error("Admin data loading error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load admin data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const hasPermission = (
    permission: keyof AdminContext["scope"]["permissions"]
  ): boolean => {
    return adminContext?.scope.permissions[permission] || false;
  };

  const getIndustrySpecificPermissions = () => {
    const orgName = adminContext?.scope.organizationName.toLowerCase() || "";

    // Type guard to check if organizationData is a Company
    const isCompany = (org: Company | Mosque | undefined): org is Company => {
      return org !== undefined && "industry" in org;
    };

    const industry = isCompany(adminContext?.organizationData)
      ? adminContext.organizationData.industry?.toLowerCase() || ""
      : "";

    return {
      canManageAramcoContent:
        orgName.includes("aramco") || industry.includes("oil"),
      canManageAviationContent:
        orgName.includes("airlines") || industry.includes("aviation"),
      canManageAirportContent:
        orgName.includes("airport") || orgName.includes("kaia"),
      canManageMosqueContent: adminContext?.scope.type === "mosque",
      canManageTourismContent:
        hasPermission("canManageTourismContent") ||
        orgName.includes("neom") ||
        industry.includes("tourism"),
    };
  };

  const handleExportReport = () => {
    const generateCSV = () => {
      let csvContent = "";

      if (activeSection === "overview" || activeSection === "employees") {
        const headers = [
          "Full Name",
          "Email",
          "Department",
          "User Type",
          "Progress (%)",
          "Cultural Score (%)",
          "Status",
          "Assessment Score",
          "Invitation Sent",
        ];

        csvContent = headers.join(",") + "\n";

        employees.forEach((emp) => {
          const row = [
            `"${emp.full_name}"`,
            `"${emp.email || ""}"`,
            `"${emp.department}"`,
            `"${emp.user_type}"`,
            emp.progress || 0,
            emp.culturalScore || 0,
            `"${emp.status}"`,
            emp.assessment_score || 0,
            emp.invitation_sent ? "Yes" : "No",
          ];
          csvContent += row.join(",") + "\n";
        });
      }

      return csvContent;
    };

    const csvData = generateCSV();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);

      const timestamp = new Date().toISOString().split("T")[0];
      const orgName = adminContext?.scope.organizationName.replace(/\s+/g, "_");
      const sectionName =
        activeSection.charAt(0).toUpperCase() + activeSection.slice(1);

      link.setAttribute(
        "download",
        `${orgName}_${sectionName}_Report_${timestamp}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/admin/signin");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleLogout}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading || !adminContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="text-gray-700">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { id: "overview", label: "Overview", icon: BarChart3 },
      { id: "employees", label: "Employee Management", icon: Users },
    ];

    if (hasPermission("canBulkImport")) {
      baseItems.push({
        id: "bulk-import",
        label: "Bulk User Import",
        icon: UserPlus,
      });
    }

    if (hasPermission("canViewAnalytics")) {
      baseItems.push({
        id: "analytics",
        label: "Learning Analytics",
        icon: TrendingUp,
      });
    }

    if (hasPermission("canViewROI")) {
      baseItems.push({ id: "roi", label: "ROI Tracking", icon: DollarSign });
    }

    if (adminContext?.scope.type === "company") {
      baseItems.push({
        id: "departments",
        label: "Department Reports",
        icon: Target,
      });
    }

    if (hasPermission("canManagePrayerTimes")) {
      baseItems.push({
        id: "prayer",
        label: "Prayer Management",
        icon: Building,
      });
    }

    if (hasPermission("canManageTourismContent")) {
      baseItems.push({ id: "tourism", label: "Tourism Content", icon: MapPin });
    }

    if (hasPermission("canManageSettings")) {
      baseItems.push({ id: "settings", label: "Settings", icon: Settings });
    }

    return baseItems;
  };

  const getHeaderIcon = (): LucideIcon => {
    switch (adminContext?.scope.type) {
      case "global":
        return Globe;
      case "company":
        return Building2;
      case "mosque":
        return Building;
      default:
        return Users;
    }
  };

  const HeaderIcon = getHeaderIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <HeaderIcon className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {adminContext?.scope.organizationName}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    {adminContext?.scope.type === "global"
                      ? "Platform Administration"
                      : adminContext?.scope.type === "company"
                      ? "Company Dashboard"
                      : adminContext?.scope.type === "mosque"
                      ? "Islamic Institution Management"
                      : "Administrative Dashboard"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {hasPermission("canExportData") && (
                  <button
                    onClick={handleExportReport}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Download size={20} />
                    <span>Export Report</span>
                  </button>
                )}
                <button
                  className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {getNavigationItems().map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === "overview" && (
              <OverviewSection
                adminContext={adminContext}
                analytics={analytics}
                loading={false}
                employees={employees}
              />
            )}

            {activeSection === "employees" && (
              <EmployeeSection
                adminContext={adminContext}
                employees={employees}
              />
            )}

            {activeSection === "bulk-import" &&
              hasPermission("canBulkImport") && (
                <BulkImportSection
                  adminContext={adminContext}
                  employees={employees}
                  setEmployees={setEmployees}
                />
              )}

            {activeSection === "analytics" &&
              hasPermission("canViewAnalytics") && (
                <AnalyticsSection
                  adminContext={adminContext}
                  analytics={analytics}
                  loading={false}
                  employees={employees}
                />
              )}

            {activeSection === "roi" && hasPermission("canViewROI") && (
              <ROISection
                adminContext={adminContext}
                analytics={analytics}
                loading={false}
                employees={employees}
              />
            )}

            {activeSection === "departments" &&
              adminContext.scope.type === "company" && (
                <DepartmentSection
                  adminContext={adminContext}
                  employees={employees}
                  analytics={analytics}
                  loading={false}
                />
              )}

            {activeSection === "prayer" &&
              hasPermission("canManagePrayerTimes") && (
                <PrayerManagementSection
                  adminContext={adminContext}
                  onSettingsChange={(settings) => {
                    // Handle settings changes
                    console.log("Prayer settings updated:", settings);
                    // Save to backend, update state, etc.
                  }}
                />
              )}

            {activeSection === "tourism" &&
              hasPermission("canManageTourismContent") && (
                <TourismContentManagement
                  adminContext={adminContext}
                  employees={employees}
                />
              )}

            {activeSection === "aramco" &&
              getIndustrySpecificPermissions().canManageAramcoContent && (
                <AramcoContentManagement
                  adminContext={adminContext}
                  employees={employees}
                />
              )}

            {activeSection === "aviation" &&
              getIndustrySpecificPermissions().canManageAviationContent && (
                <AviationContentManagement
                  adminContext={adminContext}
                  employees={employees}
                />
              )}

            {activeSection === "airport" &&
              getIndustrySpecificPermissions().canManageAirportContent && (
                <AirportContentManagement
                  adminContext={adminContext}
                  employees={employees}
                />
              )}

            {activeSection === "mosque" &&
              getIndustrySpecificPermissions().canManageMosqueContent && (
                <MosqueContentManagement
                  adminContext={adminContext}
                  employees={employees}
                />
              )}

            {activeSection === "settings" &&
              hasPermission("canManageSettings") && (
                <SettingsSection adminContext={adminContext} />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection: React.FC<SectionProps> = ({
  adminContext,
  analytics,
  loading,
  employees,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  const getContextualStats = (): Stat[] => {
    const overview = analytics?.overview || {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(
        (e: EmployeeData) => e.status === "active"
      ).length,
      avgProgress: Math.round(
        employees.reduce((sum, e) => sum + (e.progress || 0), 0) /
          Math.max(employees.length, 1)
      ),
      completionRate: Math.round(
        (employees.filter((e) => (e.progress || 0) >= 100).length /
          Math.max(employees.length, 1)) *
          100
      ),
      avgCulturalScore: Math.round(
        employees.reduce((sum, e) => sum + (e.culturalScore || 0), 0) /
          Math.max(employees.length, 1)
      ),
    };

    const baseStats: Stat[] = [
      {
        label: "Total Employees",
        value: overview.totalEmployees,
        change: "+12%",
        color: "bg-blue-500",
        icon: Users,
      },
      {
        label: "Active Learners",
        value: overview.activeEmployees,
        change: "+8%",
        color: "bg-green-500",
        icon: CheckCircle,
      },
      {
        label: "Average Progress",
        value: `${overview.avgProgress}%`,
        change: "+15%",
        color: "bg-purple-500",
        icon: TrendingUp,
      },
      {
        label: "Completion Rate",
        value: `${overview.completionRate}%`,
        change: "+5%",
        color: "bg-emerald-500",
        icon: Award,
      },
    ];

    if (adminContext.scope.type === "mosque") {
      baseStats.push({
        label: "Prayer Integration",
        value: "95%",
        change: "+2%",
        color: "bg-indigo-500",
        icon: Building,
      });
    }

    if (adminContext.scope.type === "company") {
      baseStats.push({
        label: "Cultural Sensitivity",
        value: `${overview.avgCulturalScore}%`,
        change: "+18%",
        color: "bg-orange-500",
        icon: Star,
      });
    }

    return baseStats;
  };

  return (
    <div className="space-y-8">
      {/* Organization Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {adminContext.scope.organizationName}
            </h2>
            <p className="text-emerald-100 mt-1">
              {adminContext.scope.type === "company" && "Business Organization"}
              {adminContext.scope.type === "mosque" && "Islamic Institution"}
              {adminContext.scope.type === "global" &&
                "Platform-wide Administration"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {employees.length > 0
                ? Math.round(
                    (employees.filter((e) => (e.progress || 0) >= 100).length /
                      employees.length) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-emerald-100">Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getContextualStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Specialized Content */}
      {adminContext.scope.type === "mosque" && (
        <MosqueSpecificContent employees={employees} />
      )}
      {adminContext.scope.type === "company" && (
        <CompanySpecificContent employees={employees} />
      )}
      {adminContext.scope.type === "global" && (
        <GlobalSpecificContent employees={employees} />
      )}
    </div>
  );
};

// Employee Management Section
const EmployeeSection: React.FC<EmployeeSectionProps> = ({
  adminContext,
  employees,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterUserType, setFilterUserType] = useState<string>("all");

  const getRelevantUserTypes = (): string[] => {
    const baseTypes = ["all"];
    switch (adminContext.scope.type) {
      case "mosque":
        return [...baseTypes, "guard", "admin"];
      case "company":
        return [
          ...baseTypes,
          "professional",
          "tourist_guide",
          "guard",
          "admin",
        ];
      case "global":
        return [
          ...baseTypes,
          "guard",
          "professional",
          "tourist_guide",
          "admin",
        ];
      default:
        return baseTypes;
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || emp.department === filterDepartment;
    const matchesUserType =
      filterUserType === "all" || emp.user_type === filterUserType;
    return matchesSearch && matchesDepartment && matchesUserType;
  });

  const departments = [
    "all",
    ...Array.from(new Set(employees.map((emp) => emp.department))),
  ];
  const userTypes = getRelevantUserTypes();

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:w-48">
            <select
              value={filterUserType}
              onChange={(e) => setFilterUserType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {userTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {adminContext.scope.type === "mosque"
              ? "Mosque Staff"
              : adminContext.scope.type === "company"
              ? "Company Employees"
              : "All Users"}{" "}
            ({filteredEmployees.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                {adminContext.scope.type === "company" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cultural Score
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-emerald-700">
                          {employee.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email || employee.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.user_type === "guard"
                          ? "bg-blue-100 text-blue-800"
                          : employee.user_type === "professional"
                          ? "bg-purple-100 text-purple-800"
                          : employee.user_type === "tourist_guide"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.user_type?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${employee.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {employee.progress || 0}%
                      </span>
                    </div>
                  </td>
                  {adminContext.scope.type === "company" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.culturalScore || 0}%
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No employees found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              filterDepartment !== "all" ||
              filterUserType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first employee."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Bulk Import Section
const BulkImportSection: React.FC<{
  adminContext: AdminContext;
  employees: EmployeeData[];
  setEmployees: React.Dispatch<React.SetStateAction<EmployeeData[]>>;
}> = ({ adminContext, employees, setEmployees }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [invitationStatus, setInvitationStatus] = useState<
    "idle" | "sending" | "completed"
  >("idle");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());
        const data = lines.map((line) =>
          line.split(",").map((cell) => cell.replace(/"/g, "").trim())
        );
        setCsvData(data);
        setUploadProgress(100);
      };
      reader.readAsText(file);
    }
  };

  const sendBulkInvitations = async () => {
    setInvitationStatus("sending");

    try {
      const response = await fetch("/api/admin/bulk-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvData,
          options: {},
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload employees");
      }

      setInvitationStatus("completed");

      // Add uploaded users to employees list
      const newEmployees: EmployeeData[] = csvData
        .slice(1)
        .map((row, index) => ({
          id: `temp-${Date.now()}-${index}`,
          full_name: row[0],
          email: row[1],
          department: row[2],
          user_type: row[3] as "guard" | "professional" | "tourist_guide",
          progress: 0,
          culturalScore: 0,
          status: "pending" as const,
          assessment_score: 0,
          assessment_completed: false,
          is_admin: false,
          invitation_sent: true,
        }));

      setEmployees((prev) => [...prev, ...newEmployees]);
    } catch (error) {
      console.error("Bulk upload error:", error);
      setInvitationStatus("idle");
    }
  };

  const downloadTemplate = () => {
    const template = [
      ["Full Name", "Email", "Department", "User Type", "Manager Email"],
      [
        "Ahmed Al-Rashid",
        "ahmed.rashid@company.com",
        "Security",
        "guard",
        "security.manager@company.com",
      ],
      [
        "Fatima Al-Zahra",
        "fatima.zahra@company.com",
        "Customer Service",
        "professional",
        "service.manager@company.com",
      ],
      [
        "Mohammed Al-Otaibi",
        "mohammed.otaibi@company.com",
        "Tourism",
        "tourist_guide",
        "tourism.director@company.com",
      ],
    ];

    const csvContent = template.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kalam-ai-employee-template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment =
      filterDepartment === "all" || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [
    "all",
    ...new Set(employees.map((emp) => emp.department)),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Bulk User Import
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Upload, manage, and track employee progress across your
              organization
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadTemplate}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download size={20} />
              <span>Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: "upload", label: "Bulk Upload", icon: Upload },
            { id: "manage", label: "Manage Users", icon: Users },
            { id: "analytics", label: "Import Analytics", icon: Eye },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id
                  ? "bg-emerald-100 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-8">
          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-emerald-400 cursor-pointer transition-colors"
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-emerald-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">CSV files only</p>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Data */}
          {csvData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preview Data ({csvData.length - 1} employees)
                </h3>
                <button
                  onClick={sendBulkInvitations}
                  disabled={invitationStatus === "sending"}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Send size={20} />
                  <span>
                    {invitationStatus === "sending"
                      ? "Sending..."
                      : "Send Invitations"}
                  </span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {csvData[0]?.map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {csvData.slice(1).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invitationStatus === "completed" && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="ml-3 text-sm text-green-800">
                      Successfully sent invitations to {csvData.length - 1}{" "}
                      employees
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Manage Users Tab */}
      {activeTab === "manage" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>
              </div>
              <button className="sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus size={20} />
                <span>Add Employee</span>
              </button>
            </div>
          </div>

          {/* Employee List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Employees ({filteredEmployees.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee, index) => (
                    <tr key={employee.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-emerald-700">
                              {employee.full_name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email || employee.department}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.user_type === "guard"
                              ? "bg-blue-100 text-blue-800"
                              : employee.user_type === "professional"
                              ? "bg-purple-100 text-purple-800"
                              : employee.user_type === "tourist_guide"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {employee.user_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full"
                              style={{ width: `${employee.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {employee.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.status === "active"
                              ? "bg-green-100 text-green-800"
                              : employee.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-emerald-600 hover:text-emerald-900 p-1 rounded transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No employees found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterDepartment !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding your first employee."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Import Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Imported",
                value: csvData.length > 0 ? csvData.length - 1 : 0,
                color: "bg-blue-500",
              },
              {
                label: "Invitations Sent",
                value: employees.filter((e) => e.invitation_sent).length,
                color: "bg-green-500",
              },
              {
                label: "Accounts Created",
                value: employees.filter((e) => e.status === "active").length,
                color: "bg-purple-500",
              },
              {
                label: "Pending Setup",
                value: employees.filter((e) => e.status === "pending").length,
                color: "bg-yellow-500",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div
                    className={`${stat.color} w-3 h-3 rounded-full mr-3`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Import History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Import Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  date: "2024-09-17",
                  count: 4,
                  status: "completed",
                  department: "Multiple",
                },
                {
                  date: "2024-09-15",
                  count: 12,
                  status: "completed",
                  department: "Security",
                },
                {
                  date: "2024-09-12",
                  count: 8,
                  status: "completed",
                  department: "Customer Service",
                },
              ].map((import_record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Upload size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Imported {import_record.count} employees
                      </p>
                      <p className="text-xs text-gray-500">
                        {import_record.department} • {import_record.date}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {import_record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Section
const AnalyticsSection: React.FC<SectionProps> = ({
  adminContext,
  analytics,
  loading,
  employees,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  const timeMetrics = analytics?.timeMetrics || {
    avgDailyLearning: "45 min",
    weeklyEngagement: "5.2 hours",
    peakLearningTime: "2-4 PM",
    mobileVsDesktop: "60% / 40%",
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Learning Analytics Dashboard
        </h2>

        {/* Time Spent Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Average Daily Learning",
              value: timeMetrics.avgDailyLearning,
              trend: "+12%",
            },
            {
              label: "Weekly Engagement",
              value: timeMetrics.weeklyEngagement,
              trend: "+8%",
            },
            {
              label: "Peak Learning Time",
              value: timeMetrics.peakLearningTime,
              trend: "Consistent",
            },
            {
              label: "Mobile vs Desktop",
              value: timeMetrics.mobileVsDesktop,
              trend: "+5% mobile",
            },
          ].map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                {metric.label}
              </h4>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-sm text-green-600 mt-1">{metric.trend}</p>
            </div>
          ))}
        </div>

        {/* Department Performance */}
        {analytics?.departmentStats && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department Performance
            </h3>
            <div className="space-y-3">
              {Object.entries(
                analytics.departmentStats as Record<string, DepartmentStats>
              ).map(([dept, stats]) => (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {dept}
                      </span>
                      <span className="text-sm text-gray-600">
                        {stats.avgProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${stats.avgProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">
                    {stats.total} employees
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ROI Section - FIXED VERSION
const ROISection: React.FC<SectionProps> = ({
  adminContext,
  analytics,
  loading,
  employees,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  const roiMetrics = analytics?.roiMetrics || {
    totalInvestment: employees.length * 120 * 12,
    estimatedProductivityGain: employees.length * 3240,
    roi: 125,
    avgScoreImprovement: 23,
    breakEvenMonths: 8.2,
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ROI Tracking & Business Impact
        </h2>

        {/* ROI Overview - FIXED TO SHOW POSITIVE VALUES */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-emerald-100 text-sm">Total ROI</p>
              <p className="text-4xl font-bold">+{roiMetrics.roi}%</p>
              <p className="text-emerald-100 text-sm">Annual Return</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-100 text-sm">Net Benefit</p>
              <p className="text-4xl font-bold">
                £
                {(
                  roiMetrics.estimatedProductivityGain -
                  roiMetrics.totalInvestment
                ).toLocaleString()}
              </p>
              <p className="text-emerald-100 text-sm">First Year</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-100 text-sm">Payback Period</p>
              <p className="text-4xl font-bold">{roiMetrics.breakEvenMonths}</p>
              <p className="text-emerald-100 text-sm">Months</p>
            </div>
          </div>
        </div>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Investment Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly cost per employee</span>
                <span className="font-medium">£120</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total employees</span>
                <span className="font-medium">{employees.length}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-900 font-semibold">
                  Annual investment
                </span>
                <span className="font-bold">
                  £{roiMetrics.totalInvestment.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Expected Returns
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Productivity gain per employee
                </span>
                <span className="font-medium">£3,240</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score improvement</span>
                <span className="font-medium">
                  +{roiMetrics.avgScoreImprovement}%
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-900 font-semibold">
                  Total annual benefit
                </span>
                <span className="font-bold text-green-600">
                  £{roiMetrics.estimatedProductivityGain.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder sections for remaining components
const DepartmentSection: React.FC<SectionProps> = ({
  adminContext,
  employees,
  analytics,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-2xl font-bold text-gray-900">Department Reports</h2>
    <p className="text-gray-600 mt-2">
      Department-specific analytics and reports for{" "}
      {adminContext.scope.organizationName}.
    </p>
    {analytics?.departmentStats && (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(
          analytics.departmentStats as Record<string, DepartmentStats>
        ).map(([dept, stats]) => (
          <div key={dept} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">{dept}</h3>
            <p className="text-sm text-gray-600">{stats.total} employees</p>
            <p className="text-sm text-gray-600">
              Completion: {stats.completionRate}%
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SettingsSection: React.FC<{ adminContext: AdminContext }> = ({
  adminContext,
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Organization Settings
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              defaultValue={adminContext.scope.organizationName}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Assessment Level
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-enroll"
              defaultChecked
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="auto-enroll" className="ml-2 text-sm text-gray-700">
              Automatically enroll new employees in assessment
            </label>
          </div>

          <div className="pt-4">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Context-specific content components
const CompanySpecificContent: React.FC<{ employees: EmployeeData[] }> = ({
  employees,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Building2 className="mr-2 text-blue-600" size={20} />
        Business Impact Metrics
      </h3>
      <div className="space-y-4">
        {[
          { label: "Customer Communication", improvement: 18, progress: 78 },
          {
            label: "International Client Satisfaction",
            improvement: 25,
            progress: 85,
          },
          { label: "Employee Confidence", improvement: 32, progress: 90 },
          { label: "Cultural Sensitivity", improvement: 28, progress: 80 },
        ].map((metric, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {metric.label}
              </span>
              <span className="text-green-600 font-bold">
                +{metric.improvement}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${metric.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Department Performance
      </h3>
      <div className="space-y-3">
        {["Security", "Customer Service", "Tourism", "Management"].map(
          (dept) => {
            const deptEmployees = employees.filter(
              (e) => e.department === dept
            );
            const avgProgress =
              deptEmployees.length > 0
                ? Math.round(
                    deptEmployees.reduce(
                      (sum, e) => sum + (e.progress || 0),
                      0
                    ) / deptEmployees.length
                  )
                : 0;

            return (
              <div key={dept} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {dept}
                    </span>
                    <span className="text-sm text-gray-600">
                      {avgProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${avgProgress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-500">
                  {deptEmployees.length} employees
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  </div>
);

const MosqueSpecificContent: React.FC<{ employees: EmployeeData[] }> = ({
  employees,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Building className="mr-2 text-emerald-600" size={20} />
        Islamic Features Usage
      </h3>
      <div className="space-y-4">
        {[
          { label: "Prayer Time Integration", value: 95 },
          { label: "Ramadan Schedule Adoption", value: 88 },
          { label: "Cultural Content Engagement", value: 92 },
        ].map((feature, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{feature.label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${feature.value}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{feature.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Security Staff Progress
      </h3>
      <div className="space-y-3">
        {employees
          .filter((e) => e.user_type === "guard")
          .slice(0, 4)
          .map((guard, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{guard.full_name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${guard.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{guard.progress}%</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
);

const GlobalSpecificContent: React.FC<{ employees: EmployeeData[] }> = ({
  employees,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Globe className="mr-2 text-indigo-600" size={20} />
        Platform Statistics
      </h3>
      <div className="space-y-3">
        {[
          { label: "Total Organizations", value: "127" },
          { label: "Active Companies", value: "89" },
          { label: "Mosques", value: "38" },
          { label: "Total Learners", value: employees.length.toLocaleString() },
        ].map((stat, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className="font-medium">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Revenue Metrics
      </h3>
      <div className="space-y-3">
        {[
          { label: "Monthly Revenue", value: "£89,340" },
          { label: "Annual Recurring", value: "£1.07M" },
          { label: "Growth Rate", value: "+23%", isPositive: true },
        ].map((metric, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <span
              className={`font-medium ${
                metric.isPositive ? "text-green-600" : ""
              }`}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Support Metrics
      </h3>
      <div className="space-y-3">
        {[
          { label: "Active Tickets", value: "23" },
          { label: "Avg Response Time", value: "2.3h" },
          { label: "Satisfaction Rate", value: "94%", isPositive: true },
        ].map((metric, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <span
              className={`font-medium ${
                metric.isPositive ? "text-green-600" : ""
              }`}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SpecializedAdminDashboard;
