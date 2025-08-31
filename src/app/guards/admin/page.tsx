"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import {
  Target,
  Clock,
  CheckCircle,
  Star,
  Book,
  Users,
  Settings,
  BarChart3,
  UserPlus,
  Search,
  Download,
  Edit,
  Eye,
  AlertTriangle,
  TrendingUp,
  Shield,
  FileText,
  Plus,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

type GuardStatus = "active" | "inactive" | "training";
type FilterStatus = "all" | GuardStatus;
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type StatColor = "blue" | "green" | "yellow" | "purple" | "red" | "orange";

interface Guard {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  lastActive: string;
  status: GuardStatus;
  completedScenarios: number;
  totalScenarios: number;
  averageScore: number;
  currentStreak: number;
}

interface AdminStats {
  totalGuards: number;
  activeGuards: number;
  totalScenarios: number;
  averageCompletionRate: number;
  averageScore: number;
  monthlyHours: number;
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  duration: number; // minutes
  completionRate: number; // 0-100
  averageScore: number; // 0-100
  status: "active" | "draft" | "archived";
  lastUpdated: string; // ISO date
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const [adminStats] = useState<AdminStats>({
    totalGuards: 156,
    activeGuards: 142,
    totalScenarios: 24,
    averageCompletionRate: 67.3,
    averageScore: 83.2,
    monthlyHours: 1847,
  });

  const [guards] = useState<Guard[]>([
    {
      id: "1",
      name: "Ahmed Al-Rashid",
      email: "ahmed.rashid@company.com",
      phone: "+971-50-123-4567",
      department: "Main Entrance",
      joinDate: "2024-03-15",
      lastActive: "2025-08-30",
      status: "active",
      completedScenarios: 18,
      totalScenarios: 24,
      averageScore: 89.5,
      currentStreak: 7,
    },
    {
      id: "2",
      name: "Mohammed Hassan",
      email: "m.hassan@company.com",
      phone: "+971-50-234-5678",
      department: "Parking Area",
      joinDate: "2024-05-20",
      lastActive: "2025-08-29",
      status: "active",
      completedScenarios: 12,
      totalScenarios: 24,
      averageScore: 76.8,
      currentStreak: 3,
    },
    {
      id: "3",
      name: "Omar Abdullah",
      email: "omar.abdullah@company.com",
      phone: "+971-50-345-6789",
      department: "Reception",
      joinDate: "2024-01-10",
      lastActive: "2025-08-28",
      status: "training",
      completedScenarios: 6,
      totalScenarios: 24,
      averageScore: 68.2,
      currentStreak: 1,
    },
    {
      id: "4",
      name: "Khalid Mahmoud",
      email: "khalid.mahmoud@company.com",
      phone: "+971-50-456-7890",
      department: "Security Office",
      joinDate: "2023-11-05",
      lastActive: "2025-08-25",
      status: "inactive",
      completedScenarios: 22,
      totalScenarios: 24,
      averageScore: 92.1,
      currentStreak: 0,
    },
  ]);

