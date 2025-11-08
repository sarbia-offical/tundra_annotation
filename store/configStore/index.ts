/**
 * ConfigStore 统一导出
 * 全局配置状态管理
 */

export { ConfigStoreProvider, useConfigStore } from "./configStore.context";
export type {
  ConfigStoreAction,
  ConfigStoreContextType,
} from "./configStore.type";
export {
  useConfig,
  useConfigValues,
  useConfigInitialized,
  useStatus,
  useTheme,
  useTranslationTarget,
  useFontDisplay,
  useUnderlineDisplay,
  useSystemRole,
  useUserRole,
  useTranslationServices,
  useSystemLanguage,
  useApiUrl,
  useUpdateConfig,
  useSetStatus,
  useSetTheme,
  useSetTranslationTarget,
  useSetFontDisplay,
  useSetUnderlineDisplay,
  useSetSystemLanguage,
  useSetTranslationServices,
} from "./configStore.hooks";
export { useConfigEffect } from "./useConfigEffect";
