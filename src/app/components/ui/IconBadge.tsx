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

// ---- Reusable SVG props type for your custom icons
type SvgProps = React.SVGProps<SVGSVGElement>;

// Now type each icon with SvgProps so className is string | undefined
export const Eye: React.FC<SvgProps> = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

export const EyeOff: React.FC<SvgProps> = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

export const CheckCircle: React.FC<SvgProps> = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const Shield: React.FC<SvgProps> = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

export const MapPin: React.FC<SvgProps> = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const Briefcase: React.FC<SvgProps> = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
    />
  </svg>
);
