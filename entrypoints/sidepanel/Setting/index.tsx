import React from "react";
import { ThemeSettings } from "@/components/settings/theme.setting";
import { I18nSettings } from "@/components/settings/i18n-settings.tsx";
import { ContentSetting } from "@/components/settings/content-setting";

export function SettingsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <I18nSettings />
      <ThemeSettings />
      <ContentSetting />
    </div>
  );
}
