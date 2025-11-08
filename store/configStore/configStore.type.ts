import { Config } from "@/constant/model";
import React from "react";

/**
 * 配置状态的 Action 类型定义
 */
export type ConfigStoreAction =
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_THEME"; payload: string }
  | { type: "SET_TO"; payload: string }
  | { type: "SET_FONT_DISPLAY"; payload?: string }
  | { type: "SET_UNDERLINE_DISPLAY"; payload: string[] }
  | { type: "SET_SYSTEM_ROLE"; payload: { [key: string]: string } }
  | { type: "SET_USER_ROLE"; payload: { [key: string]: string } }
  | { type: "SET_TRANSLATION_SERVICES"; payload: string }
  | { type: "SET_SYSTEM_LANGUAGE"; payload?: string }
  | { type: "SET_API_URL"; payload?: string }
  | { type: "UPDATE_CONFIG"; payload: Partial<Config> }
  | { type: "INIT_FROM_STORAGE"; payload: Partial<Config> };

/**
 * ConfigStore Context 类型定义
 */
export interface ConfigStoreContextType {
  state: Config;
  isInitialized: boolean;
  dispatch: React.Dispatch<ConfigStoreAction>;
}
