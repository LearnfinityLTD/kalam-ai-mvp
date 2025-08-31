"use client";
import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ children, className = "", ...props }: CardProps) => {
  const baseStyles =
    "bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden";
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

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

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

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

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

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
