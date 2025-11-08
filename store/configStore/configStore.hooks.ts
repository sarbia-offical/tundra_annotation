import { useMemo } from "react";
import { useConfigStore } from "./configStore.context";
import { Config } from "@/constant/model";

/**
 * 获取配置状态
 */
export const useConfig = (): Config => {
  const { state } = useConfigStore();
  return state;
};

/**
 * 获取所有配置值（优化性能，避免多次调用 useConfigStore）
 * 返回 state 的所有字段，使用 useMemo 优化
 */
export const useConfigValues = () => {
  const { state } = useConfigStore();

  return useMemo(
    () => ({
      status: state.status,
      theme: state.theme,
      to: state.to,
      fontDisplay: state.fontDisplay,
      underlineDisplay: state.underlineDisplay,
      systemRole: state.systemRole,
      userRole: state.userRole,
      translationServices: state.translationServices,
      systemLanguage: state.systemLanguage,
      apiUrl: state.apiUrl,
    }),
    [
      state.status,
      state.theme,
      state.to,
      state.fontDisplay,
      state.underlineDisplay,
      state.systemRole,
      state.userRole,
      state.translationServices,
      state.systemLanguage,
      state.apiUrl,
    ]
  );
};

/**
 * 获取初始化状态
 */
export const useConfigInitialized = (): boolean => {
  const { isInitialized } = useConfigStore();
  return isInitialized;
};

/**
 * 获取插件状态
 */
export const useStatus = (): string => {
  const { status } = useConfigValues();
  return status;
};

/**
 * 获取主题
 */
export const useTheme = (): string => {
  const { theme } = useConfigValues();
  return theme;
};

/**
 * 获取翻译目标语言
 */
export const useTranslationTarget = (): string => {
  const { to } = useConfigValues();
  return to;
};

/**
 * 获取字体展示风格
 */
export const useFontDisplay = (): string | undefined => {
  const { fontDisplay } = useConfigValues();
  return fontDisplay;
};

/**
 * 获取下划线展示风格
 */
export const useUnderlineDisplay = (): string[] | undefined => {
  const { underlineDisplay } = useConfigValues();
  return underlineDisplay;
};

/**
 * 获取系统角色
 */
export const useSystemRole = (): { [key: string]: string } => {
  const { systemRole } = useConfigValues();
  return systemRole;
};

/**
 * 获取用户角色
 */
export const useUserRole = (): { [key: string]: string } => {
  const { userRole } = useConfigValues();
  return userRole;
};

/**
 * 获取翻译服务
 */
export const useTranslationServices = (): string => {
  const { translationServices } = useConfigValues();
  return translationServices;
};

/**
 * 获取系统语言
 */
export const useSystemLanguage = (): string | undefined => {
  const { systemLanguage } = useConfigValues();
  return systemLanguage;
};

/**
 * 获取 API URL
 */
export const useApiUrl = (): string | undefined => {
  const { apiUrl } = useConfigValues();
  return apiUrl;
};

/**
 * 更新配置（会自动保存到 storage）
 */
export const useUpdateConfig = () => {
  const { dispatch } = useConfigStore();

  return (config: Partial<Config>) => {
    dispatch({
      type: "UPDATE_CONFIG",
      payload: config,
    });
  };
};

/**
 * 设置插件状态
 */
export const useSetStatus = () => {
  const { dispatch } = useConfigStore();

  return (status: string) => {
    dispatch({
      type: "SET_STATUS",
      payload: status,
    });
  };
};

/**
 * 设置主题
 */
export const useSetTheme = () => {
  const { dispatch } = useConfigStore();

  return (theme: string) => {
    dispatch({
      type: "SET_THEME",
      payload: theme,
    });
  };
};

/**
 * 设置翻译目标语言
 */
export const useSetTranslationTarget = () => {
  const { dispatch } = useConfigStore();

  return (to: string) => {
    dispatch({
      type: "SET_TO",
      payload: to,
    });
  };
};

/**
 * 设置字体展示风格
 */
export const useSetFontDisplay = () => {
  const { dispatch } = useConfigStore();

  return (fontDisplay?: string) => {
    dispatch({
      type: "SET_FONT_DISPLAY",
      payload: fontDisplay,
    });
  };
};

/**
 * 设置下划线展示风格
 */
export const useSetUnderlineDisplay = () => {
  const { dispatch } = useConfigStore();

  return (underlineDisplay: string[]) => {
    dispatch({
      type: "SET_UNDERLINE_DISPLAY",
      payload: underlineDisplay,
    });
  };
};

/**
 * 设置系统语言
 */
export const useSetSystemLanguage = () => {
  const { dispatch } = useConfigStore();

  return (systemLanguage?: string) => {
    dispatch({
      type: "SET_SYSTEM_LANGUAGE",
      payload: systemLanguage,
    });
  };
};

/**
 * 设置翻译服务
 */
export const useSetTranslationServices = () => {
  const { dispatch } = useConfigStore();

  return (service: string) => {
    dispatch({
      type: "SET_TRANSLATION_SERVICES",
      payload: service,
    });
  };
};
