import React from "react";
import { ColorSelectorContextValue } from "./ColorSelector.type";

const ColorSelectorContext =
  React.createContext<ColorSelectorContextValue | null>(null);

export const useColorSelectorContext = () => {
  const context = React.useContext(ColorSelectorContext);
  if (!context) {
    throw new Error(
      "useColorSelectorContext must be used within a ColorSelectorProvider"
    );
  }
  return context;
};

export const ColorSelectorProvider: React.FC<{
  value: ColorSelectorContextValue | null;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <ColorSelectorContext.Provider value={value}>
      {children}
    </ColorSelectorContext.Provider>
  );
};
