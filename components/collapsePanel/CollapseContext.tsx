import React, { createContext, useContext, useState } from "react";

interface CollapseContextValue {
  isExpanded: boolean;
  fixedPin: boolean;
  toggleExpand: (value: boolean) => void;
  togglePin: (value: boolean) => void;
}

const CollapseContext = createContext<CollapseContextValue | undefined>(
  undefined
);

export const useCollapsePanel = () => {
  const context = useContext(CollapseContext);
  if (!context) {
    throw new Error("useCollapsePanel must be used within a CollapsePanel");
  }
  return context;
};

export const CollapseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [fixedPin, setFixedPin] = useState<boolean>(false);
  const toggleExpand = (value: boolean) => setIsExpanded(value);
  const togglePin = (value: boolean) => setFixedPin(value);
  return (
    <CollapseContext.Provider
      value={{ isExpanded, toggleExpand, fixedPin, togglePin }}
    >
      {children}
    </CollapseContext.Provider>
  );
};
