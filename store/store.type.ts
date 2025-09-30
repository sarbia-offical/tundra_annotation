import { Config } from "@/constant/model";
import React from "react";

export type StoreAction =
  | { type: "SET_THEME"; payload: string }
  | { type: "SET_TRANSLATION_SERVICE"; payload: string }
  | { type: "SET_TRANSLATION_TARGET"; payload: string }
  | { type: "SET_FONT_DISPLAY"; payload: string }
  | { type: "SET_UNDERLINE_DISPLAY"; payload: string }
  | { type: "SET_SYSTEM_LANGUAGE"; payload: string }
  | { type: "SET_STATUS"; payload: string }
  | { type: "UPDATE_CONFIG"; payload: Partial<Config> }
  | { type: "INIT_FROM_STORAGE"; payload: Partial<Config> };

export interface StoreContextType {
  state: Config;
  isInitialized: boolean;
  dispatch: React.Dispatch<StoreAction>;
}
