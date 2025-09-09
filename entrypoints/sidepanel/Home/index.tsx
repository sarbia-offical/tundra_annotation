// HomePage.js
import React, { useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4">
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="font-normal leading-none tracking-tight text-base">
            {t("introduce")}
          </h3>
          <p className="text-sm max-w-lg text-balance leading-relaxed">
            {t("homepage")}
          </p>
        </div>
      </Card>
    </div>
  );
}
