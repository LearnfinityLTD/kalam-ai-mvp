import React from "react";
import { FileUp, Search, Award, ArrowRight, Clock } from "lucide-react";

export default function OnboardingFlow() {
  const steps = [
    {
      number: 1,
      title: "Submit Your Course",
      description: "Upload course materials & details",
      icon: FileUp,
      color: "blue" as const,
    },
    {
      number: 2,
      title: "Expert Review",
      description: "PhD-level evaluation & scoring",
      icon: Search,
      color: "indigo" as const,
    },
    {
      number: 3,
      title: "Get Verified",
      description: "Receive VerifyScore & badge",
      icon: Award,
      color: "purple" as const,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            How Course Verification Works
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-4">
            Simple 3-step process to get your independent quality rating and
            boost your course credibility with learners.
          </p>
          <div className="flex items-center justify-center text-blue-600 font-semibold">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Standard turnaround: 48-72 hours</span>
          </div>
        </div>

        {/* Horizontal Steps */}
        <div className="flex items-center justify-center space-x-4 lg:space-x-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const colorClasses = {
              blue: "bg-blue-500 text-white",
              indigo: "bg-indigo-500 text-white",
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
                  <p className="text-sm text-gray-600 max-w-[140px]">
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

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            One free re-verification included after improvements
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              Get Verified - £299
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition">
              View Sample Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
