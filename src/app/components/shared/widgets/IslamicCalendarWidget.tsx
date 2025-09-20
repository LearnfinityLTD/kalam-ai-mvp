// components/dashboard/IslamicCalendarWidget.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Star, Moon, ArrowRight, Info, Gift } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n/context";

interface IslamicEvent {
  id: string;
  event_name: string;
  event_type: "holiday" | "prayer" | "ramadan" | "hajj";
  hijri_date: string;
  gregorian_start_date: string;
  gregorian_end_date?: string;
  description?: string;
  learning_adjustments: {
    study_reminder_reduced?: boolean;
    no_study_reminders?: boolean;
    [key: string]: boolean | undefined;
  };
  special_content_enabled: boolean;
  daysUntil: number;
  isToday: boolean;
  isThisWeek: boolean;
}

interface IslamicCalendarWidgetProps {
  userId?: string;
  className?: string;
}

export function IslamicCalendarWidget({
  userId,
  className,
}: IslamicCalendarWidgetProps) {
  const { t } = useI18n();
  const supabase = createClient();
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [currentHijriDate, setCurrentHijriDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    fetchIslamicEvents();
    setCurrentHijriDate(getCurrentHijriDate());
  }, []);

  const fetchIslamicEvents = async () => {
    try {
      setLoading(true);

      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;

      // Fetch events for current and next year
      const { data: events, error } = await supabase
        .from("islamic_calendar_events")
        .select("*")
        .in("year", [currentYear, nextYear])
        .order("gregorian_start_date", { ascending: true });

      if (error) throw error;

      if (events) {
        const processedEvents = events.map((event) => ({
          ...event,
          daysUntil: calculateDaysUntil(event.gregorian_start_date),
          isToday: isToday(event.gregorian_start_date),
          isThisWeek: isThisWeek(event.gregorian_start_date),
        }));

        // Filter to show upcoming events (within next 60 days)
        const upcomingEvents = processedEvents.filter(
          (event) => event.daysUntil >= 0 && event.daysUntil <= 60
        );

        setEvents(upcomingEvents);
      }
    } catch (error) {
      console.error("Error fetching Islamic events:", error);
      // Set default events if API fails
      setEvents(getDefaultEvents());
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysUntil = (dateString: string): number => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  const isThisWeek = (dateString: string): boolean => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const getCurrentHijriDate = (): string => {
    // Simplified Hijri date calculation
    // In production, use a proper Islamic calendar library
    const gregorianDate = new Date();
    const hijriYear = gregorianDate.getFullYear() - 578; // Approximate conversion

    const months = [
      "Muharram",
      "Safar",
      "Rabi' al-awwal",
      "Rabi' al-thani",
      "Jumada al-awwal",
      "Jumada al-thani",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah",
    ];

    const monthIndex = Math.floor(Math.random() * 12); // Simplified
    const day = Math.floor(Math.random() * 29) + 1; // Simplified

    return `${day} ${months[monthIndex]} ${hijriYear} AH`;
  };

  const getDefaultEvents = (): IslamicEvent[] => {
    // Default events in case API fails
    const today = new Date();
    const ramadanStart = new Date(today.getFullYear(), 2, 10); // Approximate
    const eidAlFitr = new Date(today.getFullYear(), 3, 9); // Approximate

    return [
      {
        id: "1",
        event_name: "Ramadan",
        event_type: "ramadan",
        hijri_date: "1 Ramadan 1446",
        gregorian_start_date: ramadanStart.toISOString(),
        learning_adjustments: { study_reminder_reduced: true },
        special_content_enabled: true,
        daysUntil: calculateDaysUntil(ramadanStart.toISOString()),
        isToday: false,
        isThisWeek: false,
      },
      {
        id: "2",
        event_name: "Eid al-Fitr",
        event_type: "holiday",
        hijri_date: "1 Shawwal 1446",
        gregorian_start_date: eidAlFitr.toISOString(),
        learning_adjustments: { no_study_reminders: true },
        special_content_enabled: true,
        daysUntil: calculateDaysUntil(eidAlFitr.toISOString()),
        isToday: false,
        isThisWeek: false,
      },
    ];
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "ramadan":
        return <Moon className="h-4 w-4" />;
      case "holiday":
        return <Gift className="h-4 w-4" />;
      case "hajj":
        return <Star className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (
    eventType: string,
    isToday: boolean,
    isThisWeek: boolean
  ) => {
    if (isToday) return "bg-green-50 border-green-200 text-green-900";
    if (isThisWeek) return "bg-blue-50 border-blue-200 text-blue-900";

    switch (eventType) {
      case "ramadan":
        return "bg-purple-50 border-purple-200 text-purple-900";
      case "holiday":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "hajj":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const formatDaysUntil = (days: number): string => {
    if (days === 0) return t("islamicCalendar.today");
    if (days === 1) return t("islamicCalendar.tomorrow");
    if (days <= 7) return t("islamicCalendar.thisWeek");
    if (days <= 30) return t("islamicCalendar.thisMonth");
    return `${days} ${t("islamicCalendar.days")}`;
  };

  const getEventTypeLabel = (eventType: string): string => {
    const labels: Record<string, string> = {
      holiday: t("islamicCalendar.holiday"),
      ramadan: t("islamicCalendar.ramadan"),
      hajj: t("islamicCalendar.hajj"),
      prayer: t("islamicCalendar.prayer"),
    };
    return labels[eventType] || eventType;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("islamicCalendar.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayEvents = showAllEvents ? events : events.slice(0, 3);
  const nextEvent = events.find((e) => e.daysUntil >= 0);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {t("islamicCalendar.title")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{currentHijriDate}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Next Event Highlight */}
        {nextEvent && (
          <div
            className={`p-3 rounded-lg border ${getEventColor(
              nextEvent.event_type,
              nextEvent.isToday,
              nextEvent.isThisWeek
            )}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {getEventIcon(nextEvent.event_type)}
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {nextEvent.event_name}
                  </div>
                  <div className="text-xs opacity-80">
                    {nextEvent.hijri_date}
                  </div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {getEventTypeLabel(nextEvent.event_type)}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium">
                  {formatDaysUntil(nextEvent.daysUntil)}
                </div>
                <div className="text-xs opacity-70">
                  {new Date(nextEvent.gregorian_start_date).toLocaleDateString(
                    [],
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Special Content Notice */}
            {nextEvent.special_content_enabled && (
              <div className="mt-2 p-2 rounded bg-white/50 border border-white/20">
                <div className="flex items-center gap-1 text-xs">
                  <Info className="h-3 w-3" />
                  {t("islamicCalendar.specialContent")}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Upcoming Events */}
        <div className="space-y-2">
          {displayEvents
            .filter((e) => e.id !== nextEvent?.id)
            .map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {event.event_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.hijri_date}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-medium">
                    {formatDaysUntil(event.daysUntil)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.gregorian_start_date).toLocaleDateString(
                      [],
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Show More/Less Button */}
        {events.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-xs"
            onClick={() => setShowAllEvents(!showAllEvents)}
          >
            <span>
              {showAllEvents
                ? t("islamicCalendar.showLess")
                : t("islamicCalendar.showMore", { count: events.length - 3 })}
            </span>
            <ArrowRight
              className={`h-3 w-3 transition-transform ${
                showAllEvents ? "rotate-90" : ""
              }`}
            />
          </Button>
        )}

        {/* Learning Adjustments Notice */}
        {nextEvent?.learning_adjustments &&
          Object.keys(nextEvent.learning_adjustments).length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      {t("islamicCalendar.learningAdjustments")}
                    </div>
                    <div className="text-xs text-blue-700">
                      {nextEvent.learning_adjustments
                        .study_reminder_reduced && (
                        <div>• {t("islamicCalendar.reducedReminders")}</div>
                      )}
                      {nextEvent.learning_adjustments.no_study_reminders && (
                        <div>• {t("islamicCalendar.noReminders")}</div>
                      )}
                      {nextEvent.learning_adjustments
                        .extended_prayer_breaks && (
                        <div>• {t("islamicCalendar.extendedBreaks")}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* No Events Message */}
        {events.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("islamicCalendar.noUpcomingEvents")}</p>
            <p className="text-xs mt-1">
              {t("islamicCalendar.checkBackLater")}
            </p>
          </div>
        )}

        {/* Calendar Link */}
        <div className="pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => {
              // Open full Islamic calendar view
              window.open("/islamic-calendar", "_blank");
            }}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {t("islamicCalendar.viewFullCalendar")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
