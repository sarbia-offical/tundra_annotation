import { useContext } from "react";
import { AppInfoState } from "./type";
import { AppInfoContext } from "./constant";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { isNil } from "lodash";

export const useAppInconContext = <T>(selector: (state: AppInfoState) => T) => {
  const store = useContext(AppInfoContext);
  if (isNil(store)) {
    throw new Error("Missing AppInfoContext.Provider in the tree");
  }
  return useStore(store, useShallow(selector));
};
