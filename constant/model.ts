import { defaultOptions, SERVICES } from "./options";

interface Mapping {
  [key: string]: string;
}

// ===== 配置定义 =====
export interface Config {
  status: string;
  theme: string;
  to: string;
  fontDisplay: string;
  underlineDisplay: string;
  systemRole: Mapping;
  userRole: Mapping;
  translationServices: string;
  systemLanguage: string;
}

// 工厂函数：生成默认配置
export const createConfig = (): Config => ({
  status: defaultOptions.STATUS,
  theme: defaultOptions.THEME,
  to: defaultOptions.TO,
  fontDisplay: defaultOptions.FONT_DISPLAY,
  underlineDisplay: defaultOptions.UNDERLINE_DISPLAY,
  systemRole: contextFactory(defaultOptions.SYSTEM_ROLE),
  userRole: contextFactory(defaultOptions.USER_ROLE),
  translationServices: SERVICES.GOOGLE,
  systemLanguage: defaultOptions.SYSTEM_LANGUAGE,
});

const contextFactory = (str: string): Mapping => {
  let systems_role: Mapping = {};
  Object.values(SERVICES).forEach((key) => {
    systems_role[key] = str;
  });
  return systems_role;
};
