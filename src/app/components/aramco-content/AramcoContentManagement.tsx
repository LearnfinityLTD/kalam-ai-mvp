import React, { useState, useEffect } from "react";
import {
  Wrench,
  Shield,
  AlertTriangle,
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
  Zap,
  Flame,
  HardHat,
  Radio,
  Gauge,
  Factory,
} from "lucide-react";
import { AdminContext, EmployeeData } from "@/app/types/admin";

interface AramcoContentSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

// Types for Aramco industrial safety content
interface SafetyContent {
  id: string;
  title: string;
  type:
    | "safety_protocol"
    | "emergency_procedure"
    | "equipment_training"
    | "hazmat_handling"
    | "cultural_safety";
  category:
    | "drilling"
    | "refining"
    | "pipeline"
    | "offshore"
    | "emergency"
    | "environmental"
    | "international";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  language: "english" | "arabic" | "both";
  status: "draft" | "review" | "approved" | "archived";
  facility: string;
  description: string;
  duration: number; // in minutes
  completions: number;
  rating: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  safetyLevel: "low" | "medium" | "high" | "critical";
  certificationRequired: boolean;
  mediaFiles: MediaFile[];
  learningObjectives: string[];
  safetyNotes: string[];
}

interface MediaFile {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  caption?: string;
  duration?: number;
}

