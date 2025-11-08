import React, { createContext } from "react";
import {
  ActionType,
  StoreAction,
  TranslationPanelContextType,
  TranslationPanelState,
} from "./TranslationPanel.type";
import { produce } from "immer";

interface TranslationPanelProviderProps {
  children: React.ReactNode;
  initialConfig: TranslationPanelState;
}

const TranslationPanelContext =
  createContext<TranslationPanelContextType | null>(null);

const storeReducer = produce(
  (draft: TranslationPanelState, action: StoreAction) => {
    switch (action.type) {
      case ActionType.INIT:
        console.log("init");
        break;
      default:
        break;
    }
  }
);

export const useTranslationPanel = (): TranslationPanelContextType => {
  const context = useContext(TranslationPanelContext);
  if (!context) {
    throw new Error(
      "useTranslationPanel must be used within a TranslationContextProvider"
    );
  }
  return context;
};

export const TranslationContextProvider: React.FC<
  TranslationPanelProviderProps
> = ({
  children,
  initialConfig = {
    translateText: "",
    isPopoverOpen: false,
    position: {
      x: 0,
      y: 0,
    },
    to: "",
  },
}) => {
  const [state, dispatch] = useReducer(storeReducer, initialConfig);
  return (
    <TranslationPanelContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </TranslationPanelContext.Provider>
  );
};
