import React, { createContext } from "react";
import {
  ActionType,
  StoreAction,
  TranslationContextType,
  TranslationPanelState,
} from "./translationPanel.type";
import { produce } from "immer";

interface TranslationPanelProviderProps {
  children: React.ReactNode;
  initialConfig: TranslationPanelState;
}

const StoreContext = createContext<TranslationContextType | null>(null);

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

export const StoreProvider: React.FC<TranslationPanelProviderProps> = ({
  children,
  initialConfig = {
    translateText: "",
    isPopoverOpen: false,
    position: {
      x: 0,
      y: 0,
    },
  },
}) => {
  const [state, dispatch] = useReducer(storeReducer, initialConfig);
  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): TranslationContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
