import { TranslationPanelProps } from "./TranslationPanel.type";
import { CSSProperties } from "react";

export const useTranslationPopover = (props: TranslationPanelProps) => {
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
    ...props,
    positionStyle,
    visible,
    textContext,
  };
};
