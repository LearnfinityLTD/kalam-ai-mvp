import React, { useState, useEffect } from "react";
import {
  MapPin,
  Globe,
  Users,
  Plus,
  Search,
  Filter,
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
  Pause,
  Volume2,
  BookOpen,
  Award,
  Camera,
  Compass,
  Mountain,
  Waves,
  Sun,
  Moon,
  Calendar,
  Languages,
  MessageSquare,
  FileText,
  Video,
  Image,
  Mic,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
  Settings,
  Building,
} from "lucide-react";
import { AdminContext, EmployeeData } from "@/app/types/admin";
// Import types from the main dashboard (these should be imported from your types file)

interface TourismContentSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

// Types for tourism content management
interface TourismContent {
  id: string;
  title: string;
  type:
    | "scenario"
    | "vocabulary"
    | "dialogue"
    | "cultural_guide"
    | "destination_info";
  category:
    | "attractions"
    | "hospitality"
    | "transportation"
    | "emergency"
    | "cultural"
    | "business";
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  language: "english" | "arabic" | "both";
  status: "draft" | "review" | "published" | "archived";
  destination: string;
  description: string;
  duration: number; // in minutes
  completions: number;
  rating: number;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  mediaFiles: MediaFile[];
  learningObjectives: string[];
  culturalNotes?: string[];
}

interface MediaFile {
  id: string;
  type: "image" | "video" | "audio";
  url: string;
  caption?: string;
  duration?: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  location: string;
  participants: string[];
  dialogue: DialogueExchange[];
  culturalTips: string[];
  vocabulary: VocabularyItem[];
}

interface DialogueExchange {
  speaker: string;
  role: "tourist" | "guide" | "local" | "staff";
  text: string;
  audioUrl?: string;
  culturalNote?: string;
}

interface VocabularyItem {
  term: string;
  translation: string;
  pronunciation: string;
  context: string;
  example: string;
}

interface TourismContentSectionProps {
  adminContext: AdminContext;
  employees: EmployeeData[];
}

