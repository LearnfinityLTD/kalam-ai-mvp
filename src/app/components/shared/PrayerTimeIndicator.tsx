"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/ui/card";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/ui/use-toast";

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
  mosqueId?: string;
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
  mosqueId,
}: PrayerTimeIndicatorProps) {
  const { toast } = useToast();
  const supabase = useMemo(() => createClient(), []);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [city, setCity] = useState<{ city: string; country?: string } | null>(
    null
  );
  const [times, setTimes] = useState<AladhanTimings | null>(null);
  const [status, setStatus] = useState<
    Pick<PrayerTimes, "current" | "next" | "timeUntilNext">
  >({
    current: "None",
    next: "Fajr",
    timeUntilNext: "N/A",
  });

  // Resolve location:
  // If mosqueId: read `mosques.location` ("City, Country" recommended).
  // Else: use cached coords or browser geolocation.
  const resolveLocation = useCallback(async () => {
    if (mosqueId) {
      const { data, error } = await supabase
        .from("mosques")
        .select("location")
        .eq("id", mosqueId)
        .single();

      if (error || !data?.location) {
        toast({
          title: "خطأ",
          description:
            "تعذر الحصول على موقع المسجد. سيتم استخدام الموقع الجغرافي للجهاز.",
          variant: "destructive",
        });
      } else {
        const parts = String(data.location)
          .split(",")
          .map((s) => s.trim());
        const c = { city: parts[0] || "Dubai", country: parts[1] || "UAE" };
        setCity(c);
        localStorage.setItem("kalamai_city", JSON.stringify(c));
        return;
      }
    }

    // Fallback to device geolocation or cached coords
    const cached = localStorage.getItem("kalamai_coords");
    if (cached) {
      try {
        setCoords(JSON.parse(cached));
        return;
      } catch {
        // ignore parse error
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(loc);
          localStorage.setItem("kalamai_coords", JSON.stringify(loc));
        },
        () => {
          // Last fallback: Dubai center
          const loc = { lat: 25.2048, lng: 55.2708 };
          setCoords(loc);
          localStorage.setItem("kalamai_coords", JSON.stringify(loc));
          toast({
            title: "تنبيه",
            description:
              "الموقع الجغرافي غير متاح. تم استخدام موقع افتراضي (دبي).",
          });
        }
      );
    } else {
      const loc = { lat: 25.2048, lng: 55.2708 };
      setCoords(loc);
      localStorage.setItem("kalamai_coords", JSON.stringify(loc));
    }
  }, [mosqueId, supabase, toast]);

  // Fetch timings (cache per day)
  const fetchTimings = useCallback(async () => {
    const key = `kalamai_prayer_${dayKey()}`;
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
      let url = "";
      if (city) {
        const c = encodeURIComponent(city.city);
        const country = encodeURIComponent(city.country || "UAE");
        url = `https://api.aladhan.com/v1/timingsByCity?city=${c}&country=${country}&method=5&school=1`;
      } else if (coords) {
        url = `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=5&school=1`;
      } else {
        // No location resolved yet
        return;
      }

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
      toast({
        title: "خطأ",
        description:
          "تعذر جلب أوقات الصلاة. سيتم استخدام آخر بيانات مخزنة لهذا اليوم.",
        variant: "destructive",
      });
      const key = `kalamai_prayer_${dayKey()}`;
      const cache = localStorage.getItem(key);
      if (cache) {
        try {
          setTimes(JSON.parse(cache));
        } catch {
          // ignore
        }
      }
    }
  }, [city, coords, toast]);

  // 1) Resolve location on mount or mosqueId change
  useEffect(() => {
    resolveLocation();
  }, [resolveLocation]);

  // 2) Fetch timings whenever we have a location (and once per day)
  useEffect(() => {
    if (city || coords) fetchTimings();
  }, [city, coords, fetchTimings]);

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
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 bg-green-500 rounded-full animate-pulse"
              aria-hidden="true"
            />
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
    </Card>
  );
}
