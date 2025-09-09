/**
 * 获取当前有效的文档选区范围
 * @param document - 目标文档对象
 * @returns 返回选区范围对象，若无有效选区则返回 null
 */
function selectedRange(document: Document): Range | null {
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

/**
 * 选区观察者配置选项
 */
interface SelectionObserverOptions {
  document?: Document;
}

/**
 * 选区观察者类：智能监听文档选区变化并触发回调
 */
export class SelectionObserver {
  private _document: Document;
  private _pendingCallback: number | null = null;
  private _events: string[];
  private _callback: (range: Range | null) => void;
  private _eventHandler: (event: Event) => void;

  /**
   * 创建选区观察者实例
   * @param callback - 选区变化时的回调函数
   * @param options - 配置选项（可选）
   */
  constructor(
    callback: (range: Range | null) => void,
    options: SelectionObserverOptions = {}
  ) {
    this._callback = callback;
    this._document = options.document || document;
    let isMouseDown = false;

    /**
     * 调度回调函数的执行
     * @param delay - 延迟执行时间（毫秒，默认10）
     */
    const scheduleCallback = (delay = 10) => {
      this._cancelPendingCallback();

      this._pendingCallback = window.setTimeout(() => {
        this._callback(selectedRange(this._document));
      }, delay);
    };

    // 事件处理函数
    this._eventHandler = (event: Event) => {
      if (event.type === "mousedown") {
        isMouseDown = true;
      }
      if (event.type === "mouseup") {
        isMouseDown = false;
      }

      // 鼠标按下时不处理
      if (isMouseDown) {
        return;
      }

      this._cancelPendingCallback();

      // 根据事件类型设置延迟
      const delay = event.type === "mouseup" ? 10 : 100;
      scheduleCallback(delay);
    };

    // 监听的事件类型
    this._events = ["mousedown", "mouseup", "selectionchange"];

    // 注册事件监听
    for (const event of this._events) {
      this._document.addEventListener(event, this._eventHandler);
    }

    // 初始报告当前选区
    // scheduleCallback(1);
  }

  /**
   * 取消待处理的回调
   */
  private _cancelPendingCallback() {
    if (this._pendingCallback !== null) {
      clearTimeout(this._pendingCallback);
      this._pendingCallback = null;
    }
  }

  /**
   * 销毁观察者，清理资源
   */
  disconnect() {
    for (const event of this._events) {
      this._document.removeEventListener(event, this._eventHandler);
    }
    this._cancelPendingCallback();
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
 * 检查节点是否完全包含在选区范围内
 * @param range - 选区范围对象
 * @param node - 要检查的 DOM 节点
 * @returns 如果节点完全在选区中则返回 true
 */
export function isNodeInRange(range: Range, node: Node): boolean {
  try {
    const length =
      node.nodeType === Node.TEXT_NODE
        ? (node as Text).length
        : node.childNodes.length;

    return (
      range.comparePoint(node, 0) <= 0 && range.comparePoint(node, length) >= 0
    );
  } catch (e) {
    return false;
  }
}

/**
 * 遍历选区内的所有节点并执行回调
 * @param range - 选区范围对象
 * @param callback - 对每个节点执行的回调函数
 */
export function forEachNodeInRange(
  range: Range,
  callback: (node: Node) => void
): void {
  const root = range.commonAncestorContainer;
  const document = root.ownerDocument;

  if (!document) return;

  const nodeIter = document.createNodeIterator(root, NodeFilter.SHOW_ALL);

  let currentNode: Node | null;
  while ((currentNode = nodeIter.nextNode())) {
    if (isNodeInRange(range, currentNode)) {
      callback(currentNode);
    }
  }
}

/**
 * 获取选区中非空白文本节点的边界矩形
 * @param range - 选区范围对象
 * @returns 边界矩形数组（视口坐标）
 */
export function getTextBoundingBoxes(range: Range): DOMRect[] {
  const whitespaceOnly = /^\s*$/;
  const textNodes: Text[] = [];

  forEachNodeInRange(range, (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      if (!whitespaceOnly.test(textNode.textContent || "")) {
        textNodes.push(textNode);
      }
    }
  });

  const rects: DOMRect[] = [];

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

    const viewportRects = Array.from(nodeRange.getClientRects());
    nodeRange.detach();

    rects.push(...viewportRects);
  });

  return rects;
}

/**
 * 获取选区焦点的边界矩形
 * @param selection - 选区对象
 * @returns 焦点位置的边界矩形，若无有效选区则返回 null
 */
export function selectionFocusRect(selection: Selection): DOMRect | null {
  if (selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const textBoxes = getTextBoundingBoxes(selection.getRangeAt(0));
  if (textBoxes.length === 0) {
    return null;
  }

  return isSelectionBackwards(selection)
    ? textBoxes[0]
    : textBoxes[textBoxes.length - 1];
}
