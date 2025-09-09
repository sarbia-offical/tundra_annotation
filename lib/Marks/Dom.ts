import { isMobileOrTablet } from "../Utils";

export interface Position {
  x: number;
  y: number;
}

/**
 * 根据选取划线方向设置定位
 * @param rect
 * @param selectionIsBackwards
 * @returns
 */
export function updatePopoverPosOnSelectionChange(
  rect: DOMRect,
  selectionIsBackwards: boolean
): Position {
  const position: Position = {
    x: 0,
    y: 0,
  };
  if (selectionIsBackwards) {
    if (isMobileOrTablet) {
      position.y = rect.top + window.scrollY + 80;
    } else {
      position.y = rect.top + window.scrollY - 20;
    }
  } else {
    if (isMobileOrTablet) {
      position.y = rect.top + rect.height + window.scrollY + 50;
    } else {
      position.y = rect.top + rect.height + window.scrollY + 30;
    }
  }
  if (selectionIsBackwards) {
    position.x = rect.left + window.scrollX + 70;
  } else {
    position.x = rect.right + window.scrollX - 70;
  }

  if (isMobileOrTablet) {
    position.x = document.documentElement.clientWidth / 2;
  }

  if (position.x < 76) {
    position.x = 76;
  }

  if (position.x > document.documentElement.clientWidth - 76) {
    position.x = document.documentElement.clientWidth - 76;
  }
  return position;
}
