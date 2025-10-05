import {
  SelectionObserver,
  getTextBoundingBoxes,
  isSelectionBackwards,
  selectionFocusRect,
  updatePopoverPosOnSelectionChange,
} from "@/lib/SelectionObserver";
import { usePopoverPosition, usePopoverVisibility } from "../store/store.hooks";

export function useSelection(): [() => void] {
  const { setPosition } = usePopoverPosition();
  const { showPopover, hidePopover } = usePopoverVisibility();
  const startObserver = () => {
    new SelectionObserver((range: Range | null) => {
      const selection = document.getSelection();
      if (
        !selection?.toString() ||
        !selection.rangeCount ||
        selection?.isCollapsed ||
        !range
      ) {
        hidePopover();
      }
      if (!!range && selection) {
        const rect = selectionFocusRect(selection, getTextBoundingBoxes(range));
        const popoverPosition = rect
          ? updatePopoverPosOnSelectionChange(
              rect,
              isSelectionBackwards(selection)
            )
          : null;
        if (popoverPosition) {
          setPosition({ ...popoverPosition });
          showPopover();
        }
      }
    });
  };
  return [startObserver];
}
