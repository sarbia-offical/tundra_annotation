import { stat } from "fs";
import { useStore } from "./translationPanel.context";
import { TranslationPanelProps } from "./translationPanel.type";
import { CSSProperties } from "react";

export const usePopoverPosition = (props: TranslationPanelProps) => {
  const { position, translateText, isPopoverOpen } = props;
  const positionStyle = useMemo<CSSProperties>(() => {
    const { x, y } = position;
    return {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
    };
  }, [position]);
  const visible = useMemo<boolean>(() => isPopoverOpen, [isPopoverOpen]);
  const textContext = useMemo<string>(() => translateText, [translateText]);
  return {
    positionStyle,
    visible,
    textContext,
  };
};
