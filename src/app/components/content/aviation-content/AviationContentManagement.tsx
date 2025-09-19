import React, { useState, useEffect } from "react";
import {
  Plane,
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
  Radio,
  Shield,
  Globe,
  UserCheck,
  Headphones,
  Languages,
} from "lucide-react";
import { AdminContext, EmployeeData } from "@/app/types/admin";
// Types for Aviation content management
interface AviationContent {
  id: string;
  title: string;
  type:
    | "safety_briefing"
    | "customer_service"
    | "emergency_procedure"
    | "cultural_protocol"
    | "vip_service";
  category:
    | "cabin_crew"
    | "ground_staff"
    | "customer_service"
    | "safety"
    | "vip_handling"
    | "international";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  language: "english" | "arabic" | "both";
  status: "draft" | "review" | "approved" | "archived";
  aircraft_type: string;
  description: string;
  duration: number; // in minutes
  completions: number;
  rating: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "critical";
  certificationRequired: boolean;
  mediaFiles: MediaFile[];
  learningObjectives: string[];
  safetyNotes?: string[];
}

interface MediaFile {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  caption?: string;
  duration?: number;
}

interface AviationContentSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

const AviationContentManagement: React.FC<AviationContentSectionProps> = ({
  adminContext,
  employees,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [content, setContent] = useState<AviationContent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: AviationContent[] = [
      {
        id: "1",
        title: "International VIP Passenger Service Protocol",
        type: "vip_service",
        category: "vip_handling",
        level: "B2",
        language: "both",
        status: "approved",
        aircraft_type: "Boeing 787",
        description:
          "Comprehensive service protocols for VIP and royal family passengers on international flights.",
        duration: 40,
        completions: 89,
        rating: 4.9,
        lastUpdated: "2024-09-15",
        createdBy: "Amira Al-Service",
        tags: ["VIP", "royal", "international", "protocol"],
        priority: "critical",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "1",
            type: "video",
            url: "/videos/vip-service.mp4",
            caption: "VIP service demonstration",
          },
        ],
        learningObjectives: [
          "Master VIP greeting and service protocols",
          "Understand cultural sensitivities for international dignitaries",
          "Practice discretion and privacy protection",
        ],
        safetyNotes: [
          "Maintain highest confidentiality standards",
          "Follow security protocols strictly",
          "Emergency procedures have priority over service",
        ],
      },
      {
        id: "2",
        title: "Hajj and Umrah Passenger Assistance",
        type: "cultural_protocol",
        category: "customer_service",
        level: "B1",
        language: "both",
        status: "approved",
        aircraft_type: "Airbus A330",
        description:
          "Specialized service training for assisting pilgrims during Hajj and Umrah seasons.",
        duration: 35,
        completions: 234,
        rating: 4.8,
        lastUpdated: "2024-09-12",
        createdBy: "Hassan Al-Pilgrim",
        tags: ["Hajj", "Umrah", "pilgrims", "cultural", "religious"],
        priority: "high",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "2",
            type: "video",
            url: "/videos/hajj-service.mp4",
            caption: "Pilgrim assistance scenarios",
          },
        ],
        learningObjectives: [
          "Understand religious significance of pilgrimage",
          "Provide culturally sensitive assistance",
          "Handle special requests with empathy",
        ],
      },
      {
        id: "3",
        title: "Emergency Evacuation Procedures - International Crews",
        type: "emergency_procedure",
        category: "safety",
        level: "B2",
        language: "english",
        status: "review",
        aircraft_type: "All Aircraft Types",
        description:
          "Emergency evacuation procedures with focus on communication with international cabin crew members.",
        duration: 45,
        completions: 156,
        rating: 4.9,
        lastUpdated: "2024-09-10",
        createdBy: "Captain Omar Safety",
        tags: ["emergency", "evacuation", "international", "safety"],
        priority: "critical",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "3",
            type: "video",
            url: "/videos/emergency-evac.mp4",
            caption: "Emergency evacuation drill",
          },
        ],
        learningObjectives: [
          "Execute emergency procedures flawlessly",
          "Communicate clearly in high-stress situations",
          "Coordinate with international crew members",
        ],
        safetyNotes: [
          "Lives depend on clear communication",
          "Practice drills regularly",
          "Know equipment locations by heart",
        ],
      },
      {
        id: "4",
        title: "Cross-Cultural Customer Service Excellence",
        type: "customer_service",
        category: "international",
        level: "B1",
        language: "both",
        status: "approved",
        aircraft_type: "Wide Body Aircraft",
        description:
          "Advanced customer service techniques for serving passengers from diverse cultural backgrounds.",
        duration: 30,
        completions: 198,
        rating: 4.6,
        lastUpdated: "2024-09-08",
        createdBy: "Fatima Al-Culture",
        tags: ["cultural", "customer service", "diversity", "international"],
        priority: "high",
        certificationRequired: false,
        mediaFiles: [
          {
            id: "4",
            type: "video",
            url: "/videos/cultural-service.mp4",
            caption: "Cultural service examples",
          },
        ],
        learningObjectives: [
          "Recognize cultural differences in service expectations",
          "Adapt communication style appropriately",
          "Handle cultural misunderstandings professionally",
        ],
      },
      {
        id: "5",
        title: "In-Flight Safety Announcements - Multi-Lingual",
        type: "safety_briefing",
        category: "cabin_crew",
        level: "A2",
        language: "both",
        status: "draft",
        aircraft_type: "Boeing 777",
        description:
          "Standard and emergency safety announcements in Arabic and English for international flights.",
        duration: 25,
        completions: 78,
        rating: 4.4,
        lastUpdated: "2024-09-18",
        createdBy: "Sarah Al-Announce",
        tags: ["safety", "announcements", "bilingual", "cabin crew"],
        priority: "medium",
        certificationRequired: true,
        mediaFiles: [
          {
            id: "5",
            type: "audio",
            url: "/audio/safety-announcements.mp3",
            caption: "Safety announcement practice",
          },
        ],
        learningObjectives: [
          "Deliver clear safety instructions",
          "Maintain calm and authoritative tone",
          "Switch between languages smoothly",
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
    const matchesPriority =
      filterPriority === "all" || item.priority === filterPriority;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesStatus &&
      matchesPriority
    );
  });

  const getContentStats = () => {
    return {
      total: content.length,
      approved: content.filter((c) => c.status === "approved").length,
      inReview: content.filter((c) => c.status === "review").length,
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
      <div className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Plane className="mr-3" size={32} />
              Aviation Service Content Management
            </h1>
            <p className="mt-2 text-blue-100">
              Manage flight service training and safety content for{" "}
              {adminContext.scope.organizationName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.total}</p>
            <p className="text-blue-100">Training Content Items</p>
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
            {
              id: "aircraft",
              label: "Aircraft-Specific Training",
              icon: Plane,
            },
            { id: "safety", label: "Safety & Emergency", icon: Shield },
            { id: "vip", label: "VIP & Cultural Services", icon: Award },
            { id: "analytics", label: "Training Analytics", icon: TrendingUp },
            { id: "settings", label: "Aviation Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? "text-blue-600 border-blue-600"
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
                    placeholder="Search aviation training content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="cabin_crew">Cabin Crew</option>
                  <option value="ground_staff">Ground Staff</option>
                  <option value="customer_service">Customer Service</option>
                  <option value="safety">Safety</option>
                  <option value="vip_handling">VIP Handling</option>
                  <option value="international">International</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical Priority</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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
                          item.type === "safety_briefing"
                            ? "bg-red-100 text-red-600"
                            : item.type === "customer_service"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "emergency_procedure"
                            ? "bg-orange-100 text-orange-600"
                            : item.type === "cultural_protocol"
                            ? "bg-green-100 text-green-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {item.type === "safety_briefing" && (
                          <Shield size={16} />
                        )}
                        {item.type === "customer_service" && (
                          <Users size={16} />
                        )}
                        {item.type === "emergency_procedure" && (
                          <AlertCircle size={16} />
                        )}
                        {item.type === "cultural_protocol" && (
                          <Globe size={16} />
                        )}
                        {item.type === "vip_service" && <Award size={16} />}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority.toUpperCase()}
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
                      <Plane size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.aircraft_type}
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

      {/* Aircraft-Specific Training Tab */}
      {activeTab === "aircraft" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Aircraft-Specific Training Programs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Boeing 787 Dreamliner",
                  type: "Wide Body",
                  contentCount: 22,
                  icon: <Plane className="text-blue-600" size={24} />,
                  routes: ["International Long Haul", "Hajj Special Flights"],
                  specializations: [
                    "Premium Service",
                    "Cultural Protocols",
                    "Extended Flight Service",
                  ],
                },
                {
                  name: "Airbus A330",
                  type: "Wide Body",
                  contentCount: 18,
                  icon: <Plane className="text-green-600" size={24} />,
                  routes: ["Regional International", "Umrah Flights"],
                  specializations: [
                    "Pilgrim Services",
                    "Multi-cultural Passengers",
                    "Regional Protocols",
                  ],
                },
                {
                  name: "Boeing 777",
                  type: "Wide Body",
                  contentCount: 20,
                  icon: <Plane className="text-purple-600" size={24} />,
                  routes: ["International Flagship", "VIP Charter"],
                  specializations: [
                    "VIP Service",
                    "Royal Protocols",
                    "Diplomatic Flights",
                  ],
                },
                {
                  name: "Airbus A320",
                  type: "Narrow Body",
                  contentCount: 16,
                  icon: <Plane className="text-orange-600" size={24} />,
                  routes: ["Domestic", "Regional"],
                  specializations: [
                    "Domestic Service",
                    "Business Travel",
                    "Quick Turnaround",
                  ],
                },
              ].map((aircraft, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {aircraft.icon}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {aircraft.name}
                        </h3>
                        <p className="text-sm text-gray-600">{aircraft.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Primary Routes
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {aircraft.routes.map((route, rIndex) => (
                        <span
                          key={rIndex}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                        >
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Service Specializations
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {aircraft.specializations.map((spec, sIndex) => (
                        <li
                          key={sIndex}
                          className="flex items-center space-x-2"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      {aircraft.contentCount} training modules
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

      {/* VIP & Cultural Services Tab */}
      {activeTab === "vip" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              VIP & Cultural Service Training
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content
                .filter(
                  (c) =>
                    c.type === "vip_service" || c.type === "cultural_protocol"
                )
                .map((service) => (
                  <div
                    key={service.id}
                    className="border border-blue-200 rounded-lg p-6 bg-blue-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {service.description}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          service.priority
                        )}`}
                      >
                        {service.priority.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Languages size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {service.language === "both"
                            ? "Arabic & English"
                            : service.language}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {service.duration} minutes training
                        </span>
                      </div>
                    </div>

                    {service.learningObjectives && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Key Learning Objectives
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {service.learningObjectives
                            .slice(0, 2)
                            .map((objective, oIndex) => (
                              <li
                                key={oIndex}
                                className="flex items-start space-x-2"
                              >
                                <UserCheck
                                  size={12}
                                  className="text-blue-500 mt-1 flex-shrink-0"
                                />
                                <span>{objective}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{service.completions} completions</span>
                        <span>•</span>
                        <span>Rating: {service.rating}/5</span>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AviationContentManagement;
