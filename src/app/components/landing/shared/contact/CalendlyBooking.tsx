// calendly
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";
import { UserType, BaseProps } from "./index";

// Calendly Integration Component
export const CalendlyBooking: React.FC<BaseProps> = ({
  userType = "general",
  source = "website",
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getCalendlyUrl = (type: UserType) => {
    const baseUrl = process.env.NEXT_PUBLIC_CALENDLY_BASE_URL;
    const urls: Record<UserType, string> = {
      guard: `${baseUrl}/mosque-demo?utm_source=${source}&utm_medium=website&utm_campaign=mosque_guards`,
      professional: `${baseUrl}/business-demo?utm_source=${source}&utm_medium=website&utm_campaign=business_pro`,
      enterprise: `${baseUrl}/enterprise-demo?utm_source=${source}&utm_medium=website&utm_campaign=enterprise`,
      general: `${baseUrl}/general-demo?utm_source=${source}&utm_medium=website&utm_campaign=general`,
      guide: `${baseUrl}/tour-guide-demo?utm_source=${source}&utm_medium=website&utm_campaign=tour_guides`,
    };
    return urls[type] ?? urls.general;
  };

  type DemoDetail = {
    title: string;
    duration: string;
    description: string;
    features: string[];
  };

  const getDemoDetails = (type: UserType): DemoDetail => {
    const details: Record<UserType, DemoDetail> = {
      guard: {
        title: "Mosque Guard Demo",
        duration: "20 minutes",
        description: "See how guards can welcome tourists with confidence",
        features: [
          "Tourist interaction scenarios",
          "Cultural etiquette training",
          "Prayer-time integration",
        ],
      },
      professional: {
        title: "Business Professional Demo",
        duration: "30 minutes",
        description: "Discover business English for Arabic speakers",
        features: [
          "Meeting scenarios",
          "Presentation skills",
          "Industry vocabulary",
        ],
      },
      enterprise: {
        title: "Enterprise Solution Demo",
        duration: "45 minutes",
        description: "Custom solutions for large organizations",
        features: ["Team management", "Analytics dashboard", "Custom content"],
      },
      general: {
        title: "KalamAI Overview Demo",
        duration: "25 minutes",
        description: "Complete walkthrough of our platform",
        features: ["All user types", "Key features", "Pricing options"],
      },
      guide: {
        title: "Tour Guide Demo",
        duration: "20 minutes",
        description: "Train for tourist-facing English with cultural tips",
        features: [
          "Common tourist Q&A",
          "Itinerary vocabulary",
          "Do's and don'ts",
        ],
      },
    };
    return details[type] ?? details.general;
  };

  const handleCalendlyClick = () => {
    setIsLoading(true);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calendly_click", {
        event_category: "contact",
        event_label: userType,
        custom_map: { custom_parameter_1: source },
      });
    }

    const calendlyUrl = getCalendlyUrl(userType);
    window.open(calendlyUrl, "_blank");

    setTimeout(() => setIsLoading(false), 1000);
  };

  const demoDetails = getDemoDetails(userType);

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              {demoDetails.title}
            </h3>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{demoDetails.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>1-on-1 session</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              {demoDetails.description}
            </p>

            <div className="space-y-2 mb-4">
              {demoDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleCalendlyClick}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Opening Calendar...
                </div>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Free Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Available times in your timezone
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
