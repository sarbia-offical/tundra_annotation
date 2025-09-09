import { updatePopoverPosOnSelectionChange } from "@/lib/Marks/Dom";
import {
  SelectionObserver,
  selectionFocusRect,
  isSelectionBackwards,
} from "@/lib/SelectionObserver";
import { useState } from "react";
import { useMarkContext } from "../state/hooks";
import { MarkState } from "../state/type";

interface PositionType {
  x: number;
  y: number;
}

export function useSelection(): [PositionType | undefined, () => void] {
  const [position, setPosition] = useState<PositionType>();
  const changePopoverPos = useMarkContext(
    (state: MarkState) => state.changePopoverPos
  );
  const changePopoverVisible = useMarkContext(
    (state: MarkState) => state.changePopoverVisible
  );
  const startObserver = () => {
    let callBack = (range: Range | null) => {
      const selection = document.getSelection();
      if (
        !selection?.toString() ||
        !selection.rangeCount ||
        selection?.isCollapsed ||
        !range
      ) {
        changePopoverVisible(false);
      } else {
        const selection = document.getSelection();
        if (selection) {
          const rect = selectionFocusRect(selection);
          const popoverPosition = rect
            ? updatePopoverPosOnSelectionChange(
                rect,
                isSelectionBackwards(selection)
              )
            : null;
          const info = {
            x: popoverPosition?.x || 0,
            y: popoverPosition?.y || 0,
          };
          setPosition(info);
          changePopoverPos(info);
          changePopoverVisible(true);
        }
      }
    };
    new SelectionObserver((range: Range | null) => {
      callBack(range);
    });
  };
  return [position, startObserver];
}
