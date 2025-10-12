import React from "react";
import "@/assets/tailwind.css";
import { TranslationPanel } from "@/components/widgets/content/translationPanel";
import { ColorSelector } from "@/components/widgets/content/colorSelector";
import {
  usePopoverPosition,
  usePopoverVisibility,
  useTranslationText,
} from "./store/store.hooks";
import { useLanguageAndTheme } from "./hooks/useLanguageAndTheme";
import { useMarkerInitialization } from "./hooks/useMarkerInitialization";
import { usePositionTracking } from "./hooks/usePositionTracking";
import { useColorHighlight } from "./hooks/useHighlight";

const Container: React.FC = () => {
  const { theme } = useLanguageAndTheme();
  const { markRef } = useMarkerInitialization();
  const { popoverPosition } = usePopoverPosition();
  const { isVisible } = usePopoverVisibility();
  const { setColor } = useColorHighlight(markRef);
  const { translationText } = useTranslationText();
  usePositionTracking();
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {/* 翻译&颜色选择面板 */}
      <TranslationPanel
        translateText={translationText}
        isPopoverOpen={isVisible}
        position={{ x: popoverPosition.x, y: popoverPosition.y }}
      >
        <ColorSelector
          onValueChange={(value: string) => {
            console.log("value", value);
            setColor(value);
          }}
        />
      </TranslationPanel>
    </div>
  );
};
Container.displayName = "Container";
export { Container };
