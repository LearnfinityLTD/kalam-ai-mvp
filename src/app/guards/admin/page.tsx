// app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState, useMemo as useReactMemo } from "react";
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
import AddGuardModal from "@/components/guards/AddGuardModal";
import {
  Target,
  Clock,
  CheckCircle,
  Star,
  Book,
  Users,
  Shield,
  BarChart3,
  UserPlus,
  Search,
  Download,
  Edit,
  Eye,
  AlertTriangle,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Menu,
  X,
  Building2,
  Landmark,
  Briefcase,
  Database,
  LineChart,
  Settings,
  CreditCard,
  Activity,
  KeyRound,
  LifeBuoy,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
  Filter,
  Award,
  RefreshCw,
  Server,
  HardDrive,
  Wifi,
  Globe,
  DollarSign,
  CreditCard as CreditCardIcon,
  Zap,
} from "lucide-react";

/** ===== Types aligned to your schema ===== */
type GuardStatus = "active" | "inactive" | "training";
type FilterStatus = "all" | GuardStatus;
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type StatColor = "blue" | "green" | "yellow" | "purple" | "red" | "orange";

interface Guard {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department: string;
  joinDate: string;
  lastActive: string;
  status: GuardStatus;
  completedScenarios: number;
  totalScenarios: number;
  averageScore: number;
  currentStreak: number;
  englishLevel?: string;
  assessmentCompleted: boolean;
  isAdmin: boolean;
}

interface AdminStats {
  totalGuards: number;
  activeGuards: number;
  totalScenarios: number;
  averageCompletionRate: number;
  averageScore: number;
  monthlyHours: number;
  assessmentCompletion: number;
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  completionRate: number;
  averageScore: number;
  status: "active" | "draft" | "archived";
  lastUpdated: string;
}

/** ===== Helpers ===== */
const mapDifficulty = (d: string | null | undefined): Difficulty => {
  const v = (d ?? "beginner").toLowerCase();
  if (v === "advanced") return "Advanced";
  if (v === "intermediate") return "Intermediate";
  return "Beginner";
};

