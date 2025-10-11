import React, { createContext } from "react";
import {
  initialMarkStoreState,
  MarkStoreAction,
  MarkStoreContextType,
  MarkStoreType,
} from "./store.type";
import { produce } from "immer";

interface MarkStoreProviderProps {
  children: React.ReactNode;
  initialConfig?: MarkStoreType;
}

const MarkStoreContext = createContext<MarkStoreContextType | null>(null);

const MarkStoreReducer = produce(
  (draft: MarkStoreType, action: MarkStoreAction) => {
    switch (action.type) {
      case "SET_POPOVER_POSITION":
        draft.popoverPosition = action.payload;
        break;
      case "POPOVER_VISIBLE":
        draft.popoverVisible = action.payload;
        break;
      case "SHOW_POPOVER_AT_POSITION":
        draft.popoverPosition = action.payload;
        draft.popoverVisible = true;
        break;
      case "HIDE_POPOVER":
        draft.popoverVisible = false;
        break;
      case "CHANGE_COLOR":
        draft.color = action.payload;
        break;
      case "TRANSLATION_POPOVER_VISIBLE":
        draft.translationPopoverVisible = action.payload;
        break;
    }
  }
);

/**
 * 用于存储颜色选择框的位置，和是否显示隐藏
 */
export const MarkStoreProvider: React.FC<MarkStoreProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const initialState: MarkStoreType = {
    ...initialMarkStoreState,
    ...initialConfig,
  };
  const [state, dispatch] = useReducer(MarkStoreReducer, initialState);
  const contextValue = useMemo<MarkStoreContextType>(
    () => ({
      ...state,
      dispatch,
    }),
    [state]
  );
  return (
    <MarkStoreContext.Provider value={contextValue}>
      {children}
    </MarkStoreContext.Provider>
  );
};

export const useStore = (): MarkStoreContextType => {
  const context = useContext(MarkStoreContext);
  if (!context) {
    throw new Error("useStore must be used within a MarkStoreProvider");
  }
  return context;
};
