import { defaultOptions, SERVICES } from "./options";

interface Mapping {
  [key: string]: string;
}

// ===== 配置定义 =====
export interface Config {
  status: string;
  theme: string;
  to: string;
  font_display: string;
  underline_display: string;
  system_role: Mapping;
  user_role: Mapping;
  translation_services: string;
  system_language: string;
}

// 工厂函数：生成默认配置
export const createConfig = (): Config => ({
  status: defaultOptions.STATUS,
  theme: defaultOptions.THEME,
  to: defaultOptions.TO,
  font_display: defaultOptions.FONT_DISPLAY,
  underline_display: defaultOptions.UNDERLINE_DISPLAY,
  system_role: contextFactory(defaultOptions.SYSTEM_ROLE),
  user_role: contextFactory(defaultOptions.USER_ROLE),
  translation_services: SERVICES.GOOGLE,
  system_language: defaultOptions.SYSTEM_LANGUAGE,
});

const contextFactory = (str: string): Mapping => {
  let systems_role: Mapping = {};
  Object.values(SERVICES).forEach((key) => {
    systems_role[key] = str;
  });
  return systems_role;
};
