import React, { createContext } from "react";
import { PopoverContextValue } from "./Popover.type";

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within <Popover>");
  }
  return context;
};

export const PopoverProvider: React.FC<{
  value: PopoverContextValue | null;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
};

export { usePopoverContext };
