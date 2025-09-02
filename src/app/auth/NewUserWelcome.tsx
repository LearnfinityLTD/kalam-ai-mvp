// components/auth/NewUserWelcome.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  BookOpen,
  ArrowRight,
  Target,
  Clock,
} from "lucide-react";

interface NewUserWelcomeProps {
  email: string;
  onStartAssessment: () => void;
}

export default function NewUserWelcome({
  email,
  onStartAssessment,
}: NewUserWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const welcomeSteps = [
    {
      icon: Building,
      title: "Welcome to Mosque Guard Training",
      description:
        "You've joined a community dedicated to excellent visitor service and communication at our sacred spaces.",
      action: "Continue",
      color: "text-green-600",
    },
    {
      icon: Users,
      title: "Your Important Role",
      description:
        "As a mosque guard, you'll be the first point of contact for visitors, helping them feel welcome while maintaining the sacred atmosphere.",
      action: "I understand",
      color: "text-blue-600",
    },
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description:
        "We'll customize your training based on your current English level, ensuring you feel confident in every interaction.",
      action: "Start Assessment",
      color: "text-purple-600",
    },
  ];

  const currentStepData = welcomeSteps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartAssessment();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div
            className={`mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center`}
          >
            <IconComponent className={`w-10 h-10 ${currentStepData.color}`} />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="mb-2">
              Step {currentStep + 1} of {welcomeSteps.length}
            </Badge>
            <CardTitle className="text-2xl font-bold">
              {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            {welcomeSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm font-medium">
                Signed in as: {email}
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Visitor Assistance</h3>
                <p className="text-xs text-gray-600">
                  Guide and support visitors
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Cultural Bridge</h3>
                <p className="text-xs text-gray-600">
                  Connect communities respectfully
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">
                    Quick Assessment
                  </span>
                </div>
                <p className="text-yellow-700 text-sm">
                  • 5 questions (5-8 minutes) • Multiple choice + audio
                  scenarios • Immediate results and personalized plan
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-bold text-lg text-green-600">A1-A2</div>
                  <div className="text-xs text-gray-600">Beginner</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-bold text-lg text-blue-600">B1-B2</div>
                  <div className="text-xs text-gray-600">Intermediate</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="font-bold text-lg text-purple-600">C1</div>
                  <div className="text-xs text-gray-600">Advanced</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
              )}
            </div>

            <Button onClick={handleNext} className="px-8 py-3" size="lg">
              {currentStepData.action}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Footer message */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              This assessment helps us create the perfect learning experience
              for your needs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
