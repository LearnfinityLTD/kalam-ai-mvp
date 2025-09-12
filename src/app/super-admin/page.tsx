"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Input } from "@/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Users,
  Shield,
  Building2,
  Landmark,
  Briefcase,
  Database,
  Clock,
  Target,
  Search,
  Download,
  Edit,
  Eye,
  UserPlus,
  MoreHorizontal,
  Plus,
  Filter,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  CreditCard,
  Activity,
  KeyRound,
  LifeBuoy,
  Server,
  HardDrive,
  Wifi,
  Globe,
  DollarSign,
  Zap,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Star,
  LineChart,
} from "lucide-react";

type StatColor = "blue" | "green" | "yellow" | "purple" | "red" | "orange";

interface PlatformStats {
  totalUsers: number;
  totalAdmins: number;
  totalGuards: number;
  totalProfessionals: number;
  totalOrganizations: number;
  totalMosques: number;
  totalCompanies: number;
  monthlyRevenue: number;
  activeUsers: number;
  systemUptime: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  userType: "guard" | "professional";
  isAdmin: boolean;
  createdAt: string;
  lastActive: string;
  status: "active" | "inactive";
}

export default function SuperAdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalGuards: 0,
    totalProfessionals: 0,
    totalOrganizations: 0,
    totalMosques: 0,
    totalCompanies: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    systemUptime: 99.9,
  });

  const [users, setUsers] = useState<User[]>([]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/");
    }
  };

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/admin/signin");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("is_super_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_super_admin) {
        router.replace("/guards/super-admin");
      }
    };

    checkAccess();
  }, []);

  // Load platform data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Get all user profiles
        const { data: profiles, error: pErr } = await supabase
          .from("user_profiles")
          .select("*");

        if (pErr) throw pErr;

        // Get auth users for emails
        const {
          data: { users: authUsers },
          error: authErr,
        } = await supabase.auth.admin.listUsers();
        if (authErr) console.warn("Auth users fetch failed:", authErr);

        // Process users data
        const mappedUsers: User[] = (profiles || []).map((profile) => {
          const authUser = authUsers?.find((u) => u.id === profile.id);
          return {
            id: profile.id,
            name: profile.full_name || "Unknown",
            email: authUser?.email || "No email",
            userType: profile.user_type,
            isAdmin: profile.is_admin || false,
            createdAt: profile.created_at || "",
            lastActive: authUser?.last_sign_in_at || "",
            status: "active",
          };
        });

        if (!mounted) return;

        const totalUsers = mappedUsers.length;
        const totalAdmins = mappedUsers.filter((u) => u.isAdmin).length;
        const totalGuards = mappedUsers.filter(
          (u) => u.userType === "guard"
        ).length;
        const totalProfessionals = mappedUsers.filter(
          (u) => u.userType === "professional"
        ).length;

        setUsers(mappedUsers);
        setStats({
          totalUsers,
          totalAdmins,
          totalGuards,
          totalProfessionals,
          totalOrganizations: 0, // Placeholder
          totalMosques: 0, // Placeholder
          totalCompanies: 0, // Placeholder
          monthlyRevenue: 12470, // Mock data
          activeUsers: Math.floor(totalUsers * 0.7),
          systemUptime: 99.9,
        });
      } catch (e) {
        console.error("Error loading platform data:", e);
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const StatsCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    trend,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: StatColor;
    trend?: string;
  }) => {
    const colorClasses = {
      blue: "text-blue-500 bg-blue-100",
      green: "text-green-500 bg-green-100",
      yellow: "text-yellow-500 bg-yellow-100",
      purple: "text-purple-500 bg-purple-100",
      red: "text-red-500 bg-red-100",
      orange: "text-orange-500 bg-orange-100",
    };

    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
              {trend && (
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-700 font-medium">
                    {trend}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const NavItem = ({
    id,
    label,
    icon: Icon,
    badge,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!sidebarCollapsed && (
        <>
          <span className="flex-1 text-left text-sm">{label}</span>
          {badge !== undefined && (
            <span className="ml-auto px-2 py-0.5 bg-gray-200 rounded-full text-xs">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b h-14">
        <div className="flex items-center justify-between px-4 md:px-6 h-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
            <div className="ml-1">
              <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
              <p className="text-xs text-gray-600 -mt-0.5">
                Platform Management • {stats.totalUsers} users
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`sticky top-14 bg-white border-r transition-all h-[calc(100vh-56px)] overflow-y-auto ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4 space-y-6">
            {/* Core Section */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Core
                </p>
              )}
              <nav className="space-y-1">
                <NavItem
                  id="overview"
                  label="Platform Overview"
                  icon={BarChart3}
                  active={activeSection === "overview"}
                  onClick={() => setActiveSection("overview")}
                />
                <NavItem
                  id="users"
                  label="All Users"
                  icon={Users}
                  badge={stats.totalUsers}
                  active={activeSection === "users"}
                  onClick={() => setActiveSection("users")}
                />
                <NavItem
                  id="admins"
                  label="Admin Management"
                  icon={Shield}
                  badge={stats.totalAdmins}
                  active={activeSection === "admins"}
                  onClick={() => setActiveSection("admins")}
                />
              </nav>
            </div>

            {/* Organizations Section */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Organizations
                </p>
              )}
              <nav className="space-y-1">
                <NavItem
                  id="organizations"
                  label="Organizations"
                  icon={Building2}
                  badge={stats.totalOrganizations}
                  active={activeSection === "organizations"}
                  onClick={() => setActiveSection("organizations")}
                />
                <NavItem
                  id="mosques"
                  label="Mosques"
                  icon={Landmark}
                  badge={stats.totalMosques}
                  active={activeSection === "mosques"}
                  onClick={() => setActiveSection("mosques")}
                />
                <NavItem
                  id="companies"
                  label="Companies"
                  icon={Briefcase}
                  badge={stats.totalCompanies}
                  active={activeSection === "companies"}
                  onClick={() => setActiveSection("companies")}
                />
              </nav>
            </div>

            {/* Data Section */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Platform Data
                </p>
              )}
              <nav className="space-y-1">
                <NavItem
                  id="learning-data"
                  label="Learning Data"
                  icon={Database}
                  active={activeSection === "learning-data"}
                  onClick={() => setActiveSection("learning-data")}
                />
                <NavItem
                  id="sessions"
                  label="Sessions"
                  icon={Clock}
                  active={activeSection === "sessions"}
                  onClick={() => setActiveSection("sessions")}
                />
                <NavItem
                  id="analytics"
                  label="Analytics"
                  icon={LineChart}
                  active={activeSection === "analytics"}
                  onClick={() => setActiveSection("analytics")}
                />
              </nav>
            </div>

            {/* Administration Section */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Administration
                </p>
              )}
              <nav className="space-y-1">
                <NavItem
                  id="billing"
                  label="Billing"
                  icon={CreditCard}
                  active={activeSection === "billing"}
                  onClick={() => setActiveSection("billing")}
                />
                <NavItem
                  id="system-health"
                  label="System Health"
                  icon={Activity}
                  active={activeSection === "system-health"}
                  onClick={() => setActiveSection("system-health")}
                />
                <NavItem
                  id="roles"
                  label="Roles & Access"
                  icon={KeyRound}
                  active={activeSection === "roles"}
                  onClick={() => setActiveSection("roles")}
                />
                <NavItem
                  id="logs"
                  label="System Logs"
                  icon={LifeBuoy}
                  active={activeSection === "logs"}
                  onClick={() => setActiveSection("logs")}
                />
                <NavItem
                  id="settings"
                  label="System Settings"
                  icon={Settings}
                  active={activeSection === "settings"}
                  onClick={() => setActiveSection("settings")}
                />
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Platform Overview
                </h2>
                <p className="text-gray-600">
                  Complete platform analytics and management
                </p>
              </div>

              {/* Platform Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers}
                  subtitle="All platform users"
                  icon={Users}
                  color="blue"
                  trend="+12%"
                />
                <StatsCard
                  title="Monthly Revenue"
                  value={`$${stats.monthlyRevenue.toLocaleString()}`}
                  subtitle="Current billing period"
                  icon={DollarSign}
                  color="green"
                  trend="+8%"
                />
                <StatsCard
                  title="Active Users"
                  value={stats.activeUsers}
                  subtitle="Last 30 days"
                  icon={Activity}
                  color="purple"
                  trend="+15%"
                />
                <StatsCard
                  title="System Uptime"
                  value={`${stats.systemUptime}%`}
                  subtitle="Last 30 days"
                  icon={Server}
                  color="orange"
                />
              </div>

              {/* User Type Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Guards</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {stats.totalGuards}
                          </span>
                          <span className="text-sm text-gray-500">
                            (
                            {Math.round(
                              (stats.totalGuards / stats.totalUsers) * 100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <span>Professionals</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {stats.totalProfessionals}
                          </span>
                          <span className="text-sm text-gray-500">
                            (
                            {Math.round(
                              (stats.totalProfessionals / stats.totalUsers) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-4 w-4 text-red-600" />
                          <span>Admins</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {stats.totalAdmins}
                          </span>
                          <span className="text-sm text-gray-500">
                            (
                            {Math.round(
                              (stats.totalAdmins / stats.totalUsers) * 100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Admin User
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Add Organization
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Platform Data
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        System Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Users
                  </h2>
                  <p className="text-gray-600">Manage all platform users</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-700">
                            User
                          </th>
                          <th className="text-left p-4 font-medium text-gray-700">
                            Type
                          </th>
                          <th className="text-left p-4 font-medium text-gray-700">
                            Role
                          </th>
                          <th className="text-left p-4 font-medium text-gray-700">
                            Joined
                          </th>
                          <th className="text-left p-4 font-medium text-gray-700">
                            Last Active
                          </th>
                          <th className="text-left p-4 font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  user.userType === "guard"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.userType}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {user.isAdmin && (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700"
                                >
                                  Admin
                                </Badge>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="text-sm">
                                {user.lastActive
                                  ? new Date(
                                      user.lastActive
                                    ).toLocaleDateString()
                                  : "Never"}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Billing & Revenue
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                  title="Monthly Revenue"
                  value={`$${stats.monthlyRevenue.toLocaleString()}`}
                  subtitle="Current billing period"
                  icon={DollarSign}
                  color="green"
                  trend="+8%"
                />
                <StatsCard
                  title="Active Subscriptions"
                  value={stats.activeUsers}
                  subtitle="Paying customers"
                  icon={Users}
                  color="blue"
                />
                <StatsCard
                  title="Average Revenue Per User"
                  value="$89"
                  subtitle="Monthly ARPU"
                  icon={TrendingUp}
                  color="purple"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p>Revenue charts would go here</p>
                      <p className="text-sm">
                        Integration with charting library needed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "system-health" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                System Health
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Uptime"
                  value="99.9%"
                  subtitle="Last 30 days"
                  icon={Server}
                  color="green"
                />
                <StatsCard
                  title="Response Time"
                  value="142ms"
                  subtitle="Average"
                  icon={Zap}
                  color="blue"
                />
                <StatsCard
                  title="Error Rate"
                  value="0.03%"
                  subtitle="Last 24 hours"
                  icon={AlertTriangle}
                  color="yellow"
                />
                <StatsCard
                  title="Active Connections"
                  value="1,247"
                  subtitle="Currently online"
                  icon={Wifi}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          service: "API Gateway",
                          status: "Operational",
                          icon: Globe,
                        },
                        {
                          service: "Database",
                          status: "Operational",
                          icon: Database,
                        },
                        {
                          service: "File Storage",
                          status: "Operational",
                          icon: HardDrive,
                        },
                        {
                          service: "Authentication",
                          status: "Operational",
                          icon: KeyRound,
                        },
                        {
                          service: "Notifications",
                          status: "Degraded",
                          icon: Wifi,
                        },
                      ].map((service) => (
                        <div
                          key={service.service}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <service.icon className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">
                              {service.service}
                            </span>
                          </div>
                          <Badge
                            variant={
                              service.status === "Operational"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              service.status === "Operational"
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                          >
                            {service.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resource Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "CPU Usage", value: 45, color: "blue" },
                        { name: "Memory Usage", value: 67, color: "green" },
                        { name: "Storage Used", value: 23, color: "yellow" },
                        { name: "Bandwidth", value: 89, color: "purple" },
                      ].map((metric) => (
                        <div key={metric.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{metric.name}</span>
                            <span className="font-medium">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Placeholder sections for other features */}
          {[
            "admins",
            "organizations",
            "mosques",
            "companies",
            "learning-data",
            "sessions",
            "analytics",
            "roles",
            "logs",
            "settings",
          ].includes(activeSection) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeSection === "admins" && "Admin Management"}
                {activeSection === "organizations" && "Organizations"}
                {activeSection === "mosques" && "Mosques"}
                {activeSection === "companies" && "Companies"}
                {activeSection === "learning-data" && "Learning Data"}
                {activeSection === "sessions" && "Sessions"}
                {activeSection === "analytics" && "Analytics"}
                {activeSection === "roles" && "Roles & Access"}
                {activeSection === "logs" && "System Logs"}
                {activeSection === "settings" && "System Settings"}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeSection === "admins" &&
                  "Manage platform administrators and their permissions"}
                {activeSection === "organizations" &&
                  "Manage organizations using the platform"}
                {activeSection === "mosques" &&
                  "Manage mosque registrations and guard assignments"}
                {activeSection === "companies" &&
                  "Manage security companies and their contracts"}
                {activeSection === "learning-data" &&
                  "View and export platform learning data"}
                {activeSection === "sessions" &&
                  "Monitor user learning sessions and activity"}
                {activeSection === "analytics" &&
                  "Platform-wide analytics and performance metrics"}
                {activeSection === "roles" &&
                  "Configure user roles and access permissions"}
                {activeSection === "logs" &&
                  "View system logs and error tracking"}
                {activeSection === "settings" &&
                  "Configure platform-wide system settings"}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {activeSection === "admins" && "Add Admin"}
                {activeSection === "organizations" && "Add Organization"}
                {activeSection === "mosques" && "Add Mosque"}
                {activeSection === "companies" && "Add Company"}
                {activeSection === "learning-data" && "Export Data"}
                {activeSection === "sessions" && "View Sessions"}
                {activeSection === "analytics" && "Generate Report"}
                {activeSection === "roles" && "Create Role"}
                {activeSection === "logs" && "Export Logs"}
                {activeSection === "settings" && "Configure Settings"}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
