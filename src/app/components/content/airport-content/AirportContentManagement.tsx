import React, { useState, useEffect } from "react";
import {
  Building2,
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
  Plane,
  Shield,
  Globe,
  UserCheck,
  Compass,
  Radio,
  Languages,
  MapPin,
  Calendar,
} from "lucide-react";
import { AdminContext, EmployeeData } from "@/app/types/admin";
// Types for Airport content management
interface AirportContent {
  id: string;
  title: string;
  type:
    | "passenger_service"
    | "hajj_umrah"
    | "security_protocol"
    | "cultural_assistance"
    | "emergency_procedure";
  category:
    | "check_in"
    | "security"
    | "immigration"
    | "hajj_services"
    | "vip_handling"
    | "international";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  language: "english" | "arabic" | "both";
  status: "draft" | "review" | "approved" | "archived";
  terminal: string;
  description: string;
  duration: number; // in minutes
  completions: number;
  rating: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "critical";
  seasonalContent: boolean; // For Hajj/Umrah specific content
  certificationRequired: boolean;
  mediaFiles: MediaFile[];
  learningObjectives: string[];
  culturalNotes?: string[];
}

interface MediaFile {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  caption?: string;
  duration?: number;
}

interface AirportContentSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

const AirportContentManagement: React.FC<AirportContentSectionProps> = ({
  adminContext,
  employees,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [content, setContent] = useState<AirportContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeasonal, setFilterSeasonal] = useState("all");

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: AirportContent[] = [
      {
        id: "1",
        title: "Hajj Pilgrim Check-in Assistance",
        type: "hajj_umrah",
        category: "hajj_services",
        level: "B1",
        language: "both",
        status: "approved",
        terminal: "Hajj Terminal",
        description:
          "Comprehensive guide for assisting Hajj pilgrims during check-in process, including special requirements and cultural sensitivities.",
        duration: 30,
        completions: 289,
        rating: 4.9,
        lastUpdated: "2024-09-15",
        createdBy: "Abdullah Al-Hajj",
        tags: ["Hajj", "pilgrims", "check-in", "cultural", "religious"],
        priority: "critical",
        seasonalContent: true,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "1",
            type: "video",
            url: "/videos/hajj-checkin.mp4",
            caption: "Hajj check-in procedures",
          },
          {
            id: "2",
            type: "document",
            url: "/docs/hajj-requirements.pdf",
            caption: "Hajj travel requirements",
          },
        ],
        learningObjectives: [
          "Understand Hajj pilgrimage significance and requirements",
          "Provide culturally sensitive assistance to pilgrims",
          "Handle special documentation and group bookings",
        ],
        culturalNotes: [
          "Show respect for pilgrims' spiritual journey",
          "Understand that many pilgrims may be first-time international travelers",
          "Be patient with language barriers and provide extra assistance",
        ],
      },
      {
        id: "2",
        title: "International VIP Passenger Services",
        type: "passenger_service",
        category: "vip_handling",
        level: "B2",
        language: "both",
        status: "approved",
        terminal: "Terminal 1 - VIP Lounge",
        description:
          "Protocol and service standards for handling international VIP passengers, including diplomatic and royal family members.",
        duration: 40,
        completions: 134,
        rating: 4.8,
        lastUpdated: "2024-09-12",
        createdBy: "Fatima Al-Protocol",
        tags: ["VIP", "diplomatic", "protocol", "international", "luxury"],
        priority: "critical",
        seasonalContent: false,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "3",
            type: "video",
            url: "/videos/vip-services.mp4",
            caption: "VIP service protocols",
          },
        ],
        learningObjectives: [
          "Master VIP greeting and escort protocols",
          "Understand diplomatic immunity and procedures",
          "Provide discrete and professional service",
        ],
        culturalNotes: [
          "Maintain strict confidentiality at all times",
          "Understand different cultural greeting customs",
          "Respect privacy and avoid unnecessary interaction",
        ],
      },
      {
        id: "3",
        title: "Emergency Evacuation - Terminal Operations",
        type: "emergency_procedure",
        category: "security",
        level: "B1",
        language: "both",
        status: "review",
        terminal: "All Terminals",
        description:
          "Emergency evacuation procedures for terminal staff with focus on clear communication with international passengers.",
        duration: 35,
        completions: 198,
        rating: 4.9,
        lastUpdated: "2024-09-10",
        createdBy: "Omar Al-Security",
        tags: [
          "emergency",
          "evacuation",
          "safety",
          "international",
          "communication",
        ],
        priority: "critical",
        seasonalContent: false,
        certificationRequired: true,
        mediaFiles: [
          {
            id: "4",
            type: "video",
            url: "/videos/terminal-evacuation.mp4",
            caption: "Terminal evacuation drill",
          },
        ],
        learningObjectives: [
          "Execute emergency evacuation procedures",
          "Communicate clearly in crisis situations",
          "Assist passengers with disabilities and special needs",
        ],
        culturalNotes: [
          "Use simple, clear language for non-native speakers",
          "Be aware of cultural differences in emergency response",
          "Provide extra assistance to elderly pilgrims",
        ],
      },
      {
        id: "4",
        title: "Immigration & Customs Support",
        type: "passenger_service",
        category: "immigration",
        level: "B2",
        language: "both",
        status: "approved",
        terminal: "All International Terminals",
        description:
          "Assisting international passengers with immigration and customs procedures, including Umrah visitor requirements.",
        duration: 25,
        completions: 245,
        rating: 4.6,
        lastUpdated: "2024-09-08",
        createdBy: "Sarah Al-Immigration",
        tags: [
          "immigration",
          "customs",
          "Umrah",
          "international",
          "procedures",
        ],
        priority: "high",
        seasonalContent: true,
        certificationRequired: false,
        mediaFiles: [
          {
            id: "5",
            type: "document",
            url: "/docs/immigration-guide.pdf",
            caption: "Immigration procedures guide",
          },
        ],
        learningObjectives: [
          "Understand visa and entry requirements",
          "Guide passengers through immigration process",
          "Handle special cases and complications",
        ],
        culturalNotes: [
          "Many Umrah visitors are unfamiliar with procedures",
          "Show patience with documentation questions",
          "Respect religious dress codes and customs",
        ],
      },
      {
        id: "5",
        title: "Multi-Cultural Passenger Assistance",
        type: "cultural_assistance",
        category: "international",
        level: "B1",
        language: "both",
        status: "draft",
        terminal: "All Terminals",
        description:
          "Best practices for assisting passengers from diverse cultural backgrounds, with emphasis on Southeast Asian and African pilgrims.",
        duration: 30,
        completions: 167,
        rating: 4.5,
        lastUpdated: "2024-09-18",
        createdBy: "Ahmed Al-Culture",
        tags: [
          "cultural",
          "diversity",
          "pilgrims",
          "communication",
          "assistance",
        ],
        priority: "high",
        seasonalContent: false,
        certificationRequired: false,
        mediaFiles: [
          {
            id: "6",
            type: "video",
            url: "/videos/cultural-assistance.mp4",
            caption: "Cultural sensitivity training",
          },
        ],
        learningObjectives: [
          "Recognize cultural differences in communication styles",
          "Adapt service approach to different cultural expectations",
          "Handle misunderstandings with cultural sensitivity",
        ],
        culturalNotes: [
          "Different cultures have varying concepts of personal space",
          "Some cultures prefer indirect communication styles",
          "Be aware of dietary restrictions and prayer time needs",
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
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Building2 className="mr-3" size={32} />
              Airport Operations Content Management
            </h1>
            <p className="mt-2 text-indigo-100">
              Manage passenger service and operational training for{" "}
              {adminContext.scope.organizationName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.total}</p>
            <p className="text-indigo-100">Training Modules</p>
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
              label: "Training Content Library",
              icon: BookOpen,
            },
            { id: "hajj", label: "Hajj & Umrah Services", icon: Compass },
            { id: "terminals", label: "Terminal Operations", icon: Building2 },
            { id: "vip", label: "VIP & Protocol Services", icon: Award },
            { id: "analytics", label: "Service Analytics", icon: TrendingUp },
            { id: "settings", label: "Airport Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Training Content Library Tab */}
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
                    placeholder="Search airport training content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="check_in">Check-in Services</option>
                  <option value="security">Security</option>
                  <option value="immigration">Immigration</option>
                  <option value="hajj_services">Hajj Services</option>
                  <option value="vip_handling">VIP Handling</option>
                  <option value="international">International</option>
                </select>

                <select
                  value={filterSeasonal}
                  onChange={(e) => setFilterSeasonal(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Content</option>
                  <option value="seasonal">Seasonal (Hajj/Umrah)</option>
                  <option value="year_round">Year Round</option>
                </select>

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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
                          item.type === "passenger_service"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "hajj_umrah"
                            ? "bg-green-100 text-green-600"
                            : item.type === "security_protocol"
                            ? "bg-red-100 text-red-600"
                            : item.type === "cultural_assistance"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.type === "passenger_service" && (
                          <Users size={16} />
                        )}
                        {item.type === "hajj_umrah" && <Compass size={16} />}
                        {item.type === "security_protocol" && (
                          <Shield size={16} />
                        )}
                        {item.type === "cultural_assistance" && (
                          <Globe size={16} />
                        )}
                        {item.type === "emergency_procedure" && (
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
                        {item.terminal}
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
                        Certification Required
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
              Hajj & Umrah Seasonal Training
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) => c.seasonalContent || c.category === "hajj_services"
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
                        {hajjContent.seasonalContent && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            SEASONAL
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {hajjContent.terminal}
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

                    {hajjContent.culturalNotes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Cultural Sensitivity Notes
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {hajjContent.culturalNotes
                            .slice(0, 2)
                            .map((note, nIndex) => (
                              <li
                                key={nIndex}
                                className="flex items-start space-x-2"
                              >
                                <UserCheck
                                  size={12}
                                  className="text-green-500 mt-1 flex-shrink-0"
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

            {/* Hajj Season Readiness Checklist */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hajj Season Readiness Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    item: "Staff Hajj Service Training",
                    completed: true,
                    priority: "critical",
                  },
                  {
                    item: "Multi-language Announcement System",
                    completed: true,
                    priority: "high",
                  },
                  {
                    item: "Prayer Area Coordination",
                    completed: false,
                    priority: "high",
                  },
                  {
                    item: "Group Check-in Procedures",
                    completed: true,
                    priority: "critical",
                  },
                  {
                    item: "Medical Emergency Protocols",
                    completed: false,
                    priority: "critical",
                  },
                  {
                    item: "Cultural Sensitivity Refresher",
                    completed: true,
                    priority: "medium",
                  },
                ].map((checkItem, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        checkItem.completed ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {checkItem.completed ? (
                        <CheckCircle size={14} className="text-green-600" />
                      ) : (
                        <Clock size={14} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          checkItem.completed
                            ? "text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {checkItem.item}
                      </p>
                      <p
                        className={`text-xs ${
                          checkItem.priority === "critical"
                            ? "text-red-600"
                            : checkItem.priority === "high"
                            ? "text-orange-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {checkItem.priority.toUpperCase()} PRIORITY
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Operations Tab */}
      {activeTab === "terminals" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Terminal-Specific Operations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Terminal 1 - International",
                  type: "International Flights",
                  contentCount: 18,
                  icon: <Plane className="text-blue-600" size={24} />,
                  services: [
                    "VIP Services",
                    "Immigration",
                    "Customs",
                    "International Transit",
                  ],
                  specialization:
                    "Long-haul international flights with premium services",
                },
                {
                  name: "Hajj Terminal",
                  type: "Seasonal Operations",
                  contentCount: 25,
                  icon: <Compass className="text-green-600" size={24} />,
                  services: [
                    "Hajj Check-in",
                    "Group Processing",
                    "Prayer Areas",
                    "Medical Support",
                  ],
                  specialization: "Dedicated Hajj and Umrah pilgrim services",
                },
                {
                  name: "Terminal 2 - Domestic",
                  type: "Domestic Flights",
                  contentCount: 12,
                  icon: <Building2 className="text-purple-600" size={24} />,
                  services: [
                    "Domestic Check-in",
                    "Local Connections",
                    "Business Services",
                  ],
                  specialization: "Domestic and regional flight operations",
                },
                {
                  name: "Cargo Terminal",
                  type: "Freight Operations",
                  contentCount: 8,
                  icon: <Radio className="text-orange-600" size={24} />,
                  services: [
                    "Cargo Handling",
                    "Customs Clearance",
                    "Documentation",
                  ],
                  specialization:
                    "International freight and logistics operations",
                },
              ].map((terminal, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {terminal.icon}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {terminal.name}
                        </h3>
                        <p className="text-sm text-gray-600">{terminal.type}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {terminal.specialization}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Key Services
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {terminal.services.map((service, sIndex) => (
                        <span
                          key={sIndex}
                          className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      {terminal.contentCount} training modules
                    </span>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="text-emerald-600 hover:text-emerald-800 p-1 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportContentManagement;
