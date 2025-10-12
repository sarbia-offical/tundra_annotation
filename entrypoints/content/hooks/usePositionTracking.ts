import { useLayoutEffect, useRef } from "react";
import { PopoverPositionType } from "@/components/widgets/content/translationPanel/TranslationPanel.type";
import { usePopoverPosition, usePopoverVisibility } from "../store/store.hooks";

export const usePositionTracking = () => {
  const prevPositionRef = useRef<PopoverPositionType>({ x: 0, y: 0 });
  const { popoverPosition } = usePopoverPosition();
  const { showPopover, hidePopover, isVisible } = usePopoverVisibility();
  // 监听dom的变化，修改翻译弹窗的位置和显隐
  useLayoutEffect(() => {
    if (!isVisible) {
      hidePopover();
    }
    if (
      isVisible &&
      (popoverPosition.x !== prevPositionRef.current.x ||
        popoverPosition.y !== prevPositionRef.current.y)
    ) {
      prevPositionRef.current = {
        x: popoverPosition.x,
        y: popoverPosition.y,
      };
      showPopover();
    }
  }, [popoverPosition, isVisible]);

  return { prevPositionRef };
};
