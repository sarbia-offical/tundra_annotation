import React from "react";
import { SelectContextValue } from "./SelectTypes";

const SelectContext = React.createContext<SelectContextValue | null>(null);
export const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("useSelectContext must be used within a SelectProvider");
  }
  return context;
};
export const SelectProvider: React.FC<{
  value: SelectContextValue | null;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <SelectContext.Provider value={value}>{children}</SelectContext.Provider>
  );
};
