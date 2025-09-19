import React, { useState, useEffect } from "react";
import {
  Building,
  Clock,
  MapPin,
  Calendar,
  Volume2,
  Users,
  Sun,
  Moon,
  Compass,
  Save,
  CheckCircle,
} from "lucide-react";
import { AdminContext, Company, Mosque } from "@/app/types/admin";

// Types
interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  adjustmentMinutes: number;
  enabled: boolean;
  announcement: boolean;
  reminderMinutes: number;
}

type Madhab = "hanafi" | "shafi";
type CalculationMethod =
  | "muslim_world_league"
  | "egyptian"
  | "karachi"
  | "umm_al_qura"
  | "dubai"
  | "custom";

interface PrayerSettings {
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  calculationMethod: CalculationMethod;
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
  const [settings, setSettings] = useState<PrayerSettings>({
    location: {
      city: "",
      country: "",
      latitude: 0,
      longitude: 0,
    },
    calculationMethod: "muslim_world_league",
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

  // Save settings
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

  // Update prayer time
  const updatePrayerTime = <K extends keyof PrayerTime>(
    index: number,
    field: K,
    value: PrayerTime[K]
  ) => {
    setPrayerTimes((prev) =>
      prev.map((prayer, i) =>
        i === index ? { ...prayer, [field]: value } : prayer
      )
    );
  };

  // Get current location
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
          const data: {
            city?: string;
            locality?: string;
            countryName?: string;
          } = await response.json();

          setSettings((prev) => ({
            ...prev,
            location: {
              city: data.city || data.locality || "",
              country: data.countryName || "",
              latitude,
              longitude,
            },
          }));
        } catch {
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Calculation methods
  const calculationMethods: { value: CalculationMethod; label: string }[] = [
    { value: "muslim_world_league", label: "Muslim World League" },
    { value: "egyptian", label: "Egyptian General Authority" },
    { value: "karachi", label: "University of Islamic Sciences, Karachi" },
    { value: "umm_al_qura", label: "Umm Al-Qura University, Makkah" },
    { value: "dubai", label: "Dubai (UAE)" },
    { value: "custom", label: "Custom Settings" },
  ];

  return (
    <div>
      {/* ...UI unchanged... */}
      <select
        value={settings.calculationMethod}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSettings((prev) => ({
            ...prev,
            calculationMethod: e.target.value as CalculationMethod,
          }))
        }
      >
        {calculationMethods.map((method) => (
          <option key={method.value} value={method.value}>
            {method.label}
          </option>
        ))}
      </select>

      {/* Madhab radios */}
      <input
        type="radio"
        name="madhab"
        value="shafi"
        checked={settings.madhab === "shafi"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSettings((prev) => ({ ...prev, madhab: e.target.value as Madhab }))
        }
      />
      <input
        type="radio"
        name="madhab"
        value="hanafi"
        checked={settings.madhab === "hanafi"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSettings((prev) => ({ ...prev, madhab: e.target.value as Madhab }))
        }
      />
    </div>
  );
};

export default PrayerManagementSection;
