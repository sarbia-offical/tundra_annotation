import React from "react";
import { VirtualListContextValue } from "./virtualList.type";

const VirtualListContext =
  React.createContext<VirtualListContextValue<any> | null>(null);

export const useVirtualListContext = () => {
  const context = React.useContext(VirtualListContext);
  if (!context) {
    throw new Error("VirtualListContext must be used within a SelectProvider");
  }
  return context;
};

export const VirtualListProvider: React.FC<{
  value: VirtualListContextValue<any> | null;
  children: React.ReactNode;
}> = ({ children, value }) => {
  return (
    <VirtualListContext.Provider value={value}>
      {children}
    </VirtualListContext.Provider>
  );
};
