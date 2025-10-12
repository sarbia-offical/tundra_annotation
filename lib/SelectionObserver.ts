import { isMobileOrTablet } from "@/lib/utils";

export interface Position {
  x: number;
  y: number;
}

export class SelectionObserver {
  private _callback: (range: Range | null, event: Event) => void;
  private _clickCallback: (event: Event) => void;
  private _document: Document;
  private _pendingCallback: number | null = null;
  private _eventHandler: (event: Event) => void;
  private _cancelPendingCallback() {
    if (this._pendingCallback !== null) {
      clearTimeout(this._pendingCallback);
      this._pendingCallback = null;
    }
  }
  /**
   * 获取文档选区
   * @param document
   * @returns
   */
  private _selectedRangeCallback(document: Document): Range | null {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return null;
    }
    return range;
  }
  constructor(
    callback: (range: Range | null, event: Event) => void,
    clickCallback: (event: Event) => void,
    observedNode?: Document
  ) {
    this._callback = callback;
    this._clickCallback = clickCallback;
    this._document = observedNode || document;
    let isMouseDown = false;
    let events = ["mousedown", "mouseup", "selectionchange"];

    const scheduleCallback = (delay = 10, event: Event) => {
      this._cancelPendingCallback();
      this._pendingCallback = window.setTimeout(() => {
        this._callback(this._selectedRangeCallback(this._document), event);
      }, delay);
    };

    this._eventHandler = (event: Event) => {
      if (event.type === "mousedown") {
        this._clickCallback(event);
        isMouseDown = true;
      }
      if (event.type === "mouseup") {
        isMouseDown = false;
      }
      if (isMouseDown) return;
      this._cancelPendingCallback();
      const delay = event.type === "mouseup" ? 10 : 100;
      scheduleCallback(delay, event);
    };
    for (const event of events) {
      this._document.addEventListener(event, this._eventHandler);
    }
  }
}

/**
 * 判断选取内容是从左到右还是从右到左
 * @param selection - 选区对象
 * @returns 如果是反向选择则返回 true
 */
export function isSelectionBackwards(selection: Selection): boolean {
  if (selection.focusNode === selection.anchorNode) {
    return selection.focusOffset < selection.anchorOffset;
  }

  const range = selection.getRangeAt(0);
  return range.startContainer === selection.focusNode;
}

/**
 * 获取range对象里的所有元素，并且筛选出所有的text节点
 * @param range
 * @returns
 */
export function forEachNodeInRange(range: Range): Text[] {
  const root = range.commonAncestorContainer;
  const document = root.ownerDocument;
  if (!document) return [];
  const textNodes: Text[] = [];
  const nodeIter = document.createNodeIterator(root, NodeFilter.SHOW_ALL);
  const whitespaceOnly = /^\s*$/;
  let currentNode: Node | null;
  while ((currentNode = nodeIter.nextNode())) {
    const length =
      currentNode.nodeType === Node.TEXT_NODE
        ? (currentNode as Text).length
        : currentNode.childNodes.length;
    if (
      range.comparePoint(currentNode, 0) <= 0 &&
      range.comparePoint(currentNode, length) >= 0
    ) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        const textNode = currentNode as Text;
        if (!whitespaceOnly.test(textNode.textContent || "")) {
          textNodes.push(textNode);
        }
      }
    }
  }
  return textNodes;
}

/**
 * 获取range对象内部文本节点的几何坐标
 * @param range
 * @returns
 */
export function getTextBoundingBoxes(range: Range): DOMRect[] {
  const rects: DOMRect[] = [];
  const textNodes = forEachNodeInRange(range);
  textNodes.forEach((node) => {
    const ownerDocument = node.ownerDocument;
    if (!ownerDocument) return;
    const nodeRange = ownerDocument.createRange();
    nodeRange.selectNodeContents(node);
    if (node === range.startContainer) {
      nodeRange.setStart(node, range.startOffset);
    }
    if (node === range.endContainer) {
      nodeRange.setEnd(node, range.endOffset);
    }

    if (nodeRange.collapsed) {
      nodeRange.detach();
      return;
    }
    const viewportRects = nodeRange.getClientRects();
    nodeRange.detach();
    rects.push(...viewportRects);
  });
  return rects;
}

/**
 * 根据鼠标滑动的方向，选择最边缘的元素几何坐标，用于弹出框的位置选取
 * @param selection
 * @returns
 */
export function selectionFocusRect(
  selection: Selection,
  textBoxes: DOMRect[]
): DOMRect | null {
  if (selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }
  return isSelectionBackwards(selection)
    ? textBoxes[0]
    : textBoxes[textBoxes.length - 1];
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
  // 强制触发重排，确保获取正确的滚动位置
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  const position: Position = {
    x: 0,
    y: 0,
  };
  position.y = rect.top + scrollY + 30;
  position.x = rect.left + scrollX + 70;

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
