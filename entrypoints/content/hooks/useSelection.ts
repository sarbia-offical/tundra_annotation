import {
  SelectionObserver,
  getTextBoundingBoxes,
  isSelectionBackwards,
  selectionFocusRect,
  updatePopoverPosOnSelectionChange,
} from "@/lib/SelectionObserver";
import {
  usePopoverPosition,
  usePopoverVisibility,
  useTranslationText,
} from "../store/store.hooks";
import React from "react";

export function useSelection(): { startObserver: () => void } {
  const { setPosition } = usePopoverPosition();
  const { hidePopover, showPopover } = usePopoverVisibility();
  const { setTranslationText } = useTranslationText();
  const startObserver = React.useCallback(() => {
    new SelectionObserver(
      (range: Range | null, event: Event) => {
        const selection = document.getSelection();
        if (
          !selection?.toString() ||
          !selection.rangeCount ||
          selection?.isCollapsed ||
          !range
        ) {
          const target = event.target;
          if (
            !(
              target instanceof Element &&
              (target.tagName.toLowerCase() === "tundra-annotation" ||
                target.tagName.toLowerCase() === "web-marker-highlight")
            )
          ) {
            hidePopover();
          }
        }
        if (!!range && selection) {
          const rect = selectionFocusRect(
            selection,
            getTextBoundingBoxes(range)
          );
          const popoverPosition = rect
            ? updatePopoverPosOnSelectionChange(
                rect,
                isSelectionBackwards(selection)
              )
            : null;
          if (popoverPosition) {
            setTranslationText(`${range}`);
            setPosition({ ...popoverPosition });
            showPopover();
          }
        }
      },
      (event: Event) => {
        const target = event.target;
        if (
          !(
            target instanceof Element &&
            target.tagName.toLowerCase() === "tundra-annotation"
          )
        ) {
          hidePopover();
        }
      }
    );
  }, []);
  return { startObserver };
}
