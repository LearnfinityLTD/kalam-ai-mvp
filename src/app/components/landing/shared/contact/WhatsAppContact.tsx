"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";
import { UserType, BaseProps } from "./index";

// WhatsApp Business Integration Component
export const WhatsAppContact: React.FC<BaseProps> = ({
  userType = "general",
  source = "website",
  className = "",
}) => {
  const [isOnline, setIsOnline] = useState(true);

  // MENA business hours (9 AM - 9 PM GST)
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const gstHour = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Dubai" })
      ).getHours();
      setIsOnline(gstHour >= 9 && gstHour <= 21);
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60_000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getWhatsAppMessage = (type: UserType) => {
    const messages: Record<UserType, string> = {
      guard: `السلام عليكم! I'm interested in KalamAI for mosque hosts. Can you help me get started with English training for welcoming tourists?`,
      professional: `Hello! I'd like to learn more about KalamAI's business English program for Arabic speakers. Can we discuss pricing and features?`,
      guide: `Hi! I'm a tour guide interested in KalamAI. When will the tour guide program be available?`,
      enterprise: `Hello! I'm exploring KalamAI for our organization. Could we discuss enterprise options and deployment?`,
      general: `Hello! I'm interested in KalamAI English learning for Arabic speakers. Can you provide more information?`,
    };
    return encodeURIComponent(messages[type] ?? messages.general);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // TODO: replace with your UAE business number
    const message = getWhatsAppMessage(userType);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Track the interaction
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "whatsapp_click", {
        event_category: "contact",
        event_label: userType,
        custom_map: { custom_parameter_1: source },
      });
    }

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            {isOnline && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">WhatsApp Support</h3>
              <Badge
                variant={isOnline ? "default" : "secondary"}
                className={
                  isOnline
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Get instant help in Arabic or English. Response time:{" "}
              {isOnline ? "< 5 minutes" : "Next business day"}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Clock className="w-3 h-3" />
              <span>Available 9 AM - 9 PM GST (GMT+4)</span>
            </div>

            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
