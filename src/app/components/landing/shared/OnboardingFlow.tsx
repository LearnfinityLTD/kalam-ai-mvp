import React from "react";
import {
  UserPlus,
  Shield,
  Play,
  ArrowRight,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function OnboardingFlow() {
  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create account in 30 seconds",
      icon: UserPlus,
      color: "blue" as const,
    },
    {
      number: 2,
      title: "Choose Your Role",
      description: "Select your professional path",
      icon: Shield,
      color: "green" as const,
    },
    {
      number: 3,
      title: "Start Practicing",
      description: "Jump into real scenarios",
      icon: Play,
      color: "purple" as const,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Get Started in Minutes, Not Hours
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-4">
            No complicated setup, no lengthy assessments. Start practicing real
            scenarios immediately.
          </p>
          <div className="flex items-center justify-center text-green-600 font-semibold">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Average setup time: Under 2 minutes</span>
          </div>
        </div>

        {/* Horizontal Steps */}
        <div className="flex items-center justify-center space-x-4 lg:space-x-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const colorClasses = {
              blue: "bg-blue-500 text-white",
              green: "bg-green-500 text-white",
              purple: "bg-purple-500 text-white",
            };

            return (
              <React.Fragment key={index}>
                {/* Step */}
                <div className="flex flex-col items-center text-center">
                  {/* Step Number & Icon */}
                  <div
                    className={`w-14 h-14 ${
                      colorClasses[step.color]
                    } rounded-full flex items-center justify-center mb-3 relative`}
                  >
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm">
                      {step.number}
                    </div>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 max-w-[120px]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:block">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