const TourismContentManagement: React.FC<TourismContentSectionProps> = ({
  adminContext,
  employees,
}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [content, setContent] = useState<TourismContent[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedContent, setSelectedContent] = useState<TourismContent | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockContent: TourismContent[] = [
      {
        id: "1",
        title: "Welcoming International Guests at NEOM",
        type: "scenario",
        category: "hospitality",
        level: "B1",
        language: "both",
        status: "published",
        destination: "NEOM Welcome Center",
        description:
          "Interactive scenario for greeting and assisting international visitors at NEOM's main reception.",
        duration: 15,
        completions: 234,
        rating: 4.8,
        lastUpdated: "2024-09-15",
        createdBy: "Sarah Ahmed",
        tags: ["greeting", "hospitality", "cultural sensitivity", "NEOM"],
        mediaFiles: [
          {
            id: "1",
            type: "video",
            url: "/videos/welcome-scenario.mp4",
            caption: "Welcome scenario demonstration",
          },
          {
            id: "2",
            type: "image",
            url: "/images/neom-reception.jpg",
            caption: "NEOM Welcome Center",
          },
        ],
        learningObjectives: [
          "Master professional greeting protocols",
          "Understand cultural sensitivities for international guests",
          "Practice key hospitality vocabulary",
        ],
        culturalNotes: [
          "Be aware of different greeting customs from various cultures",
          "Maintain appropriate distance and eye contact",
          "Use inclusive language that respects all backgrounds",
        ],
      },
      {
        id: "2",
        title: "THE LINE Transportation Guide",
        type: "destination_info",
        category: "transportation",
        level: "A2",
        language: "english",
        status: "published",
        destination: "THE LINE",
        description:
          "Comprehensive guide for explaining THE LINE's revolutionary transportation system to tourists.",
        duration: 20,
        completions: 189,
        rating: 4.6,
        lastUpdated: "2024-09-12",
        createdBy: "Ahmed Al-Mansouri",
        tags: ["THE LINE", "transportation", "technology", "future city"],
        mediaFiles: [
          {
            id: "3",
            type: "video",
            url: "/videos/the-line-transport.mp4",
            caption: "THE LINE transportation overview",
          },
          {
            id: "4",
            type: "image",
            url: "/images/the-line-aerial.jpg",
            caption: "THE LINE aerial view",
          },
        ],
        learningObjectives: [
          "Explain THE LINE's unique transportation concept",
          "Guide tourists through the mobility system",
          "Address common questions about futuristic transport",
        ],
      },
      {
        id: "3",
        title: "Desert Adventure Safety Protocols",
        type: "scenario",
        category: "emergency",
        level: "B2",
        language: "both",
        status: "review",
        destination: "NEOM Desert Region",
        description:
          "Emergency response scenarios for desert tourism activities including safety procedures and communication.",
        duration: 25,
        completions: 67,
        rating: 4.9,
        lastUpdated: "2024-09-10",
        createdBy: "Layla Hassan",
        tags: ["desert", "safety", "emergency", "adventure tourism"],
        mediaFiles: [
          {
            id: "5",
            type: "video",
            url: "/videos/desert-safety.mp4",
            caption: "Desert safety demonstration",
          },
        ],
        learningObjectives: [
          "Implement desert safety protocols",
          "Communicate effectively in emergency situations",
          "Provide clear instructions under pressure",
        ],
        culturalNotes: [
          "Respect local Bedouin traditions and knowledge",
          "Understand the cultural significance of desert landscapes",
        ],
      },
      {
        id: "4",
        title: "Red Sea Marine Life Vocabulary",
        type: "vocabulary",
        category: "attractions",
        level: "A1",
        language: "both",
        status: "published",
        destination: "Red Sea Coast",
        description:
          "Essential marine life vocabulary for underwater tourism experiences at NEOM's Red Sea destinations.",
        duration: 10,
        completions: 445,
        rating: 4.5,
        lastUpdated: "2024-09-08",
        createdBy: "Omar Khalil",
        tags: ["marine life", "vocabulary", "Red Sea", "underwater tourism"],
        mediaFiles: [
          {
            id: "6",
            type: "image",
            url: "/images/red-sea-coral.jpg",
            caption: "Red Sea coral reef",
          },
          {
            id: "7",
            type: "audio",
            url: "/audio/marine-vocabulary.mp3",
            caption: "Marine vocabulary pronunciation",
          },
        ],
        learningObjectives: [
          "Learn key marine life terminology",
          "Practice pronunciation of underwater species names",
          "Understand conservation messaging",
        ],
      },
      {
        id: "5",
        title: "Mountain Resort Cultural Etiquette",
        type: "cultural_guide",
        category: "cultural",
        level: "B1",
        language: "both",
        status: "draft",
        destination: "NEOM Mountain Resorts",
        description:
          "Cultural sensitivity guide for international tourists visiting NEOM's mountain resort areas.",
        duration: 18,
        completions: 23,
        rating: 4.7,
        lastUpdated: "2024-09-18",
        createdBy: "Fatima Al-Zahra",
        tags: [
          "cultural etiquette",
          "mountains",
          "resort",
          "international guests",
        ],
        mediaFiles: [
          {
            id: "8",
            type: "image",
            url: "/images/mountain-resort.jpg",
            caption: "NEOM mountain resort",
          },
        ],
        learningObjectives: [
          "Understand cultural sensitivities in resort settings",
          "Guide appropriate behavior in mixed cultural environments",
          "Foster inclusive tourism experiences",
        ],
        culturalNotes: [
          "Balance modern hospitality with cultural authenticity",
          "Respect diverse religious and cultural practices",
          "Create welcoming spaces for all visitors",
        ],
      },
    ];

    const mockScenarios: Scenario[] = [
      {
        id: "s1",
        name: "Hotel Check-in Experience",
        description:
          "Practice checking in international guests with various requirements and special requests.",
        difficulty: "intermediate",
        location: "NEOM Luxury Hotel",
        participants: [
          "Hotel Receptionist",
          "International Tourist",
          "Concierge",
        ],
        dialogue: [
          {
            speaker: "Tourist",
            role: "tourist",
            text: "Good evening, I have a reservation under the name Johnson.",
            culturalNote:
              "Western guests often prefer direct, efficient service",
          },
          {
            speaker: "Receptionist",
            role: "staff",
            text: "Welcome to NEOM, Mr. Johnson. I'd be delighted to assist you with your check-in.",
            culturalNote:
              "Use welcoming, professional language that shows cultural awareness",
          },
        ],
        culturalTips: [
          "Maintain eye contact with Western guests",
          "Be prepared for direct questions about facilities",
          "Offer assistance proactively",
        ],
        vocabulary: [
          {
            term: "reservation",
            translation: "حجز",
            pronunciation: "rez-er-VAY-shun",
            context: "Hotel booking",
            example: "I have a reservation for tonight.",
          },
        ],
      },
    ];

    setContent(mockContent);
    setScenarios(mockScenarios);
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

    return matchesSearch && matchesCategory && matchesType && matchesStatus;
  });

  const getContentStats = () => {
    return {
      total: content.length,
      published: content.filter((c) => c.status === "published").length,
      inReview: content.filter((c) => c.status === "review").length,
      draft: content.filter((c) => c.status === "draft").length,
      totalCompletions: content.reduce((sum, c) => sum + c.completions, 0),
      averageRating:
        content.reduce((sum, c) => sum + c.rating, 0) / content.length,
    };
  };

  const stats = getContentStats();

  const ContentCreationModal = () => {
    const [newContent, setNewContent] = useState({
      title: "",
      type: "scenario",
      category: "hospitality",
      level: "A1",
      language: "english",
      destination: "",
      description: "",
      duration: 15,
      tags: "",
      learningObjectives: "",
    });

    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Tourism Content
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent({ ...newContent, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={newContent.destination}
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      destination: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., THE LINE, Red Sea Coast"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <select
                  value={newContent.type}
                  onChange={(e) =>
                    setNewContent({ ...newContent, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="scenario">Interactive Scenario</option>
                  <option value="vocabulary">Vocabulary Set</option>
                  <option value="dialogue">Dialogue Practice</option>
                  <option value="cultural_guide">Cultural Guide</option>
                  <option value="destination_info">Destination Info</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newContent.category}
                  onChange={(e) =>
                    setNewContent({ ...newContent, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="attractions">Attractions</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="transportation">Transportation</option>
                  <option value="emergency">Emergency</option>
                  <option value="cultural">Cultural</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={newContent.level}
                  onChange={(e) =>
                    setNewContent({ ...newContent, level: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={newContent.language}
                  onChange={(e) =>
                    setNewContent({ ...newContent, language: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="english">English Only</option>
                  <option value="arabic">Arabic Only</option>
                  <option value="both">Bilingual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newContent.description}
                onChange={(e) =>
                  setNewContent({ ...newContent, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the learning content and its objectives"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newContent.duration}
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      duration: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="5"
                  max="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newContent.tags}
                  onChange={(e) =>
                    setNewContent({ ...newContent, tags: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="hospitality, NEOM, cultural sensitivity"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Objectives (one per line)
              </label>
              <textarea
                value={newContent.learningObjectives}
                onChange={(e) =>
                  setNewContent({
                    ...newContent,
                    learningObjectives: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Master professional greeting protocols&#10;Understand cultural sensitivities&#10;Practice key vocabulary"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Here you would typically save the content
                setShowCreateModal(false);
                // Reset form
                setNewContent({
                  title: "",
                  type: "scenario",
                  category: "hospitality",
                  level: "A1",
                  language: "english",
                  destination: "",
                  description: "",
                  duration: 15,
                  tags: "",
                  learningObjectives: "",
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Content
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <MapPin className="mr-3" size={32} />
              Tourism Content Management
            </h1>
            <p className="mt-2 text-blue-100">
              Manage tourism-specific learning content and scenarios for NEOM
              Tourism Company
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.total}</p>
            <p className="text-blue-100">Total Content Items</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: "Published Content",
            value: stats.published,
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
            label: "Draft Items",
            value: stats.draft,
            icon: Edit,
            color: "bg-gray-500",
          },
          {
            label: "Total Completions",
            value: stats.totalCompletions,
            icon: Target,
            color: "bg-purple-500",
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
            { id: "overview", label: "Content Library", icon: BookOpen },
            { id: "scenarios", label: "Interactive Scenarios", icon: Users },
            { id: "destinations", label: "Destination Guides", icon: Compass },
            {
              id: "analytics",
              label: "Performance Analytics",
              icon: TrendingUp,
            },
            { id: "settings", label: "Content Settings", icon: Settings },
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

      {/* Content Library Tab */}
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
                    placeholder="Search content by title, description, or tags..."
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
                  <option value="attractions">Attractions</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="transportation">Transportation</option>
                  <option value="emergency">Emergency</option>
                  <option value="cultural">Cultural</option>
                  <option value="business">Business</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="scenario">Interactive Scenarios</option>
                  <option value="vocabulary">Vocabulary Sets</option>
                  <option value="dialogue">Dialogue Practice</option>
                  <option value="cultural_guide">Cultural Guides</option>
                  <option value="destination_info">Destination Info</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="review">In Review</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
                          item.type === "scenario"
                            ? "bg-purple-100 text-purple-600"
                            : item.type === "vocabulary"
                            ? "bg-green-100 text-green-600"
                            : item.type === "dialogue"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "cultural_guide"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-cyan-100 text-cyan-600"
                        }`}
                      >
                        {item.type === "scenario" && <Users size={16} />}
                        {item.type === "vocabulary" && <BookOpen size={16} />}
                        {item.type === "dialogue" && (
                          <MessageSquare size={16} />
                        )}
                        {item.type === "cultural_guide" && <Globe size={16} />}
                        {item.type === "destination_info" && (
                          <MapPin size={16} />
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "published"
                            ? "bg-green-100 text-green-800"
                            : item.status === "review"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
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
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {item.destination}
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

                  <div className="flex items-center space-x-2 mb-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.level === "A1"
                          ? "bg-green-100 text-green-700"
                          : item.level === "A2"
                          ? "bg-blue-100 text-blue-700"
                          : item.level === "B1"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.level === "B2"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.level}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.language === "english"
                          ? "bg-blue-50 text-blue-600"
                          : item.language === "arabic"
                          ? "bg-green-50 text-green-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {item.language === "both"
                        ? "Bilingual"
                        : item.language.charAt(0).toUpperCase() +
                          item.language.slice(1)}
                    </span>
                  </div>

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
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No content found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ||
                filterCategory !== "all" ||
                filterType !== "all" ||
                filterStatus !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by creating your first tourism learning content."}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus size={20} />
                <span>Create Content</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Scenarios Tab */}
      {activeTab === "scenarios" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Interactive Tourism Scenarios
              </h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus size={20} />
                <span>Create Scenario</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {scenario.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {scenario.description}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        scenario.difficulty === "beginner"
                          ? "bg-green-100 text-green-800"
                          : scenario.difficulty === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {scenario.difficulty}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {scenario.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {scenario.participants.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Sample Dialogue Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Sample Dialogue
                    </h4>
                    {scenario.dialogue.slice(0, 2).map((exchange, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <div className="text-xs text-gray-500 mb-1">
                          <span className="font-medium">
                            {exchange.speaker}
                          </span>{" "}
                          ({exchange.role})
                        </div>
                        <div className="text-sm text-gray-700 bg-white p-2 rounded border-l-2 border-blue-200">
                          {exchange.text}
                        </div>
                        {exchange.culturalNote && (
                          <div className="text-xs text-blue-600 mt-1 italic">
                            💡 {exchange.culturalNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cultural Tips */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Cultural Tips
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {scenario.culturalTips.slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{scenario.vocabulary.length} vocabulary terms</span>
                      <span>•</span>
                      <span>{scenario.dialogue.length} exchanges</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-purple-600 hover:text-purple-800 p-1 rounded transition-colors">
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

      {/* Destination Guides Tab */}
      {activeTab === "destinations" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              NEOM Destination Guides
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "THE LINE",
                  description:
                    "Revolutionary linear city stretching across 170km",
                  image: "/api/placeholder/400/250",
                  contentCount: 12,
                  icon: <Building className="text-blue-600" size={24} />,
                  highlights: [
                    "Zero-emission transport",
                    "Vertical farming",
                    "AI integration",
                  ],
                },
                {
                  name: "Red Sea Coast",
                  description: "Pristine coral reefs and luxury beach resorts",
                  image: "/api/placeholder/400/250",
                  contentCount: 8,
                  icon: <Waves className="text-cyan-600" size={24} />,
                  highlights: [
                    "Marine conservation",
                    "Diving experiences",
                    "Beach activities",
                  ],
                },
                {
                  name: "Mountain Regions",
                  description:
                    "Dramatic peaks and adventure tourism opportunities",
                  image: "/api/placeholder/400/250",
                  contentCount: 6,
                  icon: <Mountain className="text-green-600" size={24} />,
                  highlights: [
                    "Rock climbing",
                    "Scenic viewpoints",
                    "Desert landscapes",
                  ],
                },
                {
                  name: "OXAGON",
                  description: "Floating industrial complex and innovation hub",
                  image: "/api/placeholder/400/250",
                  contentCount: 4,
                  icon: <Globe className="text-purple-600" size={24} />,
                  highlights: [
                    "Industrial tours",
                    "Technology showcases",
                    "Maritime activities",
                  ],
                },
                {
                  name: "Desert Experiences",
                  description:
                    "Traditional Bedouin culture and adventure sports",
                  image: "/api/placeholder/400/250",
                  contentCount: 10,
                  icon: <Sun className="text-orange-600" size={24} />,
                  highlights: [
                    "Cultural immersion",
                    "Camel trekking",
                    "Stargazing",
                  ],
                },
                {
                  name: "TROJENA",
                  description: "All-season mountain destination with skiing",
                  image: "/api/placeholder/400/250",
                  contentCount: 7,
                  icon: <Mountain className="text-indigo-600" size={24} />,
                  highlights: [
                    "Skiing facilities",
                    "Mountain villages",
                    "Year-round activities",
                  ],
                },
              ].map((destination, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    {destination.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {destination.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Key Highlights
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {destination.highlights.map((highlight, hIndex) => (
                          <li
                            key={hIndex}
                            className="flex items-center space-x-2"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {destination.contentCount} content items
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Content Engagement",
                value: "87%",
                change: "+12%",
                color: "text-green-600",
              },
              {
                label: "Completion Rate",
                value: "74%",
                change: "+8%",
                color: "text-green-600",
              },
              {
                label: "User Satisfaction",
                value: "4.6/5",
                change: "+0.3",
                color: "text-green-600",
              },
              {
                label: "Monthly Active Users",
                value: "1,234",
                change: "+18%",
                color: "text-green-600",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {metric.label}
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </p>
                <p className={`text-sm ${metric.color} mt-1`}>
                  {metric.change} vs last month
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Content Performance Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Top Performing Content
                </h3>
                <div className="space-y-3">
                  {content
                    .filter((c) => c.status === "published")
                    .sort((a, b) => b.completions - a.completions)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {item.category} • {item.level}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {item.completions}
                          </p>
                          <p className="text-xs text-gray-600">completions</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Category Performance
                </h3>
                <div className="space-y-3">
                  {[
                    "hospitality",
                    "attractions",
                    "transportation",
                    "cultural",
                    "emergency",
                  ].map((category) => {
                    const categoryContent = content.filter(
                      (c) => c.category === category
                    );
                    const totalCompletions = categoryContent.reduce(
                      (sum, c) => sum + c.completions,
                      0
                    );
                    const avgRating =
                      categoryContent.reduce((sum, c) => sum + c.rating, 0) /
                      categoryContent.length;

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm capitalize">
                            {category}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {categoryContent.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {totalCompletions}
                          </p>
                          <div className="flex items-center space-x-1">
                            <Star
                              size={12}
                              className="text-yellow-400 fill-current"
                            />
                            <span className="text-xs text-gray-600">
                              {avgRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Content Management Settings
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Default Content Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Language
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="both">Bilingual (English + Arabic)</option>
                      <option value="english">English Only</option>
                      <option value="arabic">Arabic Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Proficiency Level
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="A1">A1 - Beginner</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1" selected>
                        B1 - Intermediate
                      </option>
                      <option value="B2">B2 - Upper Intermediate</option>
                      <option value="C1">C1 - Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Content Review Process
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="auto-review"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label
                      htmlFor="auto-review"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Require review before publishing new content
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cultural-review"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label
                      htmlFor="cultural-review"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Require cultural sensitivity review for all content
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="linguistic-review"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="linguistic-review"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Enable automatic linguistic accuracy checking
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Integration Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NEOM Tourism API
                    </label>
                    <div className="flex">
                      <input
                        type="password"
                        placeholder="Enter API key"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                        Test
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Delivery Network
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="neom-cdn">NEOM CDN (Recommended)</option>
                      <option value="aws-cloudfront">AWS CloudFront</option>
                      <option value="azure-cdn">Azure CDN</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ContentCreationModal />
    </div>
  );
};

export default TourismContentManagement;
