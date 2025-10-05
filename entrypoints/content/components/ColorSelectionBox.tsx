import { useDisplaySettings } from "@/store/store.hooks";
import React from "react";
import ColorSelector from "./ColorSelector";
import { useStore } from "../store/store.context";
import { usePopoverPosition, usePopoverVisibility } from "../store/store.hooks";

const ColorSelectionBox: React.FC = () => {
  usePopoverPosition();
  usePopoverVisibility();
  const { defaultConfiguration } = useDisplaySettings();
  const { popoverPosition } = usePopoverPosition();
  const { isVisible } = usePopoverVisibility();
  const { theme } = defaultConfiguration;
  return isVisible ? (
    <div className={theme === "dark" ? "dark" : "light"}>
      <div
        className={`absolute flex items-center flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-5
        z-[9999] shadow-2xl
        rounded-lg annotate_bg`}
        style={{
          left: popoverPosition.x || "50%",
          top: popoverPosition.y || "50%",
        }}
      >
        <div className="px-1.5 py-1.5">
          <ColorSelector />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
ColorSelectionBox.displayName = "ColorSelectionBox";
export { ColorSelectionBox };
