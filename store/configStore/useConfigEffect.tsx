import { useEffect } from "react";
import { useConfigValues } from "@/store/configStore";
import { useTranslation } from "react-i18next";

/**
 * 应用主题到 Shadow DOM 或普通 DOM
 */
const applyTheme = (theme: string, isShadowDOM: boolean = false) => {
  if (isShadowDOM) {
    // Shadow DOM 环境（content script）
    const shadowRoot =
      typeof window !== "undefined"
        ? document.querySelector("tundra-annotation")?.shadowRoot
        : null;
    const html = shadowRoot?.querySelector("html");
    if (html) {
      html.classList.remove("light", "dark");
      html.classList.add(theme);
    }
  } else {
    // 普通 DOM 环境（popup）
    const html = document.getElementsByTagName("html");
    if (html.length) {
      html[0].classList.remove("light", "dark");
      html[0].classList.add(theme === "dark" ? "dark" : "light");
    }
  }
};

/**
 * 监听配置变化的 Hook
 * @param isShadowDOM - 是否在 Shadow DOM 环境中
 */
export const useConfigEffect = (isShadowDOM: boolean = false) => {
  const { theme, systemLanguage, fontDisplay, underlineDisplay, to } =
    useConfigValues();

  const { i18n } = useTranslation();

  // 监听主题变化
  useEffect(() => {
    if (theme) {
      applyTheme(theme, isShadowDOM);
    }
  }, [theme, isShadowDOM]);

  // 监听语言变化
  useEffect(() => {
    if (systemLanguage && i18n.language !== systemLanguage) {
      i18n.changeLanguage(systemLanguage);
    }
  }, [systemLanguage, i18n]);

  return { theme, systemLanguage, to, fontDisplay, underlineDisplay };
};
