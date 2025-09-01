// components/ui/button.tsx
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type Variant =
  | "default"
  | "outline"
  | "ghost"
  | "destructive"
  | "secondary"
  | "link";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles: Record<Variant, string> = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 active:bg-gray-100",
  ghost:
    "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 active:bg-gray-400",
  link: "text-blue-600 hover:underline px-0 py-0 h-auto",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm h-8",
  md: "px-4 py-2 text-base h-10",
  lg: "px-6 py-3 text-lg h-12",
};

function merge(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Matches shadcn's API shape closely enough for usage in other components */
export function buttonVariants(opts?: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const { variant = "default", size = "md", className = "" } = opts ?? {};
  return merge(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export const Button = ({
  children,
  variant = "default",
  size = "md",
  asChild = false,
  className = "",
  disabled = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={buttonVariants({ variant, size, className })}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
};
