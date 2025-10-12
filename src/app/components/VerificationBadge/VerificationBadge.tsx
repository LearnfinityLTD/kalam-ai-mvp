"use client";
import React from "react";
import Image from "next/image";

type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

export function VerificationBadge({
  score,
  grade,
  size = "md",
}: {
  score: number;
  grade: Grade;
  size?: "sm" | "md" | "lg";
}) {
  const badgeColor: Record<Grade, string> = {
    "A+": "bg-emerald-500",
    A: "bg-green-500",
    B: "bg-blue-500",
    C: "bg-yellow-500",
    D: "bg-orange-500",
    F: "bg-red-500",
  };

  const sizeClasses = {
    sm: {
      container: "p-2 gap-2",
      text: "text-xl",
      gradeText: "text-xs",
      label: "text-xs",
      image: "w-10 h-10",
    },
    md: {
      container: "p-4 gap-3",
      text: "text-2xl",
      gradeText: "text-sm",
      label: "text-xs",
      image: "w-16 h-16",
    },
    lg: {
      container: "p-6 gap-4",
      text: "text-4xl",
      gradeText: "text-base",
      label: "text-sm",
      image: "w-20 h-20",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={`${badgeColor[grade]} text-white rounded-lg flex items-center ${sizes.container}`}
    >
      <div className="flex flex-col">
        <span className={`${sizes.label} font-semibold`}>VERIFIED</span>
        <span className={`${sizes.text} font-bold`}>{score}/100</span>
        <span className={sizes.gradeText}>Grade: {grade}</span>
      </div>
      <div className={`relative ${sizes.image}`}>
        <Image
          src="/shield.png"
          alt="Verify Learn Shield"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
