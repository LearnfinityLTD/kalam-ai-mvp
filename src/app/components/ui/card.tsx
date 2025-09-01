"use client";
import * as React from "react";

type CardProps = React.ComponentPropsWithoutRef<"div">;
export const Card = ({ children, className = "", ...props }: CardProps) => {
  const baseStyles =
    "bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden";
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

type CardHeaderProps = React.ComponentPropsWithoutRef<"div">;
export const CardHeader = ({
  children,
  className = "",
  ...props
}: CardHeaderProps) => {
  const baseStyles = "p-4 border-b border-gray-200 bg-gray-50/50";
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

type CardTitleProps = React.ComponentPropsWithoutRef<"h3">;
export const CardTitle = ({
  children,
  className = "",
  ...props
}: CardTitleProps) => {
  const baseStyles = "text-lg font-semibold text-gray-900 leading-tight";
  return (
    <h3 className={`${baseStyles} ${className}`} {...props}>
      {children}
    </h3>
  );
};

type CardContentProps = React.ComponentPropsWithoutRef<"div">;
export const CardContent = ({
  children,
  className = "",
  ...props
}: CardContentProps) => {
  const baseStyles = "p-4";
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
