import React, { createContext } from "react";
import { ModalContextValue } from "./Modal.type";

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within <Modal>");
  }
  return context;
};

export const ModalProvider: React.FC<{
  value: ModalContextValue | null;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export { useModalContext };
