// ContactSection.tsx using whatsapp / calendly
"use client";
import React, { useState } from "react";
import { Globe } from "lucide-react";
import { UserType } from "./index";
import { CalendlyBooking } from "./CalendlyBooking";
import { WhatsAppContact } from "./WhatsAppContact";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Combined Contact Section Component
interface ContactSectionProps {
  userType?: UserType;
  showBoth?: boolean;
  title?: string;
  subtitle?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  userType = "general",
  showBoth = true,
  title = "Get Started Today",
  subtitle = "Choose your preferred way to connect with our team",
}) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        <div
          className={`grid gap-6 ${
            showBoth ? "md:grid-cols-2" : "max-w-md mx-auto"
          }`}
        >
          {showBoth && (
            <WhatsAppContact userType={userType} source="contact_section" />
          )}
          <CalendlyBooking userType={userType} source="contact_section" />
        </div>

        {/* Regional Support Info */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
            <Globe className="w-4 h-4" />
            <span className="font-medium">Regional Support Coverage</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>🇦🇪 UAE</span>
            <span>🇸🇦 Saudi Arabia</span>
            <span>🇪🇬 Egypt</span>
            <span>🇯🇴 Jordan</span>
            <span>🇰🇼 Kuwait</span>
            <span>🇶🇦 Qatar</span>
          </div>
        </div>
      </div>
    </section>
  );
};
