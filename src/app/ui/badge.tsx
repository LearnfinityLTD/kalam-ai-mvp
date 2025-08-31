"use client";
import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning";
}

export const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}: BadgeProps) => {
  const variantStyles = {
    default: "bg-blue-100 text-blue-800 border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    destructive: "bg-red-100 text-red-800 border-red-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors";

  return (
    <div
      className={`${baseStyles} ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
