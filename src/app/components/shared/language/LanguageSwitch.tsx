// components/shared/LanguageSwitch.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitch() {
  const { locale, setLocale } = useI18n();

  const handleToggle = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-2"
    >
      <Globe className="w-4 h-4" />
      {locale === "en" ? "العربية" : "English"}
    </Button>
  );
}
