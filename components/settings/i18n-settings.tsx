import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card.tsx";
import { browser } from "wxt/browser";
import { MessageType } from "@/entrypoints/type";
import languages, { LanguageType } from "@/components/i18Config";
import { useTranslation } from "react-i18next";
import { AppInfoState } from "@/state/type";
import { useAppInconContext } from "@/state/hooks";

export function I18nSettings() {
  const { i18n, t } = useTranslation();
  const language = useAppInconContext((state: AppInfoState) => state.i18n);
  const changeI18n = useAppInconContext(
    (state: AppInfoState) => state.changeI18n
  );
  const valueChange = async (language: LanguageType) => {
    const { locale } = language;
    await i18n.changeLanguage(locale);
    changeI18n(locale, true);
    await browser.runtime.sendMessage({
      messageType: MessageType.changeLocale,
      content: locale,
    });
  };
  return (
    <Card>
      <div className="space-y-1.5 p-6 flex flex-col justify-between">
        <h3 className="text-left text-base font-thin">{t("i18nSettings")}</h3>
      </div>
      <RadioGroup defaultValue={language} value={language} className="p-6 pt-2">
        {languages.map((language, index, array) => {
          return (
            <div
              key={index}
              className="flex items-center space-y-1.5 justify-between"
              onClick={() => {
                valueChange(language);
              }}
            >
              <Label htmlFor={`r${index}`} className="font-thin">
                {language.name}
              </Label>
              <RadioGroupItem value={`${language.locale}`} id={`r${index}`} />
            </div>
          );
        })}
      </RadioGroup>
    </Card>
  );
}
