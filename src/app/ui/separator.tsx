import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className = "",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      className={
        orientation === "horizontal"
          ? `h-px w-full bg-gray-200 ${className}`
          : `h-full w-px bg-gray-200 ${className}`
      }
      {...props}
    />
  );
}
