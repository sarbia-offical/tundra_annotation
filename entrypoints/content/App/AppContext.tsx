import React, { createContext, useContext } from "react";

type AnnotateContextType = {
  openEditor: (uid: string) => void;
};

export const AnnotateContext = createContext<AnnotateContextType | undefined>(
  undefined
);

export const useAnnotateContext = () => {
  const context = useContext(AnnotateContext);
  if (!context) {
    throw new Error("useAnnotateContext must be used within AnnotateProvider");
  }
  return context;
};