  const [scenarios] = useState<Scenario[]>([
    {
      id: "1",
      title: "Welcome Greeting",
      category: "Communication",
      difficulty: "Beginner",
      duration: 5,
      completionRate: 94.2,
      averageScore: 87.3,
      status: "active",
      lastUpdated: "2025-08-15",
    },
    {
      id: "2",
      title: "Emergency Protocols",
      category: "Safety",
      difficulty: "Advanced",
      duration: 15,
      completionRate: 67.8,
      averageScore: 79.5,
      status: "active",
      lastUpdated: "2025-08-20",
    },
    {
      id: "3",
      title: "Visitor Registration",
      category: "Administrative",
      difficulty: "Intermediate",
      duration: 10,
      completionRate: 82.1,
      averageScore: 84.7,
      status: "active",
      lastUpdated: "2025-08-10",
    },
    {
      id: "4",
      title: "Cultural Sensitivity",
      category: "Soft Skills",
      difficulty: "Beginner",
      duration: 8,
      completionRate: 89.4,
      averageScore: 91.2,
      status: "draft",
      lastUpdated: "2025-08-25",
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredGuards = guards.filter((guard) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      guard.name.toLowerCase().includes(q) ||
      guard.email.toLowerCase().includes(q) ||
      guard.department.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "all" || guard.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Accessible, semantic colors for the Score column
  const scoreClass = (score: number) =>
    score >= 80
      ? "text-green-700"
      : score >= 60
      ? "text-yellow-700"
      : "text-red-700";

  const colorClasses: Record<StatColor, string> = {
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    red: "text-red-500",
    orange: "text-orange-500",
  };

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
    icon: LucideIcon;
    color?: StatColor;
    trend?: string;
  }) => (
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
          <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage guards, scenarios, and training programs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Guard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="guards">Guards</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Guards"
                value={adminStats.totalGuards}
                subtitle="Registered users"
                icon={Users}
                color="blue"
                trend="+12 this month"
              />
              <StatsCard
                title="Active Guards"
                value={adminStats.activeGuards}
                subtitle="Currently training"
                icon={Shield}
                color="green"
                trend="+8 this week"
              />
              <StatsCard
                title="Completion Rate"
                value={`${adminStats.averageCompletionRate}%`}
                subtitle="Average progress"
                icon={Target}
                color="yellow"
                trend="+5.2% this month"
              />
              <StatsCard
                title="Training Hours"
                value={`${adminStats.monthlyHours}h`}
                subtitle="This month"
                icon={Clock}
                color="purple"
                trend="+234h this month"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <Badge className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response</span>
                    <Badge className="bg-green-100 text-green-800">
                      Normal
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={67} className="w-20 h-2" />
                      <span className="text-xs text-gray-500">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserPlus className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-400">
                          New guard registered
                        </p>
                        <p className="text-xs text-gray-500">
                          Ahmed Al-Rashid - 2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Edit className="w-4 h-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-400">
                          Scenario updated
                        </p>
                        <p className="text-xs text-gray-500">
                          Emergency Protocols - 4 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-400">
                          Low completion alert
                        </p>
                        <p className="text-xs text-gray-500">
                          Cultural Sensitivity - 6 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">
                      Main Entrance
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">42</p>
                    <p className="text-xs text-blue-600">Guards</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Reception</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">38</p>
                    <p className="text-xs text-green-600">Guards</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900">
                      Parking Area
                    </h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                      34
                    </p>
                    <p className="text-xs text-purple-600">Guards</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-orange-900">
                      Security Office
                    </h3>
                    <p className="text-2xl font-bold text-orange-600 mt-2">
                      42
                    </p>
                    <p className="text-xs text-orange-600">Guards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guards */}
          <TabsContent value="guards" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search guards by name, email, or department..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as FilterStatus)
                      }
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="training">Training</option>
                    </select>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Guards ({filteredGuards.length})</CardTitle>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Guard
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Guard
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Progress
                        </th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">
                          Score
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGuards.map((guard) => (
                        <tr
                          key={guard.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {guard.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {guard.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">
                              {guard.department}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="w-24">
                              <Progress
                                value={
                                  (guard.completedScenarios /
                                    guard.totalScenarios) *
                                  100
                                }
                                className="h-2 mb-1"
                              />
                              <p className="text-xs text-gray-500">
                                {guard.completedScenarios}/
                                {guard.totalScenarios}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-semibold ${scoreClass(
                                guard.averageScore
                              )}`}
                            >
                              {guard.averageScore}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                guard.status === "active"
                                  ? "default"
                                  : guard.status === "training"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {guard.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="w-4 h-4" />
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
          </TabsContent>

          {/* Scenarios */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Scenario Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Scenario
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Book className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{scenarios.length}</p>
                  <p className="text-sm text-gray-600">Total Scenarios</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {scenarios.filter((s) => s.status === "active").length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Edit className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {scenarios.filter((s) => s.status === "draft").length}
                  </p>
                  <p className="text-sm text-gray-600">Draft</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {adminStats.averageScore}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Score</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {scenario.title}
                            </h3>
                            <Badge variant="secondary">
                              {scenario.category}
                            </Badge>
                            <Badge
                              variant={
                                scenario.difficulty === "Beginner"
                                  ? "default"
                                  : scenario.difficulty === "Intermediate"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {scenario.difficulty}
                            </Badge>
                            <Badge
                              variant={
                                scenario.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {scenario.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{scenario.duration} min</span>
                            <span>{scenario.completionRate}% completion</span>
                            <span>{scenario.averageScore}% avg score</span>
                            <span>Updated {scenario.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Performance chart would be rendered here</p>
                      <p className="text-sm">
                        Integration with charting library needed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scenario Completion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scenarios.map((scenario) => (
                      <div key={scenario.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{scenario.title}</span>
                          <span>{scenario.completionRate}%</span>
                        </div>
                        <Progress
                          value={scenario.completionRate}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Training Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-600">23</p>
                    <p className="text-sm text-gray-600">
                      Guards with 100% completion
                    </p>
                  </div>
                  <div className="text-center">
                    <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-600">89%</p>
                    <p className="text-sm text-gray-600">
                      Average scenario score
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-600">12.3</p>
                    <p className="text-sm text-gray-600">Avg hours per guard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-assign Scenarios</p>
                      <p className="text-sm text-gray-600">
                        Automatically assign new scenarios
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Performance Alerts</p>
                      <p className="text-sm text-gray-600">
                        Alert when scores drop below threshold
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Notifications</p>
                      <p className="text-sm text-gray-600">
                        Send progress updates to guards
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Streak Reminders</p>
                      <p className="text-sm text-gray-600">
                        Remind guards to maintain streaks
                      </p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Minimum Pass Score
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue={70}
                      min={0}
                      max={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Scenario Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue={30}
                      min={5}
                      max={60}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Maximum Retries
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue={3}
                      min={1}
                      max={10}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Streak Reset Days
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      defaultValue={3}
                      min={1}
                      max={7}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Notification Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Email Templates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Welcome Email</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Progress Update</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Streak Reminder</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">SMS Templates</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Daily Reminder</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Achievement Alert</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="text-sm">Low Score Alert</span>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Download className="w-6 h-6" />
                    <span>Export Data</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Settings className="w-6 h-6" />
                    <span>System Config</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <FileText className="w-6 h-6" />
                    <span>Generate Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Low Completion Rate Alert
                  </p>
                  <p className="text-xs text-red-700">
                    Emergency Protocols scenario has 67% completion rate (below
                    70% threshold)
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">
                    Inactive Guards
                  </p>
                  <p className="text-xs text-yellow-700">
                    14 guards haven't logged in for more than 5 days
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Contact
                </Button>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    Performance Improvement
                  </p>
                  <p className="text-xs text-blue-700">
                    Overall training scores increased by 5.2% this month
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
