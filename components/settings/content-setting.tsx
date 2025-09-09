import { Card } from "../ui/card";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessageType } from "@/entrypoints/type";
import { useAppInconContext } from "@/state/hooks";
import { AppInfoState } from "@/state/type";

export function ContentSetting() {
  const { t } = useTranslation();
  const defaultEnabled = useAppInconContext(
    (state: AppInfoState) => state.defaultEnabled
  );
  const changeDefaultEndbaled = useAppInconContext(
    (state: AppInfoState) => state.changeDefaultEndbaled
  );
  const checkedChange = async (value: boolean) => {
    changeDefaultEndbaled(value, true);
    await browser.runtime.sendMessage({
      messageType: MessageType.changeDefaultEnabled,
      content: value,
    });
  };
  return (
    <Card>
      <div className="space-y-1.5 p-6 h-full flex flex-col justify-between">
        <h3 className="font-thin text-left text-base">{t("defaultEnabled")}</h3>
        <div className="flex justify-between items-center pt-2">
          <Switch
            id="airplane-mode"
            checked={defaultEnabled}
            onCheckedChange={checkedChange}
          />
          <Label htmlFor="airplane-mode" className="font-thin">
            {t(defaultEnabled ? "ON" : "OFF")}
          </Label>
        </div>
      </div>
    </Card>
  );
}