export default function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // layout state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // page state
  const [activeSection, setActiveSection] = useState<
    | "overview"
    | "guards"
    | "scenarios"
    | "analytics"
    | "organizations"
    | "mosques"
    | "companies"
    | "learning-data"
    | "sessions"
    | "progress"
    | "settings"
    | "roles"
    | "billing"
    | "system-health"
    | "logs"
  >("overview");

  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddGuardModal, setShowAddGuardModal] = useState(false);

  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalGuards: 0,
    activeGuards: 0,
    totalScenarios: 0,
    averageCompletionRate: 0,
    averageScore: 0,
    monthlyHours: 0,
    assessmentCompletion: 0,
  });

  const [guards, setGuards] = useState<Guard[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      router.replace("/");
    }
  };

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load data - FIXED VERSION
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        console.log("🔍 Loading admin data...");

        // Get all guard profiles (including admins for comprehensive view)
        const { data: profiles, error: pErr } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_type", "guard");
        // Removed the .neq("is_admin", true) filter to show all guards

        if (pErr) {
          console.error("❌ Error fetching profiles:", pErr);
          throw pErr;
        }

        console.log("👥 Found profiles:", profiles?.length || 0);

        // Get streaks
        const { data: streaks, error: sErr } = await supabase
          .from("user_streaks")
          .select("user_id, current_streak, last_activity");
        if (sErr) console.warn("⚠️ Streaks query failed:", sErr);

        // Get sessions
        const { data: sessions, error: sessErr } = await supabase
          .from("learning_sessions")
          .select("user_id, created_at, session_duration");
        if (sessErr) console.warn("⚠️ Sessions query failed:", sessErr);

        // Get progress
        const { data: progress, error: prErr } = await supabase
          .from("user_progress")
          .select(
            "user_id, scenario_id, completion_status, score, last_attempt"
          );
        if (prErr) console.warn("⚠️ Progress query failed:", prErr);

        // Get scenarios
        const { data: scenariosRaw, error: scErr } = await supabase
          .from("scenarios")
          .select("id, title, segment, difficulty, created_at");
        if (scErr) console.warn("⚠️ Scenarios query failed:", scErr);

        // Process the data
        const streakByUser = new Map<
          string,
          { current: number; last?: string }
        >();
        (streaks ?? []).forEach((row) =>
          streakByUser.set(row.user_id, {
            current: Number(row.current_streak ?? 0),
            last: row.last_activity ?? undefined,
          })
        );

        const lastActiveByUser = new Map<string, string>();
        (sessions ?? []).forEach((row) => {
          const prev = lastActiveByUser.get(row.user_id);
          const cur = row.created_at as string;
          if (!prev || new Date(cur) > new Date(prev)) {
            lastActiveByUser.set(row.user_id, cur);
          }
        });

        const userAgg = new Map<
          string,
          {
            total: number;
            completed: number;
            scoreSum: number;
            scoreCount: number;
          }
        >();
        (progress ?? []).forEach((r) => {
          const u = r.user_id as string;
          const entry = userAgg.get(u) || {
            total: 0,
            completed: 0,
            scoreSum: 0,
            scoreCount: 0,
          };
          entry.total += 1;
          if ((r.completion_status as string) === "completed")
            entry.completed += 1;
          if (typeof r.score === "number") {
            entry.scoreSum += r.score;
            entry.scoreCount += 1;
          }
          userAgg.set(u, entry);
        });

        // Map profiles to Guard objects with your actual data structure
        const mappedGuards: Guard[] = (profiles ?? []).map((profile) => {
          const agg = userAgg.get(profile.id) || {
            total: 0,
            completed: 0,
            scoreSum: 0,
            scoreCount: 0,
          };
          const avgScore =
            agg.scoreCount > 0 ? agg.scoreSum / agg.scoreCount : 0;
          const streak = streakByUser.get(profile.id)?.current ?? 0;
          const lastActive =
            lastActiveByUser.get(profile.id) ?? profile.created_at ?? "";

          // Determine status based on activity
          const status: GuardStatus =
            new Date(lastActive) >
            new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
              ? "active"
              : streak > 0
              ? "training"
              : "inactive";

          return {
            id: profile.id,
            name: profile.full_name || "(No name)",
            email: undefined, // You don't have email in user_profiles, would need to join with auth.users
            phone: undefined,
            department: profile.mosque_id ? "Mosque Guard" : "Unassigned",
            joinDate: profile.created_at ?? "",
            lastActive,
            status,
            completedScenarios: agg.completed,
            totalScenarios: agg.total,
            averageScore: Number(avgScore.toFixed(1)),
            currentStreak: streak,
            englishLevel: profile.english_level,
            assessmentCompleted: profile.assessment_completed || false,
            isAdmin: profile.is_admin || false,
          };
        });

        // Process scenarios
        const scAgg = new Map<
          string,
          {
            total: number;
            completed: number;
            scoreSum: number;
            scoreCount: number;
          }
        >();
        (progress ?? []).forEach((r) => {
          const sid = r.scenario_id as string;
          const entry = scAgg.get(sid) || {
            total: 0,
            completed: 0,
            scoreSum: 0,
            scoreCount: 0,
          };
          entry.total += 1;
          if ((r.completion_status as string) === "completed")
            entry.completed += 1;
          if (typeof r.score === "number") {
            entry.scoreSum += r.score;
            entry.scoreCount += 1;
          }
          scAgg.set(sid, entry);
        });

        const mappedScenarios: Scenario[] = (scenariosRaw ?? []).map((s) => {
          const agg = scAgg.get(s.id) || {
            total: 0,
            completed: 0,
            scoreSum: 0,
            scoreCount: 0,
          };
          const completionRate =
            agg.total > 0 ? Math.round((agg.completed / agg.total) * 100) : 0;
          const averageScore =
            agg.scoreCount > 0 ? Math.round(agg.scoreSum / agg.scoreCount) : 0;
          return {
            id: s.id,
            title: s.title,
            category: s.segment ?? "guard",
            difficulty: mapDifficulty(s.difficulty),
            duration: 0,
            completionRate,
            averageScore,
            status: "active",
            lastUpdated: s.created_at ?? new Date().toISOString(),
          };
        });

        // Calculate stats
        const totalGuards = mappedGuards.length;
        const activeGuards = mappedGuards.filter(
          (x) => x.status === "active"
        ).length;
        const totalScenarios = mappedScenarios.length;
        const assessmentCompletion = mappedGuards.filter(
          (g) => g.assessmentCompleted
        ).length;

        const completionRates = mappedGuards.map((g) =>
          g.totalScenarios > 0
            ? (g.completedScenarios / g.totalScenarios) * 100
            : 0
        );
        const avgCompletion = completionRates.length
          ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
          : 0;

        const scores = mappedGuards
          .filter((g) => g.averageScore > 0)
          .map((g) => g.averageScore);
        const avgScore =
          scores.length > 0
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0;

        const totalMinutes = (sessions ?? []).reduce(
          (sum: number, s) => sum + Number(s.session_duration ?? 0),
          0
        );
        const monthlyHours = Math.round(totalMinutes / 60);

        if (!mounted) return;

        console.log("✅ Processed data:", {
          guards: mappedGuards.length,
          scenarios: mappedScenarios.length,
          avgScore: avgScore.toFixed(1),
          assessmentCompletion,
        });

        setScenarios(mappedScenarios);
        setGuards(mappedGuards);
        setAdminStats({
          totalGuards,
          activeGuards,
          totalScenarios,
          averageCompletionRate: Number(avgCompletion.toFixed(1)),
          averageScore: Number(avgScore.toFixed(1)),
          monthlyHours,
          assessmentCompletion,
        });
      } catch (e: unknown) {
        console.error("Error loading admin data:", e);
        if (!mounted) return;
        const errorMessage =
          e instanceof Error ? e.message : "Failed to load data.";
        setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const filteredGuards = useReactMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return guards.filter((guard) => {
      const matchesSearch =
        !q ||
        guard.name.toLowerCase().includes(q) ||
        (guard.email?.toLowerCase().includes(q) ?? false) ||
        guard.department.toLowerCase().includes(q) ||
        (guard.englishLevel?.toLowerCase().includes(q) ?? false);
      const matchesStatus =
        filterStatus === "all" || guard.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [guards, searchTerm, filterStatus]);

  // Rest of your existing code for colors, components, etc.
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

  // Sidebar config (keeping your existing navigation)
  type NavItem = {
    key: typeof activeSection;
    label: string;
    icon: LucideIcon;
    badge?: number | string;
    group?: "core" | "entities" | "data" | "admin";
  };

  const navItems: NavItem[] = [
    { key: "overview", label: "Overview", icon: BarChart3, group: "core" },
    {
      key: "guards",
      label: "Guards",
      icon: Shield,
      badge: adminStats.totalGuards,
      group: "core",
    },
    {
      key: "scenarios",
      label: "Scenarios",
      icon: Book,
      badge: adminStats.totalScenarios,
      group: "core",
    },
    { key: "analytics", label: "Analytics", icon: LineChart, group: "core" },
    {
      key: "organizations",
      label: "Organizations",
      icon: Building2,
      group: "entities",
    },
    { key: "mosques", label: "Mosques", icon: Landmark, group: "entities" },
    {
      key: "companies",
      label: "Companies",
      icon: Briefcase,
      group: "entities",
    },
    {
      key: "learning-data",
      label: "Learning Data",
      icon: Database,
      group: "data",
    },
    { key: "sessions", label: "Sessions", icon: Clock, group: "data" },
    { key: "progress", label: "Progress", icon: Target, group: "data" },
    { key: "settings", label: "Settings", icon: Settings, group: "admin" },
    { key: "roles", label: "Roles & Access", icon: KeyRound, group: "admin" },
    { key: "billing", label: "Billing", icon: CreditCard, group: "admin" },
    {
      key: "system-health",
      label: "System Health",
      icon: Activity,
      group: "admin",
    },
    { key: "logs", label: "Logs", icon: LifeBuoy, group: "admin" },
  ];

  const SidebarSection = ({
    title,
    items,
  }: {
    title: string;
    items: NavItem[];
  }) => (
    <div className="mt-4">
      {!sidebarCollapsed && (
        <p className="px-3 text-[11px] uppercase tracking-wide text-gray-500 mb-2">
          {title}
        </p>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const active = activeSection === item.key;
          return (
            <Button
              key={item.key}
              onClick={() => {
                setActiveSection(item.key);
                if (
                  [
                    "overview",
                    "guards",
                    "scenarios",
                    "analytics",
                    "settings",
                  ].includes(item.key)
                ) {
                  setActiveTab(item.key === "settings" ? "settings" : item.key);
                }
                setSidebarOpen(false);
              }}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition",
                active
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className="ml-auto inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );

  // Render section content based on activeSection
  const renderSectionContent = () => {
    switch (activeSection) {
      case "organizations":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Organizations
              </h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Organization
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No organizations found
                  </h3>
                  <p className="text-gray-500">
                    Start by creating your first organization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "mosques":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Mosques</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Mosque
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Landmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No mosques registered
                  </h3>
                  <p className="text-gray-500">
                    Add mosques to organize your security guards effectively.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "companies":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Companies</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No companies found
                  </h3>
                  <p className="text-gray-500">
                    Register security companies to manage their guards.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "learning-data":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Learning Data
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total Sessions"
                value="1,247"
                subtitle="This month"
                icon={Clock}
                color="blue"
                trend="+12%"
              />
              <StatsCard
                title="Avg Session Duration"
                value="8.5 min"
                subtitle="Per session"
                icon={Target}
                color="green"
              />
              <StatsCard
                title="Data Storage"
                value="2.4 GB"
                subtitle="Learning data"
                icon={Database}
                color="purple"
              />
            </div>
          </div>
        );

      case "sessions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Learning Sessions
              </h2>
              <div className="flex gap-2">
                <Input placeholder="Search sessions..." className="w-64" />
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">Session #{1000 + i}</p>
                        <p className="text-sm text-gray-500">
                          Guard Name • Emergency Response
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">12 min</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "progress":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Learning Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Overall Completion"
                value="67%"
                subtitle="Average across all guards"
                icon={Target}
                color="blue"
              />
              <StatsCard
                title="High Performers"
                value="23"
                subtitle="90%+ completion rate"
                icon={Award}
                color="green"
              />
              <StatsCard
                title="Need Support"
                value="8"
                subtitle="Below 30% completion"
                icon={AlertTriangle}
                color="red"
              />
              <StatsCard
                title="Active Learners"
                value="156"
                subtitle="This week"
                icon={Users}
                color="purple"
              />
            </div>
          </div>
        );

      case "roles":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Roles & Access
              </h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Super Admin", users: 2, color: "red" },
                { name: "Admin", users: 5, color: "blue" },
                { name: "Manager", users: 12, color: "green" },
                {
                  name: "Guard",
                  users: adminStats.totalGuards - 19,
                  color: "gray",
                },
              ].map((role) => (
                <Card key={role.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {role.users} users assigned
                    </p>
                    <Badge variant="secondary">{role.color}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Billing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Monthly Cost"
                value="$1,247"
                subtitle="Current billing period"
                icon={DollarSign}
                color="green"
              />
              <StatsCard
                title="Active Guards"
                value={adminStats.activeGuards}
                subtitle="Billable users"
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="Usage"
                value="89%"
                subtitle="Of plan limit"
                icon={Zap}
                color="yellow"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Jan 2025", amount: "$1,247", status: "Paid" },
                    { date: "Dec 2024", amount: "$1,189", status: "Paid" },
                    { date: "Nov 2024", amount: "$1,156", status: "Paid" },
                  ].map((invoice) => (
                    <div
                      key={invoice.date}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-gray-500">Invoice</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <Badge
                          variant="secondary"
                          className="text-green-700 bg-green-100"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "system-health":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
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
                title="Active Users"
                value="89"
                subtitle="Currently online"
                icon={Users}
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
                          <span className="font-medium">{service.service}</span>
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
        );

      case "logs":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">System Logs</h2>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    {
                      time: "14:23:45",
                      level: "ERROR",
                      message: "Failed to connect to external API",
                      service: "auth-service",
                    },
                    {
                      time: "14:22:31",
                      level: "WARNING",
                      message: "High memory usage detected",
                      service: "web-server",
                    },
                    {
                      time: "14:21:15",
                      level: "INFO",
                      message: "User login successful",
                      service: "auth-service",
                    },
                    {
                      time: "14:20:02",
                      level: "INFO",
                      message: "Scenario completed by user",
                      service: "learning-engine",
                    },
                    {
                      time: "14:19:44",
                      level: "WARNING",
                      message: "Rate limit exceeded for IP",
                      service: "api-gateway",
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 py-2 px-3 rounded-lg bg-gray-50 font-mono text-sm"
                    >
                      <span className="text-gray-600">{log.time}</span>
                      <Badge
                        variant={
                          log.level === "ERROR"
                            ? "destructive"
                            : log.level === "WARNING"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          log.level === "WARNING"
                            ? "bg-yellow-100 text-yellow-700"
                            : log.level === "INFO"
                            ? "bg-blue-100 text-blue-700"
                            : ""
                        }
                      >
                        {log.level}
                      </Badge>
                      <span className="flex-1">{log.message}</span>
                      <span className="text-gray-500 text-xs">
                        {log.service}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-4">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-red-50">
        <div className="bg-white border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-700 font-medium mb-2">Failed to load</p>
          <p className="text-sm text-gray-600">{error}</p>
          <Button className="mt-4" onClick={() => location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white border-b h-14">
        <div className="flex items-center justify-between px-4 md:px-6 h-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="hidden md:inline-flex"
              onClick={() => setSidebarCollapsed((v) => !v)}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>

            <div className="ml-1">
              <h1 className="text-xl font-bold text-gray-900">Admin</h1>
              <p className="text-xs text-gray-600 -mt-0.5">
                {adminStats.totalGuards} guards • {adminStats.totalScenarios}{" "}
                scenarios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <Button onClick={() => setShowAddGuardModal(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Guard
            </Button>
            <AddGuardModal
              isOpen={showAddGuardModal}
              onClose={() => setShowAddGuardModal(false)}
              onSuccess={() => {
                window.location.reload();
              }}
            />
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={[
            "fixed md:sticky z-50 md:z-10 bg-white border-r transition-all",
            "inset-y-0 md:top-14",
            "w-64 md:w-auto",
            sidebarCollapsed ? "md:w-16" : "md:w-64",
            "h-screen md:h-[calc(100vh-56px)]",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-between md:hidden px-4 py-3 border-b">
            <span className="font-semibold">Navigation</span>
            <Button variant="outline" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-2 py-3 overflow-y-auto max-h-[calc(100vh-56px)] pb-24">
            <SidebarSection
              title="Core"
              items={navItems.filter((i) => i.group === "core")}
            />
            <SidebarSection
              title="Entities"
              items={navItems.filter((i) => i.group === "entities")}
            />
            <SidebarSection
              title="Learning Data"
              items={navItems.filter((i) => i.group === "data")}
            />
            <SidebarSection
              title="Administration"
              items={navItems.filter((i) => i.group === "admin")}
            />
          </div>
        </aside>

        {/* Main content */}
        <main
          className={[
            "flex-1 min-w-0",
            "md:ml-0",
            sidebarCollapsed ? "md:pl-16" : "md:pl-64",
          ].join(" ")}
        >
          <div className="px-4 md:px-6 py-6">
            {[
              "overview",
              "guards",
              "scenarios",
              "analytics",
              "settings",
            ].includes(activeSection) ? (
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

                {/* OVERVIEW */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Total Guards"
                      value={adminStats.totalGuards}
                      subtitle="All registered"
                      icon={Users}
                      color="blue"
                    />
                    <StatsCard
                      title="Active Guards"
                      value={adminStats.activeGuards}
                      subtitle="Recently active"
                      icon={Shield}
                      color="green"
                    />
                    <StatsCard
                      title="Assessment Rate"
                      value={`${Math.round(
                        (adminStats.assessmentCompletion /
                          Math.max(adminStats.totalGuards, 1)) *
                          100
                      )}%`}
                      subtitle={`${adminStats.assessmentCompletion}/${adminStats.totalGuards} completed`}
                      icon={CheckCircle}
                      color="yellow"
                    />
                    <StatsCard
                      title="Avg Score"
                      value={`${adminStats.averageScore}%`}
                      subtitle="Assessment average"
                      icon={Star}
                      color="purple"
                    />
                  </div>

                  {/* Guards Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Guard Status Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {guards.slice(0, 5).map((guard) => (
                            <div
                              key={guard.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {guard.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {guard.englishLevel || "No level"} •{" "}
                                  {guard.assessmentCompleted
                                    ? "Assessed"
                                    : "Pending"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
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
                                {guard.isAdmin && (
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-50 text-purple-700"
                                  >
                                    Admin
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>English Levels Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {["A1", "A2", "B1", "B2", "C1"].map((level) => {
                            const count = guards.filter(
                              (g) => g.englishLevel === level
                            ).length;
                            const percentage =
                              adminStats.totalGuards > 0
                                ? (count / adminStats.totalGuards) * 100
                                : 0;
                            return (
                              <div
                                key={level}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm font-medium">
                                  {level} Level
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600 w-8">
                                    {count}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* GUARDS */}
                <TabsContent value="guards" className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Guards Management
                      </h2>
                      <p className="text-gray-600">
                        Manage security guards and their training progress
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Guard
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search guards..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={(value) =>
                        setFilterStatus(value as FilterStatus)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guards Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Guards ({filteredGuards.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b bg-gray-50">
                            <tr>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Guard
                              </th>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Department
                              </th>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Status
                              </th>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Progress
                              </th>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Score
                              </th>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Streak
                              </th>
                              <th className="text-left p-4 font-medium text-gray-700">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredGuards.map((guard) => (
                              <tr key={guard.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {guard.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {guard.englishLevel || "No level"} •
                                      Joined{" "}
                                      {new Date(
                                        guard.joinDate
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="text-sm">
                                    {guard.department}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
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
                                    {guard.isAdmin && (
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700"
                                      >
                                        Admin
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>
                                        {guard.completedScenarios}/
                                        {guard.totalScenarios}
                                      </span>
                                      <span>
                                        {guard.totalScenarios > 0
                                          ? Math.round(
                                              (guard.completedScenarios /
                                                guard.totalScenarios) *
                                                100
                                            )
                                          : 0}
                                        %
                                      </span>
                                    </div>
                                    <Progress
                                      value={
                                        guard.totalScenarios > 0
                                          ? (guard.completedScenarios /
                                              guard.totalScenarios) *
                                            100
                                          : 0
                                      }
                                      className="h-2"
                                    />
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`font-medium ${scoreClass(
                                      guard.averageScore
                                    )}`}
                                  >
                                    {guard.averageScore}%
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span>{guard.currentStreak}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
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

                {/* SCENARIOS */}
                <TabsContent value="scenarios" className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Scenarios Management
                      </h2>
                      <p className="text-gray-600">
                        Manage training scenarios and content
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Scenario
                      </Button>
                    </div>
                  </div>

                  {/* Scenarios Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scenarios.map((scenario) => (
                      <Card
                        key={scenario.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {scenario.title}
                              </CardTitle>
                              <p className="text-sm text-gray-600 mt-1">
                                {scenario.category}
                              </p>
                            </div>
                            <Badge
                              variant={
                                scenario.difficulty === "Beginner"
                                  ? "secondary"
                                  : scenario.difficulty === "Intermediate"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {scenario.difficulty}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Completion Rate</p>
                                <p className="font-semibold">
                                  {scenario.completionRate}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Avg Score</p>
                                <p className="font-semibold">
                                  {scenario.averageScore}%
                                </p>
                              </div>
                            </div>
                            <Progress
                              value={scenario.completionRate}
                              className="h-2"
                            />
                            <div className="flex items-center justify-between pt-2">
                              <Badge
                                variant="outline"
                                className={
                                  scenario.status === "active"
                                    ? "bg-green-50 text-green-700"
                                    : scenario.status === "draft"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-gray-50 text-gray-700"
                                }
                              >
                                {scenario.status}
                              </Badge>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* ANALYTICS */}
                <TabsContent value="analytics" className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analytics Dashboard
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                      title="Total Learning Hours"
                      value={`${adminStats.monthlyHours}h`}
                      subtitle="This month"
                      icon={Clock}
                      color="blue"
                      trend="+23%"
                    />
                    <StatsCard
                      title="Completion Rate"
                      value={`${adminStats.averageCompletionRate}%`}
                      subtitle="Average across scenarios"
                      icon={Target}
                      color="green"
                      trend="+8%"
                    />
                    <StatsCard
                      title="Assessment Score"
                      value={`${adminStats.averageScore}%`}
                      subtitle="System average"
                      icon={Star}
                      color="purple"
                      trend="+5%"
                    />
                    <StatsCard
                      title="Active Streaks"
                      value={guards.filter((g) => g.currentStreak > 0).length}
                      subtitle="Guards with streaks"
                      icon={Award}
                      color="orange"
                      trend="+12%"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p>Performance chart would go here</p>
                            <p className="text-sm">
                              Integration with charting library needed
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Top Performers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {guards
                            .sort((a, b) => b.averageScore - a.averageScore)
                            .slice(0, 5)
                            .map((guard, index) => (
                              <div
                                key={guard.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-medium">{guard.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {guard.department}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {guard.averageScore}%
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {guard.completedScenarios} completed
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* SETTINGS */}
                <TabsContent value="settings" className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    System Settings
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            System Name
                          </label>
                          <Input defaultValue="Guard Training Platform" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Language
                          </label>
                          <Select defaultValue="en">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <Select defaultValue="utc">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utc">UTC</SelectItem>
                              <SelectItem value="gmt">GMT</SelectItem>
                              <SelectItem value="est">EST</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">
                          Save General Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Score to Pass (%)
                          </label>
                          <Input
                            type="number"
                            defaultValue="70"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Attempts per Scenario
                          </label>
                          <Input
                            type="number"
                            defaultValue="3"
                            min="1"
                            max="10"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Streak Reset Days
                          </label>
                          <Input
                            type="number"
                            defaultValue="7"
                            min="1"
                            max="30"
                          />
                        </div>
                        <Button className="w-full">
                          Save Learning Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Email Notifications
                            </label>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Daily Reports
                            </label>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Low Performance Alerts
                            </label>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              System Maintenance Alerts
                            </label>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded"
                            />
                          </div>
                        </div>
                        <Button className="w-full">
                          Save Notification Settings
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <Input
                            type="number"
                            defaultValue="60"
                            min="15"
                            max="480"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password Reset Link Expiry (hours)
                          </label>
                          <Input
                            type="number"
                            defaultValue="24"
                            min="1"
                            max="168"
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Two-Factor Authentication
                            </label>
                            <input type="checkbox" className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Login Attempt Logging
                            </label>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded"
                            />
                          </div>
                        </div>
                        <Button className="w-full">
                          Save Security Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              // Render individual section content when not using tabs
              renderSectionContent()
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
