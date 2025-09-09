import React, { useState } from "react";
import { CircleArrowLeft } from "lucide-react";
import { CollapseProvider, useCollapsePanel } from "./CollapseContext";

interface CollapsePanelProps {
  className?: string;
  children: React.ReactNode;
}

export const CollapsePanel: React.FC<CollapsePanelProps> = ({
  children,
  className = "",
}) => {
  return (
    <CollapseProvider>
      <CollapsePanelContent className={className}>
        {children}
      </CollapsePanelContent>
    </CollapseProvider>
  );
};

const CollapsePanelContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const { isExpanded, toggleExpand, fixedPin } = useCollapsePanel();
  return (
    <div
      className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-[100] ${className}`}
      onMouseLeave={() => {
        if (fixedPin) {
          return;
        }
        toggleExpand(false);
      }}
    >
      <div className="flex items-end flex-col">
        <div
          className={`shadow-[2px_6px_10px_0px_#0e121629] rounded-md transition-all duration-300 ease-in-out ${
            !fixedPin
              ? isExpanded
                ? "translate-x-0"
                : "translate-x-full"
              : "translate-x-0"
          }`}
        >
          {children}
        </div>

        <div
          className="w-10 h-10 ml-1 mt-2 rounded-l-lg flex items-center justify-center transition-colors shadow-[2px_6px_10px_0px_#0e121629] bg-white dark:bg-[#000000]"
          onMouseEnter={() => {
            if (fixedPin) {
              return;
            }
            toggleExpand(true);
          }}
        >
          {!fixedPin ? (
            <div
              className={`w-full h-full transition-transform duration-300 opacity-[2] flex items-center justify-center ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
            >
              <CircleArrowLeft />
            </div>
          ) : (
            <div
              className={`w-full h-full transition-transform duration-300 opacity-[2] flex items-center justify-center`}
            >
              <CircleArrowLeft />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