const AramcoContentManagement: React.FC<AramcoContentSectionProps> = ({
  adminContext,
  employees,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [content, setContent] = useState<SafetyContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSafetyLevel, setFilterSafetyLevel] = useState("all");
  const [selectedContent, setSelectedContent] = useState<SafetyContent | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: SafetyContent[] = [
      {
        id: "1",
        title: "Offshore Platform Safety Protocols",
        type: "safety_protocol",
        category: "offshore",
        level: "B2",
        language: "both",
        status: "approved",
        facility: "Offshore Platform Alpha",
        description:
          "Comprehensive safety protocols for offshore drilling operations including emergency evacuation procedures.",
        duration: 45,
        completions: 156,
        rating: 4.9,
        lastUpdated: "2024-09-15",
        createdBy: "Ahmed Al-Safety",
        tags: ["offshore", "drilling", "safety", "emergency"],
        safetyLevel: "critical",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "1",
            type: "video",
            url: "/videos/offshore-safety.mp4",
            caption: "Offshore safety demonstration",
          },
          {
            id: "2",
            type: "document",
            url: "/docs/offshore-protocols.pdf",
            caption: "Safety protocol manual",
          },
        ],
        learningObjectives: [
          "Master emergency evacuation procedures",
          "Understand offshore safety regulations",
          "Practice international safety communication",
        ],
        safetyNotes: [
          "All personnel must complete this module before offshore assignment",
          "Refresher training required annually",
          "Emergency contact numbers must be memorized",
        ],
      },
      {
        id: "2",
        title: "Hazmat Communication for International Teams",
        type: "hazmat_handling",
        category: "environmental",
        level: "B1",
        language: "both",
        status: "approved",
        facility: "Ras Tanura Refinery",
        description:
          "Essential communication protocols for handling hazardous materials with international contractor teams.",
        duration: 35,
        completions: 203,
        rating: 4.7,
        lastUpdated: "2024-09-12",
        createdBy: "Fatima Al-Environ",
        tags: ["hazmat", "international", "communication", "safety"],
        safetyLevel: "high",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "3",
            type: "video",
            url: "/videos/hazmat-comm.mp4",
            caption: "Hazmat communication scenarios",
          },
        ],
        learningObjectives: [
          "Communicate hazmat procedures clearly",
          "Understand international safety standards",
          "Practice emergency notification protocols",
        ],
        safetyNotes: [
          "Mandatory for all refinery personnel",
          "Available in Arabic and English",
          "Updated quarterly with new regulations",
        ],
      },
      {
        id: "3",
        title: "Pipeline Inspection Emergency Response",
        type: "emergency_procedure",
        category: "pipeline",
        level: "B2",
        language: "english",
        status: "review",
        facility: "Eastern Province Pipeline Network",
        description:
          "Emergency response procedures for pipeline inspection teams working with international contractors.",
        duration: 30,
        completions: 89,
        rating: 4.8,
        lastUpdated: "2024-09-10",
        createdBy: "Omar Al-Pipeline",
        tags: ["pipeline", "inspection", "emergency", "contractors"],
        safetyLevel: "high",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "4",
            type: "video",
            url: "/videos/pipeline-emergency.mp4",
            caption: "Pipeline emergency response",
          },
        ],
        learningObjectives: [
          "Execute emergency shutdown procedures",
          "Communicate effectively with international teams",
          "Follow environmental protection protocols",
        ],
        safetyNotes: [
          "Critical for pipeline inspection teams",
          "Regular drills required monthly",
          "GPS coordinates must be communicated accurately",
        ],
      },
      {
        id: "4",
        title: "International Drilling Crew Communication",
        type: "cultural_safety",
        category: "drilling",
        level: "A2",
        language: "both",
        status: "approved",
        facility: "Ghawar Field Operations",
        description:
          "Cultural sensitivity and communication protocols when working with international drilling crews.",
        duration: 25,
        completions: 267,
        rating: 4.5,
        lastUpdated: "2024-09-08",
        createdBy: "Khalid Al-Cultural",
        tags: ["cultural", "international", "drilling", "teams"],
        safetyLevel: "medium",
        certificationRequired: false,
        mediaFiles: [
          {
            id: "5",
            type: "video",
            url: "/videos/cultural-comm.mp4",
            caption: "Cultural communication examples",
          },
        ],
        learningObjectives: [
          "Understand cultural differences in safety communication",
          "Build effective international team relationships",
          "Practice inclusive safety briefings",
        ],
        safetyNotes: [
          "Promotes inclusive workplace safety",
          "Reduces communication-related incidents",
          "Supports Aramco's diversity initiatives",
        ],
      },
      {
        id: "5",
        title: "Refinery Equipment Training - Advanced",
        type: "equipment_training",
        category: "refining",
        level: "C1",
        language: "english",
        status: "draft",
        facility: "Yanbu Refinery",
        description:
          "Advanced equipment operation training for international maintenance teams at Yanbu facility.",
        duration: 60,
        completions: 45,
        rating: 4.6,
        lastUpdated: "2024-09-18",
        createdBy: "Sarah Al-Technical",
        tags: ["equipment", "refining", "advanced", "maintenance"],
        safetyLevel: "critical",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "6",
            type: "video",
            url: "/videos/refinery-equipment.mp4",
            caption: "Advanced equipment operation",
          },
          {
            id: "7",
            type: "document",
            url: "/docs/equipment-manual.pdf",
            caption: "Equipment operation manual",
          },
        ],
        learningObjectives: [
          "Operate complex refinery equipment safely",
          "Communicate technical issues effectively",
          "Follow advanced troubleshooting procedures",
        ],
        safetyNotes: [
          "Requires basic equipment certification first",
          "Annual recertification mandatory",
          "Emergency shutdown procedures critical",
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
    const matchesSafetyLevel =
      filterSafetyLevel === "all" || item.safetyLevel === filterSafetyLevel;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStatus &&
      matchesSafetyLevel
    );
  });

  const getContentStats = () => {
    return {
      total: content.length,
      approved: content.filter((c) => c.status === "approved").length,
      inReview: content.filter((c) => c.status === "review").length,
      draft: content.filter((c) => c.status === "draft").length,
      critical: content.filter((c) => c.safetyLevel === "critical").length,
      totalCompletions: content.reduce((sum, c) => sum + c.completions, 0),
      averageRating:
        content.reduce((sum, c) => sum + c.rating, 0) / content.length,
    };
  };

  const stats = getContentStats();

  const getSafetyLevelColor = (level: string) => {
    switch (level) {
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
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Wrench className="mr-3" size={32} />
              Industrial Safety Content Management
            </h1>
            <p className="mt-2 text-red-100">
              Manage safety protocols and training content for{" "}
              {adminContext.scope.organizationName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.total}</p>
            <p className="text-red-100">Safety Content Items</p>
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
            label: "In Review",
            value: stats.inReview,
            icon: Clock,
            color: "bg-yellow-500",
          },
          {
            label: "Critical Safety",
            value: stats.critical,
            icon: AlertTriangle,
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
            { id: "overview", label: "Safety Content Library", icon: BookOpen },
            {
              id: "facilities",
              label: "Facility-Specific Training",
              icon: Factory,
            },
            {
              id: "emergency",
              label: "Emergency Procedures",
              icon: AlertTriangle,
            },
            {
              id: "certifications",
              label: "Certification Tracking",
              icon: Award,
            },
            { id: "analytics", label: "Safety Analytics", icon: TrendingUp },
            { id: "settings", label: "Safety Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? "text-red-600 border-red-600"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Safety Content Library Tab */}
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
                    placeholder="Search safety content by title, description, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Categories</option>
                  <option value="drilling">Drilling</option>
                  <option value="refining">Refining</option>
                  <option value="pipeline">Pipeline</option>
                  <option value="offshore">Offshore</option>
                  <option value="emergency">Emergency</option>
                  <option value="environmental">Environmental</option>
                  <option value="international">International</option>
                </select>

                <select
                  value={filterSafetyLevel}
                  onChange={(e) => setFilterSafetyLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Safety Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="review">In Review</option>
                  <option value="draft">Draft</option>
                </select>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
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
                {/* Content Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg ${
                          item.type === "safety_protocol"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "emergency_procedure"
                            ? "bg-red-100 text-red-600"
                            : item.type === "equipment_training"
                            ? "bg-green-100 text-green-600"
                            : item.type === "hazmat_handling"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {item.type === "safety_protocol" && (
                          <Shield size={16} />
                        )}
                        {item.type === "emergency_procedure" && (
                          <AlertTriangle size={16} />
                        )}
                        {item.type === "equipment_training" && (
                          <Wrench size={16} />
                        )}
                        {item.type === "hazmat_handling" && (
                          <HardHat size={16} />
                        )}
                        {item.type === "cultural_safety" && <Users size={16} />}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getSafetyLevelColor(
                          item.safetyLevel
                        )}`}
                      >
                        {item.safetyLevel.toUpperCase()}
                      </span>
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
                      <Factory size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.facility}
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

          {filteredContent.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No safety content found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                filterCategory !== "all" ||
                filterSafetyLevel !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by creating your first safety training content."}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus size={20} />
                <span>Create Safety Content</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === "facilities" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Aramco Facility-Specific Training
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Ghawar Field Operations",
                  type: "Oil Field",
                  contentCount: 24,
                  icon: <Zap className="text-yellow-600" size={24} />,
                  safetyLevel: "high",
                  specializations: [
                    "Drilling Operations",
                    "Well Maintenance",
                    "International Crews",
                  ],
                },
                {
                  name: "Ras Tanura Refinery",
                  type: "Refinery Complex",
                  contentCount: 18,
                  icon: <Factory className="text-blue-600" size={24} />,
                  safetyLevel: "critical",
                  specializations: [
                    "Process Safety",
                    "Hazmat Handling",
                    "Emergency Response",
                  ],
                },
                {
                  name: "Offshore Platform Alpha",
                  type: "Offshore Platform",
                  contentCount: 16,
                  icon: <Gauge className="text-cyan-600" size={24} />,
                  safetyLevel: "critical",
                  specializations: [
                    "Marine Safety",
                    "Helicopter Operations",
                    "Weather Protocols",
                  ],
                },
                {
                  name: "Yanbu Industrial City",
                  type: "Industrial Complex",
                  contentCount: 22,
                  icon: <HardHat className="text-green-600" size={24} />,
                  safetyLevel: "high",
                  specializations: [
                    "Petrochemicals",
                    "Port Operations",
                    "International Logistics",
                  ],
                },
                {
                  name: "Eastern Province Pipeline",
                  type: "Pipeline Network",
                  contentCount: 14,
                  icon: <Radio className="text-purple-600" size={24} />,
                  safetyLevel: "medium",
                  specializations: [
                    "Pipeline Inspection",
                    "Remote Operations",
                    "Environmental Protection",
                  ],
                },
                {
                  name: "Jubail Industrial City",
                  type: "Industrial Complex",
                  contentCount: 20,
                  icon: <Flame className="text-red-600" size={24} />,
                  safetyLevel: "high",
                  specializations: [
                    "Chemical Processing",
                    "Safety Systems",
                    "Multi-cultural Teams",
                  ],
                },
              ].map((facility, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {facility.icon}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {facility.name}
                        </h3>
                        <p className="text-sm text-gray-600">{facility.type}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getSafetyLevelColor(
                        facility.safetyLevel
                      )}`}
                    >
                      {facility.safetyLevel.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Key Specializations
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {facility.specializations.map((spec, sIndex) => (
                        <li
                          key={sIndex}
                          className="flex items-center space-x-2"
                        >
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      {facility.contentCount} training modules
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

      {/* Emergency Procedures Tab */}
      {activeTab === "emergency" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Emergency Response Procedures
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) =>
                    c.type === "emergency_procedure" ||
                    c.safetyLevel === "critical"
                )
                .map((procedure) => (
                  <div
                    key={procedure.id}
                    className="border border-red-200 rounded-lg p-6 bg-red-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {procedure.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {procedure.description}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getSafetyLevelColor(
                          procedure.safetyLevel
                        )}`}
                      >
                        {procedure.safetyLevel.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Factory size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {procedure.facility}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {procedure.duration} minutes training
                        </span>
                      </div>
                    </div>

                    {procedure.safetyNotes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Critical Safety Notes
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {procedure.safetyNotes
                            .slice(0, 2)
                            .map((note, nIndex) => (
                              <li
                                key={nIndex}
                                className="flex items-start space-x-2"
                              >
                                <AlertTriangle
                                  size={12}
                                  className="text-red-500 mt-1 flex-shrink-0"
                                />
                                <span>{note}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-red-200">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{procedure.completions} completions</span>
                        <span>•</span>
                        <span>Updated {procedure.lastUpdated}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-red-600 hover:text-red-800 p-1 rounded transition-colors">
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
          </div>
        </div>
      )}

      {/* Other tabs would continue here... */}
    </div>
  );
};

export default AramcoContentManagement;
