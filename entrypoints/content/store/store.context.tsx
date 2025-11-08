import React, { createContext } from "react";
import {
  initialMarkStoreState,
  MarkStoreAction,
  MarkStoreContextType,
  MarkStoreType,
} from "./store.type";
import { produce } from "immer";
import { SerializedRange } from "@/lib/Marks/Mark.type";

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
      case "SET_TRANSLATION_TEXT":
        draft.translationText = action.payload;
        break;
      case "SET_CURRENT_MARK":
        draft.currentMark = action.payload as SerializedRange;
        break;
      case "TRIGGERING_EXISTING_MARK":
        const {
          currentMark,
          popoverVisible,
          popoverPosition,
          translationText,
        } = action.payload;
        draft.currentMark = currentMark;
        draft.popoverVisible = popoverVisible;
        draft.popoverPosition = popoverPosition;
        draft.translationText = translationText;
        break;
      default:
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
  const contextValue = {
    ...state,
    dispatch,
  };
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
