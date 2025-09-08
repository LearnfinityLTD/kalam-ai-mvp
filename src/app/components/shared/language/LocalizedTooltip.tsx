// components/shared/LocalizedTooltip.tsx
"use client";

import React, { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/context";

interface LocalizedTooltipProps {
  translationKey: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  className?: string;
}

export function LocalizedTooltip({
  translationKey,
  children,
  side = "top",
  align = "center",
  className = "",
}: LocalizedTooltipProps) {
  const { t } = useI18n();

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={`max-w-xs leading-6 ${className}`}
      >
        {t(translationKey)}
      </TooltipContent>
    </Tooltip>
  );
}
