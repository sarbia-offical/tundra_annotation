import { defaultOptions, SERVICES } from "./options";

interface Mapping {
  [key: string]: string;
}

// ===== 配置定义 =====
export interface Config {
  status: string; // 插件状态
  theme: string; // 主题
  to: string; // 翻译目标语言
  fontDisplay?: string; // 字体展示风格
  underlineDisplay?: string; // 下划线展示风格 (改为单选)
  systemRole: Mapping; // 系统角色
  userRole: Mapping; // 用户角色
  translationServices: string; // 翻译服务
  systemLanguage?: string; // 系统语言
  apiUrl?: string; // 自定义API地址
}

export const apiUrl = "http://localhost:3001";

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
  apiUrl,
});

const contextFactory = (str: string): Mapping => {
  let systems_role: Mapping = {};
  Object.values(SERVICES).forEach((key) => {
    systems_role[key] = str;
  });
  return systems_role;
};
