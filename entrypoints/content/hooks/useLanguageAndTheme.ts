import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDisplaySettings } from "@/store/store.hooks";

export const useLanguageAndTheme = () => {
  const { i18n } = useTranslation();
  const { defaultConfiguration } = useDisplaySettings();
  const { theme, systemLanguage } = defaultConfiguration;

  // 监听系统语言的变化
  useEffect(() => {
    const callback = async () => {
      await i18n.changeLanguage(systemLanguage);
    };
    callback();
  }, [systemLanguage, i18n]);

  // 监听主题变化
  useEffect(() => {
    const shadowRoot =
      typeof window !== "undefined"
        ? document.querySelector("tundra-annotation")?.shadowRoot
        : null;
    const html = shadowRoot?.querySelector("html");
    if (html) {
      html.classList.remove("light");
      html.classList.remove("dark");
      html.classList.add(theme);
    }
  }, [theme]);

  return { theme, systemLanguage };
};
