import type { DeepPartial } from "utility-types";
import { createStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { AppInfoOptions, AppInfoState } from "./type";
import { deepMerge } from "@/lib/Utils";
import {
  StorageType,
  Storage,
  Theme,
  ThemeType,
} from "../hooks/useStorage.type";
import { I18n } from "../components/i18Config";

export const createAppStore = (options: DeepPartial<AppInfoOptions>) => {
  return createStore<AppInfoState>()(
    subscribeWithSelector(
      immer((set) => ({
        ...deepMerge<AppInfoOptions, DeepPartial<AppInfoOptions>>(
          {
            defaultEnabled: true,
            theme: Theme.LIGHT,
            i18n: I18n.EN,
            storageType: Storage.LOCAL,
            isLoaded: false,
          },
          options,
          "merge"
        ),
        changeDefaultEndbaled(value: boolean, storeInCache: boolean = true) {
          set((state: AppInfoState) => {
            state.defaultEnabled = value;
            if (storeInCache) {
              browser.storage[state.storageType].set({ defaultEnabled: value });
            }
          });
        },
        changeTheme(value: ThemeType, storeInCache: boolean = true) {
          set((state: AppInfoState) => {
            state.theme = value;
            if (storeInCache) {
              browser.storage[state.storageType].set({ theme: value });
            }
          });
        },
        changeI18n(value: I18n, storeInCache: boolean = true) {
          set((state: AppInfoState) => {
            state.i18n = value;
            if (storeInCache) {
              browser.storage[state.storageType].set({ i18n: value });
            }
          });
        },
        loadAppInfo: async (storageType: StorageType) => {
          set({ storageType: storageType });
          const { defaultEnabled } = await browser.storage[storageType].get(
            "defaultEnabled"
          );
          const { i18n } = await browser.storage[storageType].get("i18n");
          const { theme } = await browser.storage[storageType].get("theme");
          set({
            defaultEnabled: defaultEnabled || true,
            theme: theme || Theme.LIGHT,
            i18n: i18n || I18n.EN,
            isLoaded: true,
          });
        },
      }))
    )
  );
};

export type AppStoreType = ReturnType<typeof createAppStore>;
