import React, { createContext, useContext, useMemo } from "react";
import { MarkPanelContextType, MarkPanelState } from "./MarkPanel.type";
import { Marker } from "@/lib/Marks/Marker";

interface MarkPanelProviderProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  markRef: React.RefObject<Marker | null>;
}

const MarkPanelContext = createContext<MarkPanelContextType | null>(null);

export const useMarkPanelContext = (): MarkPanelContextType => {
  const context = useContext(MarkPanelContext);
  if (!context) {
    throw new Error(
      "useMarkPanelContext must be used within a MarkPanelProvider"
    );
  }
  return context;
};

export const MarkPanelProvider: React.FC<MarkPanelProviderProps> = ({
  children,
  isOpen,
  onClose,
  markRef,
}) => {
  const contextValue = useMemo(
    () => ({
      state: { isOpen },
      onClose,
      markRef,
    }),
    [isOpen, onClose, markRef]
  );

  return (
    <MarkPanelContext.Provider value={contextValue}>
      {children}
    </MarkPanelContext.Provider>
  );
};
