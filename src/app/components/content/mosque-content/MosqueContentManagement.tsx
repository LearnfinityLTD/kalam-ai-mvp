import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  Target,
  TrendingUp,
  Download,
  Upload,
  Play,
  BookOpen,
  Award,
  CheckCircle,
  AlertCircle,
  X,
  Settings,
  Compass,
  Shield,
  Globe,
  UserCheck,
  Languages,
  MapPin,
  Calendar,
  Moon,
  Sun,
  Heart,
  HandHeart,
  BarChart3,
  Activity,
  Bell,
  Filter,
} from "lucide-react";
import { AdminContext, EmployeeData } from "@/app/types/admin";
// Types for Mosque content management
interface MosqueContent {
  id: string;
  title: string;
  type:
    | "pilgrim_service"
    | "security_protocol"
    | "crowd_management"
    | "cultural_guidance"
    | "emergency_response";
  category:
    | "hajj"
    | "umrah"
    | "daily_prayers"
    | "ramadan"
    | "security"
    | "cultural"
    | "emergency";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  language: "english" | "arabic" | "both";
  status: "draft" | "review" | "approved" | "archived";
  location: string;
  description: string;
  duration: number; // in minutes
  completions: number;
  rating: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "critical";
  seasonalContent: boolean; // For Hajj/Ramadan specific content
  certificationRequired: boolean;
  mediaFiles: MediaFile[];
  learningObjectives: string[];
  islamicGuidance?: string[];
  culturalSensitivity?: string[];
}

interface MediaFile {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  caption?: string;
  duration?: number;
}

interface MosqueContentSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

