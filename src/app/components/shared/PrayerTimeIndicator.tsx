"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/ui/card";
import { useToast } from "@/ui/use-toast";
import { Button } from "@/ui/button";
import { Eye, EyeOff, Settings } from "lucide-react";
type Coords = { lat: number; lng: number };

interface PrayerTimes {
  current: string;
  next: string;
  timeUntilNext: string;
  allTimes: Record<"Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha", string>;
}

interface AladhanTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: { timings: AladhanTimings };
}

const ARABIC_NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
  None: "لا صلاة",
};

type PrayerTimeIndicatorProps = {
  calculationMethod?: number;
  school?: number;
  userId?: string;
  onToggleVisibility?: (visible: boolean) => void | Promise<void>;
  onToggleMinimized?: (minimized: boolean) => void | Promise<void>;
};

/** Extract "HH:mm" safely from strings like "05:30", "5:30", or "05:30 (AST)" */
function extractHHMM(value: string): string | null {
  const m = value?.match?.(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = m[1].padStart(2, "0");
  const mm = m[2];
  return `${h}:${mm}`;
}

/** Parse "HH:mm" into a Date on the given base date */
function parseOnDate(hhmm: string, base: Date): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

/** Format time diff into Arabic "X ساعة Y دقيقة" or "الآن" */
function formatDiffArabic(nextTime: Date): string {
  const now = new Date();
  const diffMs = nextTime.getTime() - now.getTime();
  if (diffMs <= 0) return "الآن";
  const totalMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins} دقيقة`;
  if (mins === 0) return `${hours} ساعة`;
  return `${hours} ساعة ${mins} دقيقة`;
}

/** Compute current + next prayer based on today's timings */
function computeStatus(timings: AladhanTimings): {
  current: string;
  next: string;
  timeUntilNext: string;
} {
  const now = new Date();
  const items = (["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const).map(
    (name) => {
      const hhmm = extractHHMM(timings[name]) ?? "00:00";
      return { name, time: parseOnDate(hhmm, now) };
    }
  );

  // Sort just in case API returns unordered (shouldn't)
  items.sort((a, b) => a.time.getTime() - b.time.getTime());

  let current = "None";
  let next = items[0].name;
  let nextTime = items[0].time;

  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const n = items[(i + 1) % items.length];
    if (now < p.time) {
      current = "None";
      next = p.name;
      nextTime = p.time;
      break;
    } else if (now >= p.time && now < n.time) {
      current = p.name;
      next = n.name;
      nextTime = n.time;
      break;
    }
    // If after last prayer, wrap to Fajr tomorrow (handled below)
    if (i === items.length - 1 && now >= p.time) {
      current = p.name;
      next = items[0].name;
      // Next is tomorrow's first prayer, add 24h
      nextTime = new Date(items[0].time.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  return {
    current,
    next,
    timeUntilNext: formatDiffArabic(nextTime),
  };
}

/** YYYY-MM-DD key in local timezone */
function dayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function PrayerTimeIndicator({
  calculationMethod = 5,
  school = 1,
}: PrayerTimeIndicatorProps) {
  const { toast } = useToast();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [times, setTimes] = useState<AladhanTimings | null>(null);
  const [status, setStatus] = useState<
    Pick<PrayerTimes, "current" | "next" | "timeUntilNext">
  >({
    current: "None",
    next: "Fajr",
    timeUntilNext: "N/A",
  });

  // ✅ Add missing states
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // ✅ Handlers
  const handleMinimize = () => setIsMinimized((prev) => !prev);
  const handleToggleVisibility = () => setIsVisible((prev) => !prev);

  // Always use device geolocation first
  const resolveLocation = useCallback(async () => {
    // Check for cached coordinates first
    const cached = localStorage.getItem("kalamai_coords");
    const cacheTime = localStorage.getItem("kalamai_coords_time");

    if (cached && cacheTime) {
      try {
        const coords = JSON.parse(cached);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        // Use cached coords if less than 24h old
        if (now - parseInt(cacheTime) < oneDay) {
          setCoords(coords);
          return;
        }
      } catch {
        // ignore parse error, will get fresh location
      }
    }

    // Get fresh GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(loc);
          localStorage.setItem("kalamai_coords", JSON.stringify(loc));
          localStorage.setItem("kalamai_coords_time", Date.now().toString());
        },
        (error) => {
          console.warn("Geolocation error:", error);

          // Fallback to cached coords if available
          if (cached) {
            try {
              setCoords(JSON.parse(cached));
              toast({
                title: "استخدام الموقع المحفوظ",
                description: "تم استخدام آخر موقع محفوظ",
              });
              return;
            } catch {
              // ignore
            }
          }

          // Last fallback: Dubai center
          const loc = { lat: 25.2048, lng: 55.2708 };
          setCoords(loc);
          localStorage.setItem("kalamai_coords", JSON.stringify(loc));
          localStorage.setItem("kalamai_coords_time", Date.now().toString());

          toast({
            title: "تنبيه",
            description:
              "تعذر الحصول على موقعك. تم استخدام موقع افتراضي (دبي).",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache for 1 minute
        }
      );
    } else {
      // Browser doesn't support geolocation
      const loc = { lat: 25.2048, lng: 55.2708 };
      setCoords(loc);
      localStorage.setItem("kalamai_coords", JSON.stringify(loc));
      localStorage.setItem("kalamai_coords_time", Date.now().toString());

      toast({
        title: "تنبيه",
        description: "المتصفح لا يدعم تحديد الموقع. تم استخدام موقع افتراضي.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch timings (cache per day)
  const fetchTimings = useCallback(async () => {
    if (!coords) return; // Wait for coordinates

    const key = `kalamai_prayer_${dayKey()}_${calculationMethod}_${school}`;
    const cache = localStorage.getItem(key);
    if (cache) {
      try {
        const parsed: AladhanTimings = JSON.parse(cache);
        setTimes(parsed);
        return;
      } catch {
        // ignore
      }
    }

    try {
      const url = `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=${calculationMethod}&school=${school}`;

      const res = await fetch(url, { cache: "no-store" });
      const data: AladhanResponse = await res.json();

      if (data.code !== 200 || !data.data?.timings) {
        throw new Error("Aladhan API error");
      }

      // Normalize to HH:mm
      const t = data.data.timings;
      const normalized: AladhanTimings = {
        Fajr: extractHHMM(t.Fajr) ?? "05:30",
        Dhuhr: extractHHMM(t.Dhuhr) ?? "12:15",
        Asr: extractHHMM(t.Asr) ?? "15:45",
        Maghrib: extractHHMM(t.Maghrib) ?? "18:30",
        Isha: extractHHMM(t.Isha) ?? "20:00",
      };

      localStorage.setItem(key, JSON.stringify(normalized));
      setTimes(normalized);
    } catch (e) {
      console.log(e);
      toast({
        title: "خطأ",
        description:
          "تعذر جلب أوقات الصلاة. سيتم استخدام آخر بيانات مخزنة لهذا اليوم.",
        variant: "destructive",
      });

      // Try to use any cached data for today with any method/school
      const fallbackKey = `kalamai_prayer_${dayKey()}`;
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(fallbackKey)
      );

      if (keys.length > 0) {
        try {
          const fallbackData = localStorage.getItem(keys[0]);
          if (fallbackData) {
            setTimes(JSON.parse(fallbackData));
          }
        } catch {
          // ignore
        }
      }
    }
  }, [coords, calculationMethod, school, toast]);

  // 1) Resolve location on mount
  useEffect(() => {
    resolveLocation();
  }, [resolveLocation]);

  // 2) Fetch timings whenever we have coordinates or preferences change
  useEffect(() => {
    if (coords) fetchTimings();
  }, [coords, calculationMethod, school, fetchTimings]);

  // 3) Recompute status every minute without refetching
  useEffect(() => {
    if (!times) return;
    const tick = () => setStatus(computeStatus(times));
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [times]);

  const allTimes: PrayerTimes["allTimes"] = useMemo(
    () => ({
      Fajr: times?.Fajr ?? "--:--",
      Dhuhr: times?.Dhuhr ?? "--:--",
      Asr: times?.Asr ?? "--:--",
      Maghrib: times?.Maghrib ?? "--:--",
      Isha: times?.Isha ?? "--:--",
    }),
    [times]
  );

  return (
    <Card
      className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500"
      dir="rtl"
      role="region"
      aria-label="مؤشر أوقات الصلاة"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-800">
              أوقات الصلاة
            </span>
            <span
              className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
              aria-hidden="true"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleMinimize}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-green-700 hover:text-green-900 hover:bg-green-100"
              title={isMinimized ? "توسيع أوقات الصلاة" : "تصغير أوقات الصلاة"}
            >
              {isMinimized ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
            <Button
              onClick={handleToggleVisibility}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-green-700 hover:text-green-900 hover:bg-green-100"
              title="إخفاء أوقات الصلاة"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-green-800">
                الصلاة الحالية:{" "}
                {ARABIC_NAMES[status.current] ?? ARABIC_NAMES.None}
              </span>
            </div>
            <div className="text-sm text-green-700">
              التالي:{" "}
              <span className="font-semibold">
                {ARABIC_NAMES[status.next] ?? ""}
              </span>{" "}
              في {status.timeUntilNext}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-xs" role="list">
            {(
              ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as Array<
                keyof PrayerTimes["allTimes"]
              >
            ).map((name) => {
              const isCurrent = status.current === name;
              return (
                <div
                  key={name}
                  className={`text-center p-2 rounded transition-all ${
                    isCurrent
                      ? "bg-green-200 text-green-800 font-semibold shadow-sm"
                      : "text-green-700 hover:bg-green-100"
                  }`}
                  role="listitem"
                  aria-label={`${ARABIC_NAMES[name]} في ${allTimes[name]}`}
                >
                  <div className="font-medium">{ARABIC_NAMES[name]}</div>
                  <div className="mt-1">{allTimes[name]}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}

      {isMinimized && (
        <CardContent className="pt-0 pb-3">
          <div className="text-center text-sm text-green-700">
            التالي:{" "}
            <span className="font-semibold">
              {ARABIC_NAMES[status.next] ?? ""}
            </span>{" "}
            في {status.timeUntilNext}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
