import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card.tsx";
import { browser } from "wxt/browser";
import { MessageType } from "@/entrypoints/type";
import { useTranslation } from "react-i18next";
import { useAppInconContext } from "@/state/hooks";
import { AppInfoState } from "@/state/type";
import { Theme, themeList } from "@/hooks/useStorage.type";

export function ThemeSettings() {
  const { t } = useTranslation();
  const theme = useAppInconContext((state: AppInfoState) => state.theme);
  const changeTheme = useAppInconContext(
    (state: AppInfoState) => state.changeTheme
  );
  const bundleChangeTheme = async (value: Theme) => {
    changeTheme(value, true);
    await browser.runtime.sendMessage({
      messageType: MessageType.changeTheme,
      content: value,
    });
  };
  return (
    <Card>
      <div className="space-y-1.5 p-6">
        <h3 className="font-thin text-left text-base">{t("themeSettings")}</h3>
      </div>
      <RadioGroup defaultValue={theme} value={theme} className="p-6 pt-2">
        {themeList &&
          themeList.map((item, index) => {
            return (
              <div
                key={index}
                className="flex items-center space-y-1.5 justify-between"
                onClick={() => {
                  bundleChangeTheme(item);
                }}
              >
                <Label htmlFor={`r${index}`} className="font-thin">
                  {t(item)}
                </Label>
                <RadioGroupItem value={item} id={`r${index}`} />
              </div>
            );
          })}
      </RadioGroup>
    </Card>
  );
}
