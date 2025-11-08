import React, { createContext } from "react";
import { SidebarContextValue } from "./Sidebar.type";

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("Sidebar components must be used within <Sidebar>");
  }
  return context;
};

export const SidebarProvider: React.FC<{
  value: SidebarContextValue | null;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export { useSidebarContext };
