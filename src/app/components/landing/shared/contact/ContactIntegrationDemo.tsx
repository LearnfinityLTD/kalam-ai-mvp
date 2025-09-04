// calendly
"use client";
import React, { useState } from "react";
import { UserType } from "./index";
import { WhatsAppContact } from "./WhatsAppContact";
import { CalendlyBooking } from "./CalendlyBooking";
import { ContactSection } from "./ContactSection";
// ContactIntegrationDemo
export const ContactIntegrationDemo: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>("guard");

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Integration Demo</h1>

        {/* User Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select User Type:
          </label>
          <select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value as UserType)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="guard">Mosque Guard</option>
            <option value="guide">Tour Guide</option>
            <option value="professional">Business Professional</option>
            <option value="enterprise">Enterprise</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* Individual Components */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              WhatsApp Contact (Individual)
            </h3>
            <WhatsAppContact userType={selectedUserType} source="demo" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Calendly Booking (Individual)
            </h3>
            <CalendlyBooking userType={selectedUserType} source="demo" />
          </div>
        </div>
      </div>

      {/* Combined Section */}
      <ContactSection
        userType={selectedUserType}
        showBoth={true}
        title="Combined Contact Section"
        subtitle="This is how it would appear on your landing page"
      />
    </div>
  );
};
