"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg";
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

  const variantStyles = {
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
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
    lg: "px-6 py-3 text-lg h-12",
  };

  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const selectedVariantStyles = variantStyles[variant] || variantStyles.default;
  const selectedSizeStyles = sizeStyles[size] || sizeStyles.md;

  return (
    <Comp
      className={`${baseStyles} ${selectedVariantStyles} ${selectedSizeStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </Comp>
  );
};
