// components/dashboard/PrayerTimeWidget.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  MapPin,
  Bell,
  Settings,
  Sun,
  Sunset,
  Moon,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  icon: React.ReactNode;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

interface PrayerTimeWidgetProps {
  userId?: string;
  className?: string;
}

export function PrayerTimeWidget({ userId, className }: PrayerTimeWidgetProps) {
  const { t } = useI18n();
  const supabase = createClient();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [location, setLocation] = useState<string>("Riyadh, Saudi Arabia");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPrayerSettings();
    fetchPrayerTimes();

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTimeUntilNext();
    }, 60000);

    return () => clearInterval(timer);
  }, [userId]);

  useEffect(() => {
    updateTimeUntilNext();
  }, [prayerTimes, currentTime]);

  const loadUserPrayerSettings = async () => {
    if (!userId) return;

    try {
      const { data: settings } = await supabase
        .from("user_prayer_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (settings) {
        setLocation(settings.location_name);
        // Load other settings if needed
      }

      // Also check user preferences
      const { data: preferences } = await supabase
        .from("user_preferences")
        .select("show_prayer_times")
        .eq("user_id", userId)
        .single();

      if (preferences) {
        setIsEnabled(preferences.show_prayer_times);
      }
    } catch (error) {
      console.error("Error loading prayer settings:", error);
    }
  };

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);

      // Get coordinates for the location (you might want to use a geocoding service)
      const coordinates = getCoordinatesForLocation(location);

      // Calculate prayer times (using a simple calculation - you might want to use a proper library)
      const times = calculatePrayerTimes(
        coordinates.latitude,
        coordinates.longitude
      );

      setPrayerTimes(times);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      // Fallback to default times
      setPrayerTimes(getDefaultPrayerTimes());
    } finally {
      setLoading(false);
    }
  };

  const getCoordinatesForLocation = (locationName: string) => {
    // Simple mapping - in production, use a proper geocoding service
    const locations: Record<string, { latitude: number; longitude: number }> = {
      "Riyadh, Saudi Arabia": { latitude: 24.7136, longitude: 46.6753 },
      "Mecca, Saudi Arabia": { latitude: 21.3891, longitude: 39.8579 },
      "Medina, Saudi Arabia": { latitude: 24.5247, longitude: 39.5692 },
      "Jeddah, Saudi Arabia": { latitude: 21.4858, longitude: 39.1925 },
      "Dubai, UAE": { latitude: 25.2048, longitude: 55.2708 },
      "Abu Dhabi, UAE": { latitude: 24.2532, longitude: 54.3665 },
    };

    return locations[locationName] || locations["Riyadh, Saudi Arabia"];
  };

  const calculatePrayerTimes = (
    latitude: number,
    longitude: number
  ): PrayerTime[] => {
    // Simplified prayer time calculation
    // In production, use a proper Islamic prayer time library like 'adhan' or 'praytimes'
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // These are approximate times - replace with proper calculation
    const baseTimes = [
      {
        name: "Fajr",
        arabicName: "الفجر",
        time: "05:30",
        icon: <Star className="h-4 w-4" />,
      },
      {
        name: "Sunrise",
        arabicName: "الشروق",
        time: "06:45",
        icon: <Sun className="h-4 w-4" />,
      },
      {
        name: "Dhuhr",
        arabicName: "الظهر",
        time: "12:15",
        icon: <Sun className="h-4 w-4" />,
      },
      {
        name: "Asr",
        arabicName: "العصر",
        time: "15:45",
        icon: <Sun className="h-4 w-4" />,
      },
      {
        name: "Maghrib",
        arabicName: "المغرب",
        time: "18:30",
        icon: <Sunset className="h-4 w-4" />,
      },
      {
        name: "Isha",
        arabicName: "العشاء",
        time: "20:00",
        icon: <Moon className="h-4 w-4" />,
      },
    ];

    return baseTimes.map((prayer, index) => {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = new Date(today);
      prayerTime.setHours(hours, minutes, 0, 0);

      const isPassed = now > prayerTime;
      const nextPrayerIndex = findNextPrayerIndex(now, baseTimes);
      const isCurrent = isCurrentPrayerTime(now, prayerTime, index, baseTimes);
      const isNext = index === nextPrayerIndex;

      return {
        ...prayer,
        isPassed,
        isCurrent,
        isNext,
      };
    });
  };

  const getDefaultPrayerTimes = (): PrayerTime[] => {
    return [
      {
        name: "Fajr",
        arabicName: "الفجر",
        time: "05:30",
        icon: <Star className="h-4 w-4" />,
        isPassed: true,
        isCurrent: false,
        isNext: false,
      },
      {
        name: "Sunrise",
        arabicName: "الشروق",
        time: "06:45",
        icon: <Sun className="h-4 w-4" />,
        isPassed: true,
        isCurrent: false,
        isNext: false,
      },
      {
        name: "Dhuhr",
        arabicName: "الظهر",
        time: "12:15",
        icon: <Sun className="h-4 w-4" />,
        isPassed: false,
        isCurrent: true,
        isNext: false,
      },
      {
        name: "Asr",
        arabicName: "العصر",
        time: "15:45",
        icon: <Sun className="h-4 w-4" />,
        isPassed: false,
        isCurrent: false,
        isNext: true,
      },
      {
        name: "Maghrib",
        arabicName: "المغرب",
        time: "18:30",
        icon: <Sunset className="h-4 w-4" />,
        isPassed: false,
        isCurrent: false,
        isNext: false,
      },
      {
        name: "Isha",
        arabicName: "العشاء",
        time: "20:00",
        icon: <Moon className="h-4 w-4" />,
        isPassed: false,
        isCurrent: false,
        isNext: false,
      },
    ];
  };

  const findNextPrayerIndex = (
    now: Date,
    prayers: Array<{ time: string }>
  ): number => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = prayers[i].time.split(":").map(Number);
      const prayerTime = new Date(today);
      prayerTime.setHours(hours, minutes, 0, 0);

      if (now < prayerTime) {
        return i;
      }
    }

    // If all prayers have passed, next is Fajr tomorrow
    return 0;
  };

  const isCurrentPrayerTime = (
    now: Date,
    prayerTime: Date,
    index: number,
    prayers: Array<{ time: string; name: string; arabicName: string }>
  ): boolean => {
    const timeWindow = 30 * 60 * 1000; // 30 minutes window
    return Math.abs(now.getTime() - prayerTime.getTime()) <= timeWindow;
  };

  const updateTimeUntilNext = () => {
    const nextPrayer = prayerTimes.find((p) => p.isNext);
    if (!nextPrayer) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [hours, minutes] = nextPrayer.time.split(":").map(Number);
    const nextPrayerTime = new Date(today);
    nextPrayerTime.setHours(hours, minutes, 0, 0);

    // If prayer has passed today, it's tomorrow
    if (nextPrayerTime <= now) {
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }

    const diff = nextPrayerTime.getTime() - now.getTime();
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursUntil > 0) {
      setTimeUntilNext(`${hoursUntil}h ${minutesUntil}m`);
    } else {
      setTimeUntilNext(`${minutesUntil}m`);
    }
  };

  const togglePrayerTimes = async (enabled: boolean) => {
    setIsEnabled(enabled);

    if (userId) {
      try {
        await supabase.from("user_preferences").upsert({
          user_id: userId,
          show_prayer_times: enabled,
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error updating prayer time preference:", error);
      }
    }
  };

  if (!isEnabled) {
    return null;
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("prayerTimes.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextPrayer = prayerTimes.find((p) => p.isNext);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("prayerTimes.title")}
          </CardTitle>
          <Switch
            checked={isEnabled}
            onCheckedChange={togglePrayerTimes}
            className="scale-75"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {location}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Next Prayer Highlight */}
        {nextPrayer && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {nextPrayer.icon}
                <div>
                  <div className="font-medium text-sm text-blue-900">
                    {nextPrayer.name}
                  </div>
                  <div className="text-xs text-blue-700">
                    {nextPrayer.arabicName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-blue-900">
                  {nextPrayer.time}
                </div>
                <div className="text-xs text-blue-700">in {timeUntilNext}</div>
              </div>
            </div>
          </div>
        )}

        {/* All Prayer Times */}
        <div className="space-y-2">
          {prayerTimes.map((prayer, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                prayer.isCurrent
                  ? "bg-green-50 border border-green-200"
                  : prayer.isPassed
                  ? "opacity-60"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`${
                    prayer.isCurrent
                      ? "text-green-600"
                      : prayer.isPassed
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {prayer.icon}
                </div>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      prayer.isCurrent ? "text-green-900" : ""
                    }`}
                  >
                    {prayer.name}
                  </div>
                  <div
                    className={`text-xs ${
                      prayer.isCurrent
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    {prayer.arabicName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`font-mono text-sm ${
                    prayer.isCurrent ? "font-bold text-green-900" : ""
                  }`}
                >
                  {prayer.time}
                </div>
                {prayer.isCurrent && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    {t("prayerTimes.current")}
                  </Badge>
                )}
                {prayer.isNext && !prayer.isCurrent && (
                  <Badge
                    variant="outline"
                    className="text-xs border-blue-200 text-blue-700"
                  >
                    {t("prayerTimes.next")}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Current Time */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("prayerTimes.currentTime")}</span>
            <span className="font-mono">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Settings Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => {
            // Open prayer settings modal
          }}
        >
          <Settings className="h-3 w-3 mr-1" />
          {t("prayerTimes.settings")}
        </Button>
      </CardContent>
    </Card>
  );
}