const MosqueContentManagement: React.FC<MosqueContentSectionProps> = ({
  adminContext,
  employees,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [content, setContent] = useState<MosqueContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeasonal, setFilterSeasonal] = useState("all");

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: MosqueContent[] = [
      {
        id: "1",
        title: "Hajj Pilgrim Guidance and Assistance",
        type: "pilgrim_service",
        category: "hajj",
        level: "B1",
        language: "both",
        status: "approved",
        location: "Grand Mosque Courtyard",
        description:
          "Comprehensive guidance for assisting Hajj pilgrims with rituals, directions, and spiritual support during their pilgrimage.",
        duration: 45,
        completions: 456,
        rating: 4.9,
        lastUpdated: "2024-09-15",
        createdBy: "Sheikh Abdullah Al-Harami",
        tags: ["Hajj", "pilgrims", "rituals", "guidance", "spiritual"],
        priority: "critical",
        seasonalContent: true,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "1",
            type: "video",
            url: "/videos/hajj-guidance.mp4",
            caption: "Hajj pilgrim assistance procedures",
          },
          {
            id: "2",
            type: "document",
            url: "/docs/hajj-rituals-guide.pdf",
            caption: "Complete Hajj rituals guide",
          },
        ],
        learningObjectives: [
          "Understand the spiritual significance of Hajj rituals",
          "Provide respectful guidance to pilgrims from diverse backgrounds",
          "Assist with crowd flow and safety during peak times",
        ],
        islamicGuidance: [
          "Remember that every pilgrim is a guest of Allah",
          "Maintain patience and compassion at all times",
          "Respect the sacred nature of the pilgrimage",
        ],
        culturalSensitivity: [
          "Pilgrims come from over 180 countries with different customs",
          "Many may not speak Arabic - use simple, clear communication",
          "Be sensitive to different levels of Islamic knowledge",
        ],
      },
      {
        id: "2",
        title: "International Pilgrim Communication",
        type: "cultural_guidance",
        category: "cultural",
        level: "B2",
        language: "both",
        status: "approved",
        location: "All Prayer Areas",
        description:
          "Effective communication strategies for assisting international pilgrims with diverse linguistic and cultural backgrounds.",
        duration: 30,
        completions: 378,
        rating: 4.8,
        lastUpdated: "2024-09-12",
        createdBy: "Imam Hassan Al-Madani",
        tags: [
          "international",
          "communication",
          "cultural",
          "diversity",
          "languages",
        ],
        priority: "high",
        seasonalContent: false,
        certificationRequired: false,
        mediaFiles: [
          {
            id: "3",
            type: "video",
            url: "/videos/international-comm.mp4",
            caption: "Multi-cultural communication examples",
          },
        ],
        learningObjectives: [
          "Communicate effectively across language barriers",
          "Understand cultural differences in worship practices",
          "Provide inclusive assistance to all pilgrims",
        ],
        culturalSensitivity: [
          "Different madhabs (schools of thought) have varying practices",
          "Respect cultural dress codes and customs",
          "Be patient with first-time pilgrims",
        ],
      },
      {
        id: "3",
        title: "Emergency Response in Sacred Spaces",
        type: "emergency_response",
        category: "emergency",
        level: "B1",
        language: "both",
        status: "review",
        location: "All Sacred Areas",
        description:
          "Emergency response procedures specifically designed for sacred spaces, balancing safety with religious respect.",
        duration: 35,
        completions: 234,
        rating: 4.9,
        lastUpdated: "2024-09-10",
        createdBy: "Captain Omar Al-Ameen",
        tags: ["emergency", "safety", "sacred", "response", "coordination"],
        priority: "critical",
        seasonalContent: false,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "4",
            type: "video",
            url: "/videos/sacred-emergency.mp4",
            caption: "Emergency procedures in sacred spaces",
          },
        ],
        learningObjectives: [
          "Execute emergency procedures while maintaining sanctity",
          "Coordinate with medical teams and authorities",
          "Communicate emergency instructions clearly to international crowds",
        ],
        islamicGuidance: [
          "Preserve the sanctity of the sacred space even during emergencies",
          "Prioritize the safety of pilgrims while maintaining respect",
          "Remember that helping others in distress is a sacred duty",
        ],
      },
      {
        id: "4",
        title: "Crowd Management During Peak Prayer Times",
        type: "crowd_management",
        category: "daily_prayers",
        level: "B1",
        language: "both",
        status: "approved",
        location: "Main Prayer Hall",
        description:
          "Effective crowd management techniques for organizing large congregations during peak prayer times and Friday prayers.",
        duration: 25,
        completions: 289,
        rating: 4.7,
        lastUpdated: "2024-09-08",
        createdBy: "Ustadh Ahmed Al-Crowd",
        tags: ["crowd", "management", "prayers", "organization", "flow"],
        priority: "high",
        seasonalContent: false,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "5",
            type: "video",
            url: "/videos/crowd-management.mp4",
            caption: "Prayer time crowd management",
          },
        ],
        learningObjectives: [
          "Organize prayer rows efficiently and respectfully",
          "Guide congregation flow without disruption",
          "Handle overcrowding during peak times",
        ],
        islamicGuidance: [
          "Ensure equal access to prayer space for all worshippers",
          "Maintain the dignity and focus of prayer",
          "Remember that organization serves worship, not vice versa",
        ],
      },
      {
        id: "5",
        title: "Ramadan Special Services and Support",
        type: "pilgrim_service",
        category: "ramadan",
        level: "A2",
        language: "both",
        status: "draft",
        location: "Iftar Areas and Prayer Halls",
        description:
          "Special services and considerations for pilgrims and worshippers during the holy month of Ramadan.",
        duration: 40,
        completions: 156,
        rating: 4.6,
        lastUpdated: "2024-09-18",
        createdBy: "Sheikh Yusuf Al-Ramadan",
        tags: ["Ramadan", "iftar", "fasting", "special", "services"],
        priority: "high",
        seasonalContent: true,
        certificationRequired: false,
        mediaFiles: [
          {
            id: "6",
            type: "video",
            url: "/videos/ramadan-services.mp4",
            caption: "Ramadan service protocols",
          },
        ],
        learningObjectives: [
          "Understand Ramadan's spiritual significance",
          "Provide appropriate services for fasting pilgrims",
          "Coordinate iftar and suhoor services effectively",
        ],
        islamicGuidance: [
          "Support the spiritual journey of fasting worshippers",
          "Ensure iftar services maintain Islamic etiquette",
          "Remember that serving others during Ramadan brings great reward",
        ],
        culturalSensitivity: [
          "Different cultures have varying Ramadan traditions",
          "Be sensitive to travelers who may have different fasting schedules",
          "Accommodate elderly and ill pilgrims appropriately",
        ],
      },
      {
        id: "6",
        title: "Security Protocols in Holy Sites",
        type: "security_protocol",
        category: "security",
        level: "B2",
        language: "both",
        status: "approved",
        location: "All Security Checkpoints",
        description:
          "Security procedures that balance safety requirements with respect for the sacred nature of holy sites.",
        duration: 50,
        completions: 198,
        rating: 4.8,
        lastUpdated: "2024-09-14",
        createdBy: "Major Khalid Al-Amn",
        tags: ["security", "safety", "protocols", "sacred", "respect"],
        priority: "critical",
        seasonalContent: false,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "7",
            type: "video",
            url: "/videos/security-protocols.mp4",
            caption: "Sacred site security procedures",
          },
          {
            id: "8",
            type: "document",
            url: "/docs/security-manual.pdf",
            caption: "Complete security manual",
          },
        ],
        learningObjectives: [
          "Implement security measures with Islamic respect",
          "Handle security incidents while maintaining sanctity",
          "Communicate security requirements clearly to pilgrims",
        ],
        islamicGuidance: [
          "Protect the house of Allah and its visitors",
          "Maintain dignity while ensuring safety",
          "Remember that security serves worship and pilgrimage",
        ],
      },
    ];

    setContent(mockContent);
  }, []);

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesSeasonal =
      filterSeasonal === "all" ||
      (filterSeasonal === "seasonal" && item.seasonalContent) ||
      (filterSeasonal === "year_round" && !item.seasonalContent);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStatus &&
      matchesSeasonal
    );
  });

  const getContentStats = () => {
    return {
      total: content.length,
      approved: content.filter((c) => c.status === "approved").length,
      seasonal: content.filter((c) => c.seasonalContent).length,
      critical: content.filter((c) => c.priority === "critical").length,
      totalCompletions: content.reduce((sum, c) => sum + c.completions, 0),
      averageRating:
        content.reduce((sum, c) => sum + c.rating, 0) / content.length,
    };
  };

  const stats = getContentStats();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Building className="mr-3" size={32} />
              Pilgrim Services Content Management
            </h1>
            <p className="mt-2 text-emerald-100">
              Manage Islamic guidance and pilgrim service training for{" "}
              {adminContext.scope.organizationName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.total}</p>
            <p className="text-emerald-100">Service Training Modules</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: "Approved Content",
            value: stats.approved,
            icon: CheckCircle,
            color: "bg-green-500",
          },
          {
            label: "Seasonal Content",
            value: stats.seasonal,
            icon: Calendar,
            color: "bg-purple-500",
          },
          {
            label: "Critical Priority",
            value: stats.critical,
            icon: AlertCircle,
            color: "bg-red-500",
          },
          {
            label: "Total Completions",
            value: stats.totalCompletions,
            icon: Target,
            color: "bg-blue-500",
          },
          {
            label: "Avg Rating",
            value: stats.averageRating.toFixed(1),
            icon: Star,
            color: "bg-orange-500",
          },
        ].map((stat, index) => {
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
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

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            {
              id: "overview",
              label: "Service Training Library",
              icon: BookOpen,
            },
            { id: "hajj", label: "Hajj & Umrah Services", icon: Compass },
            { id: "daily", label: "Daily Operations", icon: Sun },
            { id: "ramadan", label: "Ramadan Services", icon: Moon },
            { id: "security", label: "Sacred Site Security", icon: Shield },
            { id: "analytics", label: "Service Analytics", icon: TrendingUp },
            { id: "settings", label: "Islamic Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? "text-emerald-600 border-emerald-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Service Training Library Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Islamic service training content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Categories</option>
                  <option value="hajj">Hajj Services</option>
                  <option value="umrah">Umrah Services</option>
                  <option value="daily_prayers">Daily Prayers</option>
                  <option value="ramadan">Ramadan</option>
                  <option value="security">Security</option>
                  <option value="cultural">Cultural Guidance</option>
                  <option value="emergency">Emergency Response</option>
                </select>

                <select
                  value={filterSeasonal}
                  onChange={(e) => setFilterSeasonal(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Content</option>
                  <option value="seasonal">Seasonal (Hajj/Ramadan)</option>
                  <option value="year_round">Year Round</option>
                </select>

                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus size={20} />
                  <span>Create Content</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "pilgrim_service"
                            ? "bg-green-100 text-green-600"
                            : item.type === "security_protocol"
                            ? "bg-red-100 text-red-600"
                            : item.type === "crowd_management"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "cultural_guidance"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.type === "pilgrim_service" && (
                          <HandHeart size={16} />
                        )}
                        {item.type === "security_protocol" && (
                          <Shield size={16} />
                        )}
                        {item.type === "crowd_management" && (
                          <Users size={16} />
                        )}
                        {item.type === "cultural_guidance" && (
                          <Globe size={16} />
                        )}
                        {item.type === "emergency_response" && (
                          <AlertCircle size={16} />
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                      {item.seasonalContent && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          SEASONAL
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-sm text-gray-600">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.duration}min
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.completions}
                      </span>
                    </div>
                  </div>

                  {item.certificationRequired && (
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        <Award size={12} className="mr-1" />
                        Islamic Certification Required
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{item.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Updated {item.lastUpdated}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-800 p-1 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hajj & Umrah Services Tab */}
      {activeTab === "hajj" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Hajj & Umrah Pilgrim Services
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) =>
                    c.category === "hajj" ||
                    c.category === "umrah" ||
                    c.seasonalContent
                )
                .map((hajjContent) => (
                  <div
                    key={hajjContent.id}
                    className="border border-green-200 rounded-lg p-6 bg-green-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {hajjContent.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {hajjContent.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            hajjContent.priority
                          )}`}
                        >
                          {hajjContent.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {hajjContent.location}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Languages size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {hajjContent.language === "both"
                            ? "Arabic & English"
                            : hajjContent.language}
                        </span>
                      </div>
                    </div>

                    {hajjContent.islamicGuidance && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Islamic Guidance
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {hajjContent.islamicGuidance
                            .slice(0, 2)
                            .map((guidance, gIndex) => (
                              <li
                                key={gIndex}
                                className="flex items-start space-x-2"
                              >
                                <Heart
                                  size={12}
                                  className="text-green-500 mt-1 flex-shrink-0"
                                />
                                <span>{guidance}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {hajjContent.culturalSensitivity && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Cultural Sensitivity
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {hajjContent.culturalSensitivity
                            .slice(0, 1)
                            .map((note, nIndex) => (
                              <li
                                key={nIndex}
                                className="flex items-start space-x-2"
                              >
                                <UserCheck
                                  size={12}
                                  className="text-blue-500 mt-1 flex-shrink-0"
                                />
                                <span>{note}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-green-200">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{hajjContent.completions} completions</span>
                        <span>•</span>
                        <span>Rating: {hajjContent.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-green-600 hover:text-green-800 p-1 rounded transition-colors">
                          <Play size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Hajj Season Service Areas */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Hajj Service Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Tawaf Guidance",
                    pilgrims: "2.5M+",
                    priority: "Critical",
                  },
                  {
                    name: "Sa'i Assistance",
                    pilgrims: "2.3M+",
                    priority: "Critical",
                  },
                  {
                    name: "Arafat Services",
                    pilgrims: "2.8M+",
                    priority: "Critical",
                  },
                  { name: "Mina Support", pilgrims: "2.7M+", priority: "High" },
                  {
                    name: "Muzdalifah Aid",
                    pilgrims: "2.6M+",
                    priority: "High",
                  },
                  {
                    name: "Jamarat Safety",
                    pilgrims: "2.4M+",
                    priority: "Critical",
                  },
                ].map((area, index) => (
                  <div
                    key={index}
                    className="bg-white border border-green-300 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900">{area.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {area.pilgrims} annual pilgrims
                    </p>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        area.priority === "Critical"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {area.priority} Priority
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Operations Tab */}
      {activeTab === "daily" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Daily Prayer and Operations Management
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) =>
                    c.category === "daily_prayers" ||
                    (!c.seasonalContent && c.category !== "security")
                )
                .map((dailyContent) => (
                  <div
                    key={dailyContent.id}
                    className="border border-blue-200 rounded-lg p-6 bg-blue-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {dailyContent.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {dailyContent.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            dailyContent.priority
                          )}`}
                        >
                          {dailyContent.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {dailyContent.duration} minutes duration
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {dailyContent.completions} staff trained
                        </span>
                      </div>
                    </div>

                    {dailyContent.islamicGuidance && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Islamic Guidance
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {dailyContent.islamicGuidance
                            .slice(0, 2)
                            .map((guidance, gIndex) => (
                              <li
                                key={gIndex}
                                className="flex items-start space-x-2"
                              >
                                <Heart
                                  size={12}
                                  className="text-blue-500 mt-1 flex-shrink-0"
                                />
                                <span>{guidance}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>Rating: {dailyContent.rating}/5</span>
                        <span>•</span>
                        <span>Updated {dailyContent.lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                          <Play size={16} />
                        </button>
                        <button className="text-emerald-600 hover:text-emerald-800 p-1 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Daily Prayer Schedule */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Daily Prayer Management Areas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { name: "Fajr", time: "05:30", capacity: "50K", staff: 45 },
                  {
                    name: "Dhuhr",
                    time: "12:15",
                    capacity: "120K",
                    staff: 120,
                  },
                  { name: "Asr", time: "15:45", capacity: "80K", staff: 75 },
                  {
                    name: "Maghrib",
                    time: "18:20",
                    capacity: "150K",
                    staff: 140,
                  },
                  { name: "Isha", time: "19:50", capacity: "100K", staff: 90 },
                ].map((prayer, index) => (
                  <div
                    key={index}
                    className="bg-white border border-blue-300 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {prayer.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{prayer.time}</p>
                    <p className="text-xs text-gray-500">
                      Capacity: {prayer.capacity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Staff: {prayer.staff}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ramadan Services Tab */}
      {activeTab === "ramadan" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Ramadan Special Services
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) =>
                    c.category === "ramadan" ||
                    (c.seasonalContent && c.tags.includes("Ramadan"))
                )
                .map((ramadanContent) => (
                  <div
                    key={ramadanContent.id}
                    className="border border-purple-200 rounded-lg p-6 bg-purple-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {ramadanContent.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {ramadanContent.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Moon size={16} className="text-purple-600" />
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            ramadanContent.priority
                          )}`}
                        >
                          {ramadanContent.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {ramadanContent.islamicGuidance && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Ramadan Guidance
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {ramadanContent.islamicGuidance.map(
                            (guidance, gIndex) => (
                              <li
                                key={gIndex}
                                className="flex items-start space-x-2"
                              >
                                <Moon
                                  size={12}
                                  className="text-purple-500 mt-1 flex-shrink-0"
                                />
                                <span>{guidance}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {ramadanContent.culturalSensitivity && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Cultural Considerations
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {ramadanContent.culturalSensitivity.map(
                            (note, nIndex) => (
                              <li
                                key={nIndex}
                                className="flex items-start space-x-2"
                              >
                                <Globe
                                  size={12}
                                  className="text-purple-500 mt-1 flex-shrink-0"
                                />
                                <span>{note}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{ramadanContent.completions} completions</span>
                        <span>•</span>
                        <span>Rating: {ramadanContent.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-purple-600 hover:text-purple-800 p-1 rounded transition-colors">
                          <Play size={16} />
                        </button>
                        <button className="text-emerald-600 hover:text-emerald-800 p-1 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Ramadan Schedule */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ramadan Service Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Suhoor Services",
                    time: "03:00 - 05:00",
                    staff: "Special Team",
                  },
                  {
                    name: "Tarawih Prayers",
                    time: "21:00 - 23:00",
                    capacity: "200K+",
                  },
                  {
                    name: "Iftar Distribution",
                    time: "18:00 - 19:00",
                    meals: "50K+",
                  },
                  {
                    name: "Laylat al-Qadr",
                    time: "Last 10 Nights",
                    priority: "Critical",
                  },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="bg-white border border-purple-300 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{service.time}</p>
                    {service.capacity && (
                      <p className="text-xs text-gray-500">
                        Capacity: {service.capacity}
                      </p>
                    )}
                    {service.meals && (
                      <p className="text-xs text-gray-500">
                        Daily meals: {service.meals}
                      </p>
                    )}
                    {service.staff && (
                      <p className="text-xs text-gray-500">{service.staff}</p>
                    )}
                    {service.priority && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {service.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sacred Site Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Sacred Site Security Protocols
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) => c.category === "security" || c.category === "emergency"
                )
                .map((securityContent) => (
                  <div
                    key={securityContent.id}
                    className="border border-red-200 rounded-lg p-6 bg-red-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {securityContent.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {securityContent.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield size={16} className="text-red-600" />
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            securityContent.priority
                          )}`}
                        >
                          {securityContent.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {securityContent.certificationRequired && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          <Award size={14} className="mr-1" />
                          Security Certification Required
                        </span>
                      </div>
                    )}

                    {securityContent.islamicGuidance && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Islamic Security Principles
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {securityContent.islamicGuidance.map(
                            (guidance, gIndex) => (
                              <li
                                key={gIndex}
                                className="flex items-start space-x-2"
                              >
                                <Shield
                                  size={12}
                                  className="text-red-500 mt-1 flex-shrink-0"
                                />
                                <span>{guidance}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-red-200">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>
                          {securityContent.completions} personnel trained
                        </span>
                        <span>•</span>
                        <span>Rating: {securityContent.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-red-600 hover:text-red-800 p-1 rounded transition-colors">
                          <Play size={16} />
                        </button>
                        <button className="text-emerald-600 hover:text-emerald-800 p-1 rounded transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Security Areas */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Zones & Protocols
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    zone: "Holy Kaaba Vicinity",
                    level: "Maximum Security",
                    personnel: 200,
                  },
                  {
                    zone: "Main Prayer Halls",
                    level: "High Security",
                    personnel: 150,
                  },
                  {
                    zone: "Courtyard Areas",
                    level: "Standard Security",
                    personnel: 100,
                  },
                  {
                    zone: "Entry Checkpoints",
                    level: "High Security",
                    personnel: 120,
                  },
                  {
                    zone: "Emergency Exits",
                    level: "Critical Access",
                    personnel: 80,
                  },
                  {
                    zone: "VIP Areas",
                    level: "Special Protocol",
                    personnel: 60,
                  },
                ].map((zone, index) => (
                  <div
                    key={index}
                    className="bg-white border border-red-300 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900">{zone.zone}</h4>
                    <p className="text-sm text-gray-600 mt-1">{zone.level}</p>
                    <p className="text-xs text-gray-500">
                      Personnel: {zone.personnel}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          zone.level.includes("Maximum") ||
                          zone.level.includes("Critical")
                            ? "bg-red-100 text-red-800"
                            : zone.level.includes("High")
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {zone.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Service Training Analytics
            </h2>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: "Training Completion Rate",
                  value: "94.2%",
                  change: "+5.3%",
                  color: "text-green-600",
                },
                {
                  title: "Average Service Rating",
                  value: "4.7/5",
                  change: "+0.2",
                  color: "text-green-600",
                },
                {
                  title: "Staff Certification Rate",
                  value: "87.5%",
                  change: "+12.1%",
                  color: "text-green-600",
                },
                {
                  title: "Pilgrim Satisfaction",
                  value: "96.8%",
                  change: "+2.1%",
                  color: "text-green-600",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4"
                >
                  <h3 className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {metric.value}
                  </p>
                  <p className={`text-sm ${metric.color} mt-1`}>
                    {metric.change} from last month
                  </p>
                </div>
              ))}
            </div>

            {/* Content Performance */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Performing Content
              </h3>
              <div className="space-y-4">
                {content
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((topContent, index) => (
                    <div
                      key={topContent.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {topContent.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {topContent.category} • {topContent.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star
                            size={14}
                            className="text-yellow-400 fill-current"
                          />
                          <span>{topContent.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target size={14} />
                          <span>{topContent.completions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Training Progress by Department */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Training Progress by Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    dept: "Hajj Services",
                    completed: 95,
                    total: 100,
                    color: "bg-green-500",
                  },
                  {
                    dept: "Daily Operations",
                    completed: 87,
                    total: 95,
                    color: "bg-blue-500",
                  },
                  {
                    dept: "Security",
                    completed: 78,
                    total: 85,
                    color: "bg-red-500",
                  },
                  {
                    dept: "Cultural Guidance",
                    completed: 92,
                    total: 98,
                    color: "bg-purple-500",
                  },
                ].map((dept, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900">{dept.dept}</h4>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>
                          {dept.completed}/{dept.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${dept.color} h-2 rounded-full transition-all duration-300`}
                          style={{
                            width: `${(dept.completed / dept.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round((dept.completed / dept.total) * 100)}%
                        Complete
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Islamic Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Islamic Content Settings
            </h2>

            <div className="space-y-8">
              {/* Language & Cultural Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Language & Cultural Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Content Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="both">Arabic & English (Bilingual)</option>
                      <option value="arabic">Arabic</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Islamic School of Thought (Madhab)
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option value="inclusive">Inclusive (All Madhabs)</option>
                      <option value="hanafi">Hanafi</option>
                      <option value="maliki">Maliki</option>
                      <option value="shafi">Shafi&apos;i</option>
                      <option value="hanbali">Hanbali</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Content Guidelines */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Islamic Content Guidelines
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      label: "Include Quranic references in training materials",
                      checked: true,
                    },
                    {
                      label: "Add Hadith references for service protocols",
                      checked: true,
                    },
                    {
                      label: "Emphasize cultural sensitivity in all content",
                      checked: true,
                    },
                    {
                      label: "Include prayer time considerations",
                      checked: true,
                    },
                    {
                      label: "Require Islamic certification for critical roles",
                      checked: false,
                    },
                    {
                      label: "Include seasonal Islamic calendar events",
                      checked: true,
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {setting.label}
                      </span>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={setting.checked}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Content Management */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Seasonal Content Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Hajj Season
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Automatic content activation during Hajj period
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Auto-activate Hajj content</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Send pre-season training reminders</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Ramadan Services
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Special services and schedules for Ramadan
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Activate Ramadan schedules</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Include iftar service protocols</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Settings */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                    Save Islamic Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MosqueContentManagement;
