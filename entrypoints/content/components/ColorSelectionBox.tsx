import { useDisplaySettings } from "@/store/store.hooks";
import React from "react";
import ColorSelector from "./ColorSelector";
import {
  usePopoverPosition,
  usePopoverVisibility,
  useColor,
} from "../store/store.hooks";
import { cn } from "@/lib/utils";

const ColorSelectionBox: React.FC = () => {
  usePopoverPosition();
  usePopoverVisibility();
  const { defaultConfiguration } = useDisplaySettings();
  const { popoverPosition } = usePopoverPosition();
  const { isVisible } = usePopoverVisibility();
  const { setColor } = useColor();
  const { theme } = defaultConfiguration;
  return isVisible ? (
    <div className={cn(theme === "dark" ? "dark" : "light")}>
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
          <ColorSelector
            setColor={(color: string) => {
              setColor(color);
            }}
          />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
ColorSelectionBox.displayName = "ColorSelectionBox";
export { ColorSelectionBox };
