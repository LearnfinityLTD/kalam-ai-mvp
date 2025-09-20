// app/islamic-calendar/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  Moon,
  Gift,
  Info,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

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
  year: number;
}

interface CalendarDay {
  date: Date;
  hijriDate: string;
  events: IslamicEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export default function IslamicCalendarPage() {
  const supabase = createClient();
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIslamicEvents();
  }, [currentDate]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, events]);

  const fetchIslamicEvents = async () => {
    try {
      setLoading(true);

      const year = currentDate.getFullYear();
      const nextYear = year + 1;
      const prevYear = year - 1;

      const { data: eventsData, error } = await supabase
        .from("islamic_calendar_events")
        .select("*")
        .in("year", [prevYear, year, nextYear])
        .order("gregorian_start_date", { ascending: true });

      if (error) throw error;

      setEvents(eventsData || []);
    } catch (error) {
      console.error("Error fetching Islamic events:", error);
      setEvents(getDefaultEvents());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultEvents = (): IslamicEvent[] => {
    return [
      {
        id: "1",
        event_name: "Ramadan Begins",
        event_type: "ramadan",
        hijri_date: "1 Ramadan 1446",
        gregorian_start_date: "2025-03-01",
        learning_adjustments: { study_reminder_reduced: true },
        special_content_enabled: true,
        year: 2025,
      },
      {
        id: "2",
        event_name: "Eid al-Fitr",
        event_type: "holiday",
        hijri_date: "1 Shawwal 1446",
        gregorian_start_date: "2025-03-31",
        learning_adjustments: { no_study_reminders: true },
        special_content_enabled: true,
        year: 2025,
      },
      {
        id: "3",
        event_name: "Eid al-Adha",
        event_type: "holiday",
        hijri_date: "10 Dhu al-Hijjah 1446",
        gregorian_start_date: "2025-06-07",
        learning_adjustments: { no_study_reminders: true },
        special_content_enabled: true,
        year: 2025,
      },
    ];
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of the month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      days.push({
        date,
        hijriDate: convertToHijri(date),
        events: getEventsForDate(date),
        isToday: isSameDay(date, today),
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        hijriDate: convertToHijri(date),
        events: getEventsForDate(date),
        isToday: isSameDay(date, today),
        isCurrentMonth: true,
      });
    }

    // Add days from next month to complete the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      const date = new Date(year, month + 1, nextMonthDay);
      days.push({
        date,
        hijriDate: convertToHijri(date),
        events: getEventsForDate(date),
        isToday: isSameDay(date, today),
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    setCalendarDays(days);
  };

  const convertToHijri = (gregorianDate: Date): string => {
    // Simplified Hijri conversion (you might want to use a proper Islamic calendar library)
    const hijriYear = gregorianDate.getFullYear() - 578;
    const day = Math.floor(Math.random() * 29) + 1;
    return `${day} Hijri ${hijriYear}`;
  };

  const getEventsForDate = (date: Date): IslamicEvent[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.gregorian_start_date);
      return isSameDay(date, eventDate);
    });
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
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

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "ramadan":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "holiday":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "hajj":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.close()}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Islamic Calendar
                </h1>
                <p className="text-sm text-gray-600">
                  View Islamic events and important dates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${day.isCurrentMonth ? "bg-white" : "bg-gray-50"}
                        ${day.isToday ? "ring-2 ring-blue-500" : ""}
                        ${
                          selectedDate && isSameDay(day.date, selectedDate)
                            ? "bg-blue-50"
                            : ""
                        }
                        hover:bg-gray-50
                      `}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div
                        className={`text-sm ${
                          day.isCurrentMonth ? "text-gray-900" : "text-gray-400"
                        } mb-1`}
                      >
                        {day.date.getDate()}
                      </div>

                      {/* Events */}
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded border ${getEventColor(
                              event.event_type
                            )}`}
                          >
                            <div className="flex items-center gap-1">
                              {getEventIcon(event.event_type)}
                              <span className="truncate">
                                {event.event_name}
                              </span>
                            </div>
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events
                    .filter(
                      (event) =>
                        new Date(event.gregorian_start_date) >= new Date()
                    )
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                      >
                        <div className="text-lg">
                          {getEventIcon(event.event_type)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {event.event_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.hijri_date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(
                              event.gregorian_start_date
                            ).toLocaleDateString()}
                          </div>
                          {event.special_content_enabled && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Special Content
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate.toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const dayEvents = getEventsForDate(selectedDate);
                    if (dayEvents.length === 0) {
                      return (
                        <p className="text-sm text-gray-500">
                          No events on this date
                        </p>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        {dayEvents.map((event) => (
                          <div key={event.id} className="p-3 rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                              {getEventIcon(event.event_type)}
                              <span className="font-medium">
                                {event.event_name}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {event.hijri_date}
                            </div>
                            {event.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {event.description}
                              </p>
                            )}
                            {event.learning_adjustments &&
                              Object.keys(event.learning_adjustments).length >
                                0 && (
                                <div className="mt-2 p-2 bg-blue-50 rounded border">
                                  <div className="flex items-center gap-1 text-sm text-blue-800 mb-1">
                                    <Info className="h-3 w-3" />
                                    Learning Adjustments
                                  </div>
                                  <div className="text-xs text-blue-700">
                                    {event.learning_adjustments
                                      .study_reminder_reduced && (
                                      <div>• Reduced study reminders</div>
                                    )}
                                    {event.learning_adjustments
                                      .no_study_reminders && (
                                      <div>• No study reminders</div>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                    <span className="text-sm">Ramadan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                    <span className="text-sm">Holiday</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span className="text-sm">Hajj</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                    <span className="text-sm">Other</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
