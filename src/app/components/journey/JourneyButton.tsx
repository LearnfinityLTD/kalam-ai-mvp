// components/journey/JourneyButton.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { ContinueJourneyModal } from "./ContinueJourneyModal";

interface JourneyButtonProps {
  userId: string;
  userLevel: string;
  className?: string;
  onScenarioStart?: (scenarioId: string) => void;
}

export function JourneyButton({
  userId,
  userLevel,
  className,
  onScenarioStart = () => {},
}: JourneyButtonProps) {
  const { t } = useI18n();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)} className={className}>
        <Play className="w-12 h-12" />
        <span className="font-medium text-base">
          {t("dashboard.continueJourney")}
        </span>
        <span className="text-sm opacity-90">{t("dashboard.pickUpWhere")}</span>
      </Button>

      <ContinueJourneyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={userId}
        userLevel={userLevel}
        onScenarioStart={onScenarioStart}
      />
    </>
  );
}
