import React, { useState, useEffect } from "react";
import {
  Building,
  Clock,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Volume2,
  Users,
  Sun,
  Moon,
  Compass,
  Globe,
  Edit,
  Save,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminContext, Company, Mosque } from "@/app/types/admin";
interface IslamicDate {
  day: number;
  month: string;
  monthArabic: string;
  year: number;
  formatted: string;
  formattedArabic: string;
  weekday: string;
  weekdayArabic: string;
}

// Automatic Islamic Date Calculation using API
const fetchIslamicDate = async (gregorianDate: Date) => {
  try {
    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1; // JavaScript months are 0-indexed
    const day = gregorianDate.getDate();

    // Using AlAdhan API for accurate Islamic date conversion
    const response = await fetch(
      `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Islamic date");
    }

    const data = await response.json();
    const hijri = data.data.hijri;

    return {
      day: parseInt(hijri.day),
      month: hijri.month.en,
      monthArabic: hijri.month.ar,
      year: parseInt(hijri.year),
      formatted: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
      formattedArabic: `${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`,
      weekday: hijri.weekday.en,
      weekdayArabic: hijri.weekday.ar,
    };
  } catch (error) {
    console.error("Error fetching Islamic date:", error);
    // TODO: maybe: Fallback to a simple display if API fails
  }
};

interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  adjustmentMinutes: number;
  enabled: boolean;
  announcement: boolean;
  reminderMinutes: number;
}

type Madhab = "hanafi" | "shafi" | "maliki" | "hanbali";

interface PrayerSettings {
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  calculationMethod:
    | "muslim_world_league"
    | "egyptian"
    | "karachi"
    | "umm_al_qura"
    | "dubai"
    | "custom";
  madhab: Madhab;
  adjustments: {
    fajr: number;
    sunrise: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  announcements: {
    enabled: boolean;
    volume: number;
    adhanAudio: boolean;
    multilingualAnnouncements: boolean;
    languages: string[];
  };
  notifications: {
    enabled: boolean;
    beforePrayer: number;
    duringIqama: boolean;
  };
  workSchedule: {
    prayerBreaks: boolean;
    breakDuration: number;
    fridayPrayer: {
      enabled: boolean;
      startTime: string;
      duration: number;
    };
  };
}

interface PrayerManagementProps {
  adminContext: AdminContext;
  onSettingsChange?: (settings: PrayerSettings) => void;
}

const isCompany = (org: Company | Mosque): org is Company => {
  return "industry" in org;
};

const isMosque = (org: Company | Mosque): org is Mosque => {
  return "admin_phone" in org;
};

const PrayerManagementSection: React.FC<PrayerManagementProps> = ({
  adminContext,
  onSettingsChange,
}) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentIslamicDate, setCurrentIslamicDate] =
    useState<IslamicDate | null>();
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      prayer: string;
      message: string;
      type: "reminder" | "prayer_time" | "iqama";
      timestamp: Date;
    }>
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settings, setSettings] = useState<PrayerSettings>({
    location: {
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
    },
    calculationMethod: "umm_al_qura", // Default to Umm Al-Qura for Saudi context
    madhab: "shafi",
    adjustments: {
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
    announcements: {
      enabled: true,
      volume: 70,
      adhanAudio: true,
      multilingualAnnouncements: false,
      languages: ["arabic"],
    },
    notifications: {
      enabled: true,
      beforePrayer: 10,
      duringIqama: true,
    },
    workSchedule: {
      prayerBreaks: true,
      breakDuration: 15,
      fridayPrayer: {
        enabled: true,
        startTime: "12:00",
        duration: 60,
      },
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  // Update Islamic date every minute
  useEffect(() => {
    const updateIslamicDate = async () => {
      const islamicDate = await fetchIslamicDate(new Date());
      setCurrentIslamicDate(islamicDate);
    };

    // Update immediately
    updateIslamicDate();

    // Update every minute
    const interval = setInterval(updateIslamicDate, 60000);

    return () => clearInterval(interval);
  }, []);

  const triggerDemoNotification = (
    prayerName: string,
    type: "reminder" | "prayer_time" | "iqama"
  ) => {
    const messages = {
      reminder: `${prayerName} prayer in 10 minutes`,
      prayer_time: `${prayerName} prayer time has arrived`,
      iqama: `${prayerName} Iqama starting now`,
    };

    const notification = {
      id: Date.now().toString(),
      prayer: prayerName,
      message: messages[type],
      type,
      timestamp: new Date(),
    };

    setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    setShowNotifications(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const demoNotificationButtons = (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => triggerDemoNotification("Dhuhr", "reminder")}
        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
      >
        Demo Dhur Reminder
      </button>
      <button
        onClick={() => triggerDemoNotification("Asr", "prayer_time")}
        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
      >
        Demo Asr Prayer
      </button>
      <button
        onClick={() => triggerDemoNotification("Maghrib", "iqama")}
        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
      >
        Demo Iqama
      </button>
    </div>
  );

  // Initialize with organization data
  useEffect(() => {
    if (adminContext.organizationData) {
      const orgData = adminContext.organizationData;
      getCurrentLocation();

      let city = "";
      let country = "";
      let latitude = 0;
      let longitude = 0;

      if (isMosque(orgData)) {
        if (orgData.location) {
          const locationParts = orgData.location
            .split(",")
            .map((part) => part.trim());
          if (locationParts.length >= 2) {
            city = locationParts[0] || "";
            country = locationParts[1] || "";
          } else {
            city = orgData.location;
          }
        }

        const commonLocations: Record<
          string,
          { lat: number; lng: number; country: string }
        > = {
          mecca: { lat: 21.4225, lng: 39.8262, country: "Saudi Arabia" },
          makkah: { lat: 21.4225, lng: 39.8262, country: "Saudi Arabia" },
          medina: { lat: 24.4539, lng: 39.604, country: "Saudi Arabia" },
          madinah: { lat: 24.4539, lng: 39.604, country: "Saudi Arabia" },
          riyadh: { lat: 24.7136, lng: 46.6753, country: "Saudi Arabia" },
          jeddah: { lat: 21.4858, lng: 39.1925, country: "Saudi Arabia" },
          dubai: { lat: 25.2048, lng: 55.2708, country: "UAE" },
          doha: { lat: 25.2854, lng: 51.531, country: "Qatar" },
          kuwait: { lat: 29.3117, lng: 47.4818, country: "Kuwait" },
          cairo: { lat: 30.0444, lng: 31.2357, country: "Egypt" },
          istanbul: { lat: 41.0082, lng: 28.9784, country: "Turkey" },
        };

        const locationKey = city.toLowerCase();
        if (commonLocations[locationKey]) {
          latitude = commonLocations[locationKey].lat;
          longitude = commonLocations[locationKey].lng;
          if (!country) {
            country = commonLocations[locationKey].country;
          }
        }
      }

      setSettings((prev) => ({
        ...prev,
        location: {
          city,
          country,
          latitude,
          longitude,
        },
      }));
    }

    // Mock prayer times - in real app, would fetch from API based on location
    const mockPrayerTimes: PrayerTime[] = [
      {
        name: "Fajr",
        arabicName: "الفجر",
        time: "05:15",
        adjustmentMinutes: 0,
        enabled: true,
        announcement: true,
        reminderMinutes: 10,
      },
      {
        name: "Sunrise",
        arabicName: "الشروق",
        time: "06:35",
        adjustmentMinutes: 0,
        enabled: false,
        announcement: false,
        reminderMinutes: 0,
      },
      {
        name: "Dhuhr",
        arabicName: "الظهر",
        time: "12:05",
        adjustmentMinutes: 0,
        enabled: true,
        announcement: true,
        reminderMinutes: 10,
      },
      {
        name: "Asr",
        arabicName: "العصر",
        time: "15:25",
        adjustmentMinutes: 0,
        enabled: true,
        announcement: true,
        reminderMinutes: 10,
      },
      {
        name: "Maghrib",
        arabicName: "المغرب",
        time: "17:45",
        adjustmentMinutes: 0,
        enabled: true,
        announcement: true,
        reminderMinutes: 10,
      },
      {
        name: "Isha",
        arabicName: "العشاء",
        time: "19:15",
        adjustmentMinutes: 0,
        enabled: true,
        announcement: true,
        reminderMinutes: 10,
      },
    ];

    setPrayerTimes(mockPrayerTimes);
    setLastUpdated(new Date().toLocaleDateString());
  }, [adminContext.organizationData]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSettingsChange?.(settings);
      setLastUpdated(new Date().toLocaleDateString());
    } catch (error) {
      console.error("Failed to save prayer settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrayerTime = (
    index: number,
    field: keyof PrayerTime,
    value: unknown
  ) => {
    setPrayerTimes((prev) =>
      prev.map((prayer, i) =>
        i === index ? { ...prayer, [field]: value } : prayer
      )
    );
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();

          setSettings((prev) => ({
            ...prev,
            location: {
              city: data.city || data.locality || "",
              country: data.countryName || "",
              latitude,
              longitude,
            },
          }));

          setLocationError("");
        } catch (error) {
          setSettings((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              latitude,
              longitude,
            },
          }));
          setLocationError(
            "Location detected but could not determine city name"
          );
        }

        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Unable to detect location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const calculationMethods = [
    { value: "muslim_world_league", label: "Muslim World League" },
    { value: "egyptian", label: "Egyptian General Authority" },
    { value: "karachi", label: "University of Islamic Sciences, Karachi" },
    { value: "umm_al_qura", label: "Umm Al-Qura University, Makkah" },
    { value: "dubai", label: "Dubai (UAE)" },
    { value: "custom", label: "Custom Settings" },
  ];

  const NotificationPanel = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 bg-white animate-slide-in ${
            notification.type === "reminder"
              ? "border-yellow-500"
              : notification.type === "prayer_time"
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                notification.type === "reminder"
                  ? "bg-yellow-100 text-yellow-600"
                  : notification.type === "prayer_time"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <Bell size={16} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {notification.prayer}
              </p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <NotificationPanel />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <Building className="mr-3" size={32} />
              Prayer Time Management
            </h2>
            <p className="mt-2 text-emerald-100">
              Configure prayer times and Islamic calendar integration for{" "}
              {adminContext.scope.organizationName}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-emerald-100 mb-1">
              <MapPin size={16} />
              <span>
                {settings.location.city}, {settings.location.country}
              </span>
            </div>
            <div className="flex items-center justify-end space-x-3 text-emerald-100">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{currentIslamicDate?.formatted || "Loading..."}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
            {locationError && (
              <p className="text-sm text-red-200 mt-1">{locationError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: "schedule", label: "Prayer Schedule", icon: Clock },
            { id: "location", label: "Location Settings", icon: MapPin },
            { id: "announcements", label: "Announcements", icon: Volume2 },
            { id: "workplace", label: "Workplace Integration", icon: Users },
            { id: "calendar", label: "Islamic Calendar", icon: Calendar },
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

      {/* Prayer Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Daily Prayer Times
              </h3>

              {demoNotificationButtons}
              <div className="flex items-center space-x-3">
                <select
                  value={settings.calculationMethod}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      calculationMethod: e.target
                        .value as PrayerSettings["calculationMethod"],
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {calculationMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {prayerTimes.map((prayer, index) => (
                <div
                  key={prayer.name}
                  className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          prayer.enabled
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {prayer.name === "Fajr" && <Moon size={16} />}
                        {prayer.name === "Sunrise" && <Sun size={16} />}
                        {(prayer.name === "Dhuhr" || prayer.name === "Asr") && (
                          <Sun size={16} />
                        )}
                        {prayer.name === "Maghrib" && <Sun size={16} />}
                        {prayer.name === "Isha" && <Moon size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {prayer.name}
                        </p>
                        <p className="text-sm text-gray-500" dir="rtl">
                          {prayer.arabicName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={prayer.time}
                      onChange={(e) =>
                        updatePrayerTime(index, "time", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adjustment
                    </label>
                    <input
                      type="number"
                      value={prayer.adjustmentMinutes}
                      onChange={(e) =>
                        updatePrayerTime(
                          index,
                          "adjustmentMinutes",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="±min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder
                    </label>
                    <input
                      type="number"
                      value={prayer.reminderMinutes}
                      onChange={(e) =>
                        updatePrayerTime(
                          index,
                          "reminderMinutes",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="min before"
                    />
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={prayer.enabled}
                        onChange={(e) =>
                          updatePrayerTime(index, "enabled", e.target.checked)
                        }
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Enabled</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={prayer.announcement}
                        onChange={(e) =>
                          updatePrayerTime(
                            index,
                            "announcement",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Announce</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Madhab Selection */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">
                Juridical School (Madhab)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="madhab"
                    value="shafi"
                    checked={settings.madhab === "shafi"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        madhab: e.target.value as Madhab,
                      }))
                    }
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Shafi&apos;i (Earlier Asr time)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="madhab"
                    value="hanafi"
                    checked={settings.madhab === "hanafi"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        madhab: e.target.value as Madhab,
                      }))
                    }
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Hanafi (Later Asr time)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="madhab"
                    value="maliki"
                    checked={settings.madhab === "maliki"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        madhab: e.target.value as Madhab,
                      }))
                    }
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Maliki</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="madhab"
                    value="hanbali"
                    checked={settings.madhab === "hanbali"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        madhab: e.target.value as Madhab,
                      }))
                    }
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Hanbali</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Settings Tab */}
      {activeTab === "location" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Location Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={settings.location.city}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={settings.location.country}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      location: { ...prev.location, country: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter country name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={settings.location.latitude}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        latitude: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter latitude"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={settings.location.longitude}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        longitude: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter longitude"
                />
              </div>
            </div>

            <button
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <MapPin size={16} />
              <span>
                {locationLoading ? "Detecting..." : "Auto-detect Location"}
              </span>
            </button>

            {/* Qibla Direction */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Compass size={20} className="text-green-600" />
                <h4 className="font-semibold text-gray-900">Qibla Direction</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Based on current location coordinates, the Qibla direction is
                approximately:
              </p>
              <div className="text-2xl font-bold text-green-600">
                285° (WNW)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Prayer Announcements
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.announcements.enabled}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          announcements: {
                            ...prev.announcements,
                            enabled: e.target.checked,
                          },
                        }))
                      }
                      className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span className="text-lg font-medium text-gray-900">
                      Enable Prayer Announcements
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume Level
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.announcements.volume}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        announcements: {
                          ...prev.announcements,
                          volume: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {settings.announcements.volume}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.announcements.adhanAudio}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          announcements: {
                            ...prev.announcements,
                            adhanAudio: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Play Adhan Audio</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.announcements.multilingualAnnouncements}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          announcements: {
                            ...prev.announcements,
                            multilingualAnnouncements: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Multilingual Announcements</span>
                  </label>
                </div>
              </div>

              {settings.announcements.multilingualAnnouncements && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement Languages
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "arabic",
                      "english",
                      "urdu",
                      "turkish",
                      "french",
                      "malay",
                      "bengali",
                      "persian",
                    ].map((lang) => (
                      <label key={lang} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={settings.announcements.languages.includes(
                            lang
                          )}
                          onChange={(e) => {
                            const languages = e.target.checked
                              ? [...settings.announcements.languages, lang]
                              : settings.announcements.languages.filter(
                                  (l) => l !== lang
                                );
                            setSettings((prev) => ({
                              ...prev,
                              announcements: {
                                ...prev.announcements,
                                languages,
                              },
                            }));
                          }}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span className="capitalize">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workplace Integration Tab */}
      {activeTab === "workplace" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Workplace Integration
            </h3>

            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.workSchedule.prayerBreaks}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        workSchedule: {
                          ...prev.workSchedule,
                          prayerBreaks: e.target.checked,
                        },
                      }))
                    }
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="text-lg font-medium text-gray-900">
                    Enable Prayer Breaks
                  </span>
                </label>
                <p className="text-sm text-gray-600 ml-8">
                  Automatically schedule prayer breaks in work calendars
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prayer Break Duration
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={settings.workSchedule.breakDuration}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          workSchedule: {
                            ...prev.workSchedule,
                            breakDuration: parseInt(e.target.value) || 15,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      min="10"
                      max="30"
                    />
                    <span className="text-sm text-gray-500">minutes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.enabled}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              enabled: e.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span>Staff notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.duringIqama}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              duringIqama: e.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span>Iqama notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Friday Prayer Settings */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar size={20} className="text-blue-600" />
                  <h4 className="font-semibold text-gray-900">
                    Friday Prayer (Jumu&apos;ah)
                  </h4>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.workSchedule.fridayPrayer.enabled}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          workSchedule: {
                            ...prev.workSchedule,
                            fridayPrayer: {
                              ...prev.workSchedule.fridayPrayer,
                              enabled: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="font-medium">
                      Enable Friday Prayer Schedule
                    </span>
                  </label>

                  {settings.workSchedule.fridayPrayer.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={settings.workSchedule.fridayPrayer.startTime}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              workSchedule: {
                                ...prev.workSchedule,
                                fridayPrayer: {
                                  ...prev.workSchedule.fridayPrayer,
                                  startTime: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.workSchedule.fridayPrayer.duration}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              workSchedule: {
                                ...prev.workSchedule,
                                fridayPrayer: {
                                  ...prev.workSchedule.fridayPrayer,
                                  duration: parseInt(e.target.value) || 60,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="30"
                          max="120"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Islamic Calendar Tab */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Islamic Calendar Integration
            </h3>

            <div className="space-y-6">
              {/* Current Islamic Date - NOW AUTOMATIC WITH API */}
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar size={20} className="text-emerald-600" />
                  <h4 className="font-semibold text-gray-900">
                    Current Islamic Date
                  </h4>
                </div>
                <p className="text-xl font-bold text-emerald-800" dir="rtl">
                  {currentIslamicDate?.formattedArabic}
                </p>
                <p className="text-sm text-gray-600">
                  {currentIslamicDate?.formatted} (
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  CE)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentIslamicDate?.weekday} • Based on AlAdhan API • Updates
                  automatically
                </p>
              </div>

              {/* Upcoming Islamic Events */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Islamic Events
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      name: "Mawlid al-Nabi",
                      arabicName: "مولد النبي",
                      date: "12 Rabi' al-Awwal",
                      gregorianDate: "September 16, 2025",
                      type: "religious",
                      daysUntil: 3,
                    },
                    {
                      name: "First Day of Ramadan (Expected)",
                      arabicName: "أول رمضان",
                      date: "1 Ramadan",
                      gregorianDate: "March 1, 2026",
                      type: "ramadan",
                      daysUntil: 163,
                    },
                    {
                      name: "Laylat al-Qadr (Expected)",
                      arabicName: "ليلة القدر",
                      date: "27 Ramadan",
                      gregorianDate: "March 27, 2026",
                      type: "special",
                      daysUntil: 189,
                    },
                    {
                      name: "Eid al-Fitr (Expected)",
                      arabicName: "عيد الفطر",
                      date: "1 Shawwal",
                      gregorianDate: "March 31, 2026",
                      type: "eid",
                      daysUntil: 193,
                    },
                  ].map((event, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        event.type === "eid"
                          ? "bg-green-50 border-green-200"
                          : event.type === "ramadan"
                          ? "bg-purple-50 border-purple-200"
                          : event.type === "special"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            {event.name}
                          </h5>
                          <p className="text-sm text-gray-600" dir="rtl">
                            {event.arabicName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {event.date} • {event.gregorianDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {event.daysUntil} days
                          </p>
                          <p className="text-xs text-gray-500">until event</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Settings */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Calendar Integration Settings
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Show Islamic dates in all announcements</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Automatic Ramadan/Hajj schedule adjustments</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Send notifications for major Islamic events</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Integrate with external calendar systems</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button (shown on all tabs) */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Prayer Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {lastUpdated && (
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle size={16} />
          <span>Prayer settings saved successfully on {lastUpdated}</span>
        </div>
      )}
    </div>
  );
};

export default PrayerManagementSection;
