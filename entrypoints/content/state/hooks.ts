import { useContext } from "react";
import { MarkState } from "./type";
import { MarkContext } from "./constant";
import { useStore } from "zustand";
import { useShallow } from "zustand/shallow";
import { isNil } from "lodash";
export const useMarkContext = <T>(selector: (state: MarkState) => T) => {
  const store = useContext(MarkContext);
  if (isNil(store)) {
    throw new Error("Missing MarkContext.Provider in the tree");
  }
  return useStore(store, useShallow(selector));
};
