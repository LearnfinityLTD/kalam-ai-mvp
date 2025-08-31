// IconBadge.tsx
import * as React from "react";
import type { LucideIcon } from "lucide-react";

export type Palette = "blue" | "green" | "yellow" | "purple" | "red";

const PALETTE: Record<Palette, { fg: string; bg: string }> = {
  blue: { fg: "text-blue-600", bg: "bg-blue-100" },
  green: { fg: "text-green-600", bg: "bg-green-100" },
  yellow: { fg: "text-yellow-600", bg: "bg-yellow-100" },
  purple: { fg: "text-purple-600", bg: "bg-purple-100" },
  red: { fg: "text-red-600", bg: "bg-red-100" },
};

type IconBadgeProps = {
  icon: LucideIcon;
  color?: Palette;
  size?: number; // icon size in px (not the badge)
  className?: string;
};

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon: Icon,
  color = "blue",
  size = 20,
  className = "",
}) => {
  const { fg, bg } = PALETTE[color];
  const badgeSize = size + 12; // a little padding around the icon
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${bg} ${className}`}
      style={{ width: badgeSize, height: badgeSize }}
    >
      <Icon className={fg} width={size} height={size} />
    </span>
  );
};
