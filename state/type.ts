import type { StorageType, Storage, Theme } from "../hooks/useStorage.type";
import { I18n } from "../components/i18Config";
export interface AppInfoOptions {
  defaultEnabled: boolean;
  theme: Theme;
  i18n: I18n;
  storageType: Storage;
  isLoaded: boolean;
}

export interface AppInfoActions {
  changeDefaultEndbaled: (value: boolean, storeInCache: boolean) => void;
  changeTheme: (value: ThemeType, storeInCache: boolean) => void;
  changeI18n: (value: I18n, storeInCache: boolean) => void;
  loadAppInfo: (storageType: StorageType) => Promise<void>;
}

export type AppInfoState = AppInfoOptions & AppInfoActions;
