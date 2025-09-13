"use client";

import { FAQ } from "@/app/components/landing/shared/FAQ";
import { Button } from "@/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HelpCenterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen ">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  كلام
                </div>
                <span className="text-xl font-bold text-gray-900">KalamAI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Help Center Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">
            Find answers to frequently asked questions
          </p>
        </div>

        <FAQ />

        {/* Feedback Section */}
        <div className="mt-16 text-center p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Still unsure about something?
          </h2>
          <Button
            onClick={() => router.push("/guards/help-center/feedback")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium"
          >
            SEND FEEDBACK
          </Button>
        </div>
      </div>
    </div>
  );
}
