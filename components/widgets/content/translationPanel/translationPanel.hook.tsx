import { CSSProperties, useMemo } from "react";
import { TranslationPanelProps } from "./TranslationPanel.type";

export const useTranslationContext = (props: TranslationPanelProps) => {
  const { position, translateText, isPopoverOpen } = props;
  const positionStyle = useMemo(() => position, [position]);
  const visible = useMemo<boolean>(() => isPopoverOpen, [isPopoverOpen]);
  const textContext = useMemo<string>(() => translateText, [translateText]);
  const toContext = useMemo<string>(() => props.to, [props.to]);
  const close = useMemo(() => props.closePopover, [props.closePopover]);
  return {
    ...props,
    positionStyle,
    visible,
    textContext,
    toContext,
    close,
  };
};
