"use client";
import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
}

export const Progress = ({
  value = 0,
  max = 100,
  showLabel = false,
  className = "",
  ...props
}: ProgressProps) => {
  const baseStyles = "w-full bg-gray-200 rounded-full overflow-hidden";
  const progressStyles =
    "bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out";
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      <div
        className={progressStyles}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={
          showLabel ? `${Math.round(percentage)}% complete` : undefined
        }
      />
      {showLabel && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};
