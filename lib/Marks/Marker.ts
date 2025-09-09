import {
  EventHandler,
  HighlightPainter,
  Context as EventHandlerContext,
  Context,
  SerializedRange,
  DeserializationError,
  HighlightTagName,
  HighlightBlacklistedElementClassName,
  AttributeNameHighlightId,
  AttributeNameHighlightColor,
  defaultCharsToKeepForTextBeforeAndTextAfter,
} from "./Marker.type";
import { generateUUID } from "@/lib/Utils";
const blackListedElementStyle = document.createElement("style");
blackListedElementStyle.innerText = `.${HighlightBlacklistedElementClassName}, .MJX_Assistive_MathML>math>*, math>semantics>* {display:none!important;};`;

interface MarkerConstructorArgs {
  rootElement?: HTMLElement;
  eventHandler?: EventHandler;
  highlightPainter?: HighlightPainter;
}

const defaultHighlightPainter: HighlightPainter = {
  paintHighlight: (context: Context, element: HTMLElement) => {
    element.style.textDecoration = "underline";
    element.style.textDecorationColor = "orange";
  },
};

const defaultEventHandler: EventHandler = {
  onHighlightClick: (context, element) => {
    console.log("onHighlightClick", context, element);
  },
  onHighlightHoverStateChange: (context, element, hovering) => {
    if (hovering) {
      element.style.backgroundColor = "#FFE49C";
    } else {
      element.style.backgroundColor = "";
    }
  },
};

class Marker {
  public static normalizeTextCache = {} as any;
  rootElement: Element;
  document: Document;
  window: Window;
  eventHandler: EventHandler;
  highlightPainter: HighlightPainter;
  state = {
    lastHoverId: "",
    uidToSerializedRange: {} as { [key: string]: SerializedRange },
  };

  /**
   * @param rootElement: 高亮操作的根元素（默认为document.body）
   * @param highlightPainter: 自定义高亮渲染器
   * @param eventHandler: 自定义事件处理器
   */
  constructor({
    rootElement,
    highlightPainter,
    eventHandler,
  }: MarkerConstructorArgs) {
    this.rootElement = rootElement || document.body;
    this.document = this.rootElement.getRootNode() as Document;
    this.window = this.document.defaultView as Window;
    this.highlightPainter = highlightPainter || defaultHighlightPainter;
    this.eventHandler = eventHandler || defaultEventHandler;
  }

  public static clearSelection(win: Window = window) {
    const selection = win.getSelection();
    if (!selection) {
      return;
    }
    if (selection.empty) {
      selection.empty();
    } else if (selection.removeAllRanges) {
      selection.removeAllRanges();
    }
  }

  private resolveHighlightElements(highlightId: string): HTMLElement[] {
    let elements: HTMLElement[] = [];
    for (let item of Array.from(
      this.document.getElementsByTagName(HighlightTagName)
    )) {
      if (item.getAttribute(AttributeNameHighlightId) === highlightId) {
        elements.push(item as HTMLElement);
      }
    }
    Array.from(
      this.document.getElementsByTagName(HighlightBlacklistedElementClassName)
    ).filter((item) => {
      return item.getAttribute(AttributeNameHighlightId) === highlightId;
    }) as HTMLElement[];
    return elements;
    // return Array.from(
    //   this.document.getElementsByTagName(HighlightBlacklistedElementClassName)
    // ).filter((item) => {
    //   return item.getAttribute(AttributeNameHighlightId) === highlightId;
    // }) as HTMLElement[];
  }

  private static normalizeText(s: string) {
    if (!Marker.normalizeTextCache[s]) {
      Marker.normalizeTextCache[s] = s.replace(/\s/g, "").toLowerCase();
    }
    return Marker.normalizeTextCache[s];
  }

  private static isBlackListedElementNode(element: Node | null) {
    if (!element) {
      return false;
    }
    if (element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const computedStyle = getComputedStyle(element as any);
    if (computedStyle.display === "none") {
      return true;
    }
    if (computedStyle.visibility === "hidden") {
      return true;
    }

    const className = (element as any).className;
    if (
      className &&
      className.indexOf &&
      className.indexOf(HighlightBlacklistedElementClassName) >= 0
    ) {
      return true;
    }

    const tagName = (element as any).tagName;
    return (
      tagName === "STYLE" ||
      tagName === "SCRIPT" ||
      tagName === "TITLE" ||
      tagName === "NOSCRIPT" ||
      tagName === "SVG" ||
      tagName === "svg"
    );
  }

  private static getRealOffset(textNode: Node, normalizedOffset: number) {
    const s = textNode.textContent || "";
    let cumulative = 0;
    for (let i = 0; i < s.length; i++) {
      while (i < s.length && !Marker.normalizeText(s.substr(i, 1))) {
        // omit whitespaces
        i++;
      }
      if (cumulative === normalizedOffset) {
        return i;
      }
      cumulative++;
    }
    if (cumulative === normalizedOffset) {
      return s.length;
    }
    throw new Error("failed to get real offset");
  }

  /**
   * 删除自定义元素，将自定义标签删除，文字内容移动到父级节点
   * @param element
   */
  private static unpaintElement(element: HTMLElement) {
    let childNodes = Array.from(element.childNodes);
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i] as HTMLElement;
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        (child.classList.contains("wave-canvas") ||
          child.classList.contains("annotationWrapper"))
      ) {
        element.removeChild(child);
        continue;
      }
      element.parentNode?.insertBefore(child, element);
    }
    element.parentNode?.removeChild(element);
  }

  private convertRangeToSelection(range: Range) {
    const selection = this.window.getSelection() as any;
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  /**
   * 这个函数负责将DOM中的Range对象序列化，以便后续存储和反序列化。
   * @param range
   * @param options
   * @returns
   */
  public serializeRange(
    range: Range,
    options: {
      color: string;
      createDate: number;
      uid?: string;
      charsToKeepForTextBeforeAndTextAfter?: number;
    } = {
      color: "",
      createDate: 0,
      uid: undefined,
      charsToKeepForTextBeforeAndTextAfter:
        defaultCharsToKeepForTextBeforeAndTextAfter,
    }
  ): SerializedRange | null {
    // 1. 性能优化：避免不必要的样式操作
    let shouldRemoveStyle = false;
    if (!this.document.head.contains(blackListedElementStyle)) {
      this.document.head.appendChild(blackListedElementStyle);
      shouldRemoveStyle = true;
    }

    try {
      if (range.collapsed) {
        console.warn("Cannot serialize collapsed range");
        return null; // 空范围不处理
      }
      // 2. 调整范围避开黑名单元素
      this.adjustRangeAroundBlackListedElement(range);

      // 3. 生成唯一ID（或使用传入的ID）
      const uid = options?.uid || generateUUID();

      const color = options?.color;

      const createDate = options.createDate;

      // 4. 确定前后文保留长度
      const charsToKeep =
        options?.charsToKeepForTextBeforeAndTextAfter ||
        defaultCharsToKeepForTextBeforeAndTextAfter;

      // 5. 将Range转换为Selection对象
      const selection = this.convertRangeToSelection(range);

      // 6. 获取选中文本
      let text = selection.toString();

      // 7. 标准化文本（去空格+转小写）
      let textNormalized = Marker.normalizeText(text);

      // 8. 检查有效文本内容
      if (!textNormalized) {
        console.warn("No valid text content in selected range");
        return null;
      }

      let [textBefore, textAfter] = this.extractContextText(range, charsToKeep);
      const startContainerPath = this.getNodePath(range.startContainer);
      const endContainerPath = this.getNodePath(range.endContainer);
      // 11. 创建并存储序列化对象
      this.state.uidToSerializedRange[uid] = {
        uid,
        data: {},
        textBefore,
        text,
        textAfter,
        pageData: {},
        startContainerPath,
        endContainerPath,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        color,
        createDate,
      };

      // 12. 返回序列化结果
      return this.state.uidToSerializedRange[uid];
    } finally {
      // 14. 确保移除临时添加的样式
      this.document.head.removeChild(blackListedElementStyle);
    }
  }

  /**
   * 拿到range对象，获取当前选中文案的前后文
   * @param range
   * @param charsToKeep
   * @returns
   */
  private extractContextText(
    range: Range,
    charsToKeep: number
  ): [string, string] {
    // 寻找当前元素的前文信息，需要满足128个字符。
    let textBefore = "";
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    if (startContainer.nodeType === Node.TEXT_NODE) {
      textBefore = startContainer.textContent?.substring(0, startOffset) || "";
    }
    let beforeElement: Node | null = startContainer;
    let beforeCharsRemaining = charsToKeep - textBefore.length;

    // 循环查找
    while (beforeCharsRemaining > 0) {
      beforeElement = this.findPreviousTextNodeInDomTree(beforeElement);
      if (!beforeElement) {
        break;
      }
      const nodeText = this.getInnerText(beforeElement);
      if (nodeText.length > beforeCharsRemaining) {
        textBefore =
          nodeText.substring(nodeText.length - beforeCharsRemaining) +
          textBefore;
        break; // 已获取足够的前文
      }
      textBefore = nodeText + textBefore;
      beforeCharsRemaining -= nodeText.length;
    }

    let textAfter = "";
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    if (endContainer.nodeType === Node.TEXT_NODE) {
      textAfter = endContainer.textContent?.substring(endOffset) || "";
    }

    let afterElement: Node | null = endContainer;
    let afterCharsRemaining = charsToKeep - textAfter.length;
    while (afterCharsRemaining > 0) {
      afterElement = this.findNextTextNodeInDomTree(afterElement);
      if (!afterElement) break;

      const nodeText = this.getInnerText(afterElement);
      if (nodeText.length > afterCharsRemaining) {
        textAfter += nodeText.substring(0, afterCharsRemaining);
        break;
      }

      textAfter += nodeText;
      afterCharsRemaining -= nodeText.length;
    }
    return [textBefore, textAfter];
  }

  private getNodePath(node: Node): string[] {
    const path: string[] = [];
    let current: Node | null = node;
    while (current && current !== this.rootElement) {
      if (current.parentNode) {
        const index = Array.from(current.parentNode.childNodes).indexOf(
          current as ChildNode
        );
        path.unshift(`${current.nodeName}[${index}]`);
      }
      current = current.parentNode;
    }

    return path;
  }

  /**
   * 批量绘制高亮
   * @param serializedRanges 序列化高亮数组
   * @returns
   */
  public batchPaint(serializedRanges: SerializedRange[]) {
    // 1. 初始化错误收集对象
    const errors = {} as any;
    // 2. 批量反序列化（核心操作）
    const { results: deserializedRanges, errors: deserializedRangeErrors } =
      this.batchDeserializeRange(serializedRanges);
    // 3. 遍历所有序列化范围
    for (let i = 0; i < serializedRanges.length; i++) {
      // 4. 处理反序列化错误
      if (deserializedRangeErrors[i]) {
        errors[i] = deserializedRangeErrors[i];
        continue;
      }

      // 5. 获取当前范围的UID和Range对象
      const uid = serializedRanges[i].uid;
      const color = serializedRanges[i].color;
      const range = deserializedRanges[i];

      // 6. 检查范围是否有效
      if (!range.collapsed) {
        // 7. 设置高亮元素的ID属性
        const setElementHighlightIdAttribute = (element: HTMLElement) => {
          element.setAttribute(AttributeNameHighlightId, uid);
          element.setAttribute(AttributeNameHighlightColor, color);
        };

        try {
          // 8. 立即执行函数封装高亮创建逻辑
          (() => {
            // 情况1: 单文本节点内的选择
            if (range.startContainer === range.endContainer) {
              if (range.startOffset === range.endOffset) {
                return; // 空范围跳过
              }

              // 9. 拆分文本节点：创建选中部分
              const word = (<Text>range.startContainer).splitText(
                range.startOffset
              );
              word.splitText(range.endOffset);

              // 10. 转换为高亮元素并设置ID
              setElementHighlightIdAttribute(
                this.convertTextNodeToHighlightElement(word)
              );
              return;
            }

            // 情况2: 跨多个节点的选择
            const toPaint = [];

            // 11. 处理起始节点
            let ptr = (<Text>range.startContainer).splitText(
              range.startOffset
            ) as Node | null;
            toPaint.push(ptr);

            // 12. 收集中间所有文本节点
            while (true) {
              ptr = this.findNextTextNodeInDomTree(ptr);
              if (ptr === range.endContainer) {
                break;
              }
              toPaint.push(ptr);
            }

            // 13. 处理结束节点
            (<Text>range.endContainer).splitText(range.endOffset);
            toPaint.push(range.endContainer);
            // 14. 转换所有节点为高亮元素
            toPaint.forEach((item) => {
              if (item) {
                let decoratedElement =
                  this.convertTextNodeToHighlightElement(item);
                setElementHighlightIdAttribute(decoratedElement);

                // 15. 处理空文本节点特殊情况
                if (!decoratedElement.innerText) {
                  decoratedElement.parentElement?.insertBefore(
                    item,
                    decoratedElement.nextSibling
                  );
                  decoratedElement.parentElement?.removeChild(decoratedElement);
                }
              }
            });
          })(); // 立即执行函数结束

          // 16. 应用高亮样式
          this.paintHighlights(uid);
        } catch (ex) {
          // 17. 捕获并记录处理过程中的错误
          errors[i] = ex;
        }
      }
    }

    // 18. 返回处理结果（包含错误信息）
    return { errors };
  }

  public paint(
    serializedRange: SerializedRange,
    errorCallback?: (errorLog: any) => void
  ): any {
    if (!serializedRange) {
      return;
    }
    const { errors } = this.batchPaint([serializedRange]);
    if (errorCallback && Object.keys(errors).length > 0) {
      errorCallback(errors);
    }
    return { errors };
  }
  public unpaint(serializedRange: SerializedRange): void;
  public unpaint(id: string): Promise<boolean> | void;

  public unpaint(params: SerializedRange | string) {
    if (typeof params === "string") {
      for (let element of this.resolveHighlightElements(params)) {
        Marker.unpaintElement(element);
      }
    } else {
      const id = params.uid;
      for (let element of this.resolveHighlightElements(id)) {
        Marker.unpaintElement(element);
      }
    }
  }

  /**
   * 批量将序列化的高亮范围 (SerializedRange[]) 反序列化为 DOM Range 对象，用于重新渲染页面上的高亮标记。
   * @param serializedRanges
   * @returns
   */
  private batchDeserializeRange(serializedRanges: SerializedRange[]) {
    // 1. 添加黑名单元素样式（隐藏不需要处理的元素）
    this.document.head.appendChild(blackListedElementStyle);

    // 2. 初始化结果集和错误集
    const results = {} as any;
    const errors = {} as any;

    // 3. 获取根元素的标准化文本内容（去空格/小写）
    const rootText = this.getNormalizedInnerText(this.rootElement);
    // 4. 遍历所有序列化范围
    for (let i = 0; i < serializedRanges.length; i++) {
      try {
        const sr = serializedRanges[i];
        // 5. 存储序列化范围到状态
        this.state.uidToSerializedRange[serializedRanges[i].uid] = sr;
        // 6. 计算范围在标准化文本中的起始偏移量
        const offset = this.resolveSerializedRangeOffsetInText(rootText, sr);
        // 7. 查找起始位置对应的DOM节点和偏移量
        const start = this.findElementAtOffset(this.rootElement, offset);
        // 8. 计算结束位置 = 起始位置 + 高亮文本长度
        const end = this.findElementAtOffset(
          this.rootElement,
          offset + Marker.normalizeText(sr.text).length
        );

        // 9. 创建DOM Range对象
        const range = this.document.createRange();
        // 10. 设置Range起点（将标准化偏移量转换为实际偏移量）
        range.setStart(
          start.element,
          Marker.getRealOffset(start.element, start.offset)
        );

        // 11. 设置Range终点
        range.setEnd(
          end.element,
          Marker.getRealOffset(end.element, end.offset)
        );

        // 12. 修剪Range首尾空格
        this.trimRangeSpaces(range);

        // 13. 存储结果
        results[i] = range;
      } catch (ex) {
        // 14. 错误处理
        errors[i] = ex;
      }
    }

    // 15. 移除临时样式
    this.document.head.removeChild(blackListedElementStyle);

    // 16. 返回结果和错误
    return { results, errors };
  }

  /**
   * 反序列化范围
   * @param serializedRange
   * @returns
   */
  public deserializeRange(serializedRange: SerializedRange) {
    const { results, errors } = this.batchDeserializeRange([serializedRange]);
    if (errors[0]) {
      throw errors[0];
    }
    return results[0];
  }

  clickListener = (e: Event) => {
    // the iframe HTMLElement instance is not same as other window HTMLElement instance
    if (!e.target || !(e.target instanceof (this.window as any).HTMLElement)) {
      return;
    }

    const target = e.target as HTMLElement;
    const id = target.getAttribute(AttributeNameHighlightId);
    if (id && this.eventHandler.onHighlightClick) {
      this.eventHandler.onHighlightClick(this.buildContext(id), target, e);
    }
  };

  mouseoverListener = (e: Event) => {
    if (!e.target || !(e.target instanceof (this.window as any).HTMLElement)) {
      return;
    }

    const target = e.target as HTMLElement;
    let newHoverId = target?.getAttribute(AttributeNameHighlightId);
    if (this.state.lastHoverId === newHoverId) {
      return;
    }
    const oldHoverId = this.state.lastHoverId;
    this.state.lastHoverId = newHoverId as string;

    if (newHoverId) {
      this.highlightHovering(newHoverId, true, e);
    }
    if (oldHoverId) {
      this.highlightHovering(oldHoverId, false, e);
    }
  };

  /**
   * 开启高亮点击事件监听
   */
  public addEventListeners() {
    this.rootElement.addEventListener("click", this.clickListener, true);
    this.rootElement.addEventListener(
      "mouseover",
      this.mouseoverListener,
      true
    );
  }

  public removeEventListeners() {
    this.rootElement.removeEventListener("click", this.clickListener, true);
    this.rootElement.removeEventListener(
      "mouseover",
      this.mouseoverListener,
      true
    );
  }

  public paintHighlights(highlightId: string) {
    let context = this.buildContext(highlightId);
    if (this.highlightPainter.beforePaintHighlight) {
      this.highlightPainter.beforePaintHighlight(context);
    }
    for (let element of this.resolveHighlightElements(highlightId)) {
      this.highlightPainter.paintHighlight(context, element);
    }
    if (this.highlightPainter.afterPaintHighlight) {
      this.highlightPainter.afterPaintHighlight(context);
    }
  }

  private highlightHovering(highlightId: string, hovering: boolean, e: Event) {
    for (let element of this.resolveHighlightElements(highlightId)) {
      if (this.eventHandler.onHighlightHoverStateChange) {
        this.eventHandler.onHighlightHoverStateChange(
          this.buildContext(highlightId),
          element as any,
          hovering,
          e
        );
      }
    }
  }

  private getInnerText(element: Node) {
    if (Marker.isBlackListedElementNode(element)) {
      return "";
    }
    if (element.nodeType === Node.TEXT_NODE) {
      return element.textContent;
    } else {
      if (typeof (element as any).innerText === "undefined") {
        let result = "";
        for (let i = 0; i < element.childNodes.length; i++) {
          result += this.getInnerText(element.childNodes[i]);
        }
        return result;
      } else {
        return (element as any).innerText;
      }
    }
  }

  private getNormalizedInnerText(element: Node) {
    return Marker.normalizeText(this.getInnerText(element));
  }

  private findLastChildTextNode(node: Node | null): Node | null {
    if (!node) {
      return null;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    if (node.childNodes) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        if (Marker.isBlackListedElementNode(node.childNodes[i])) {
          continue;
        }
        const candidate = this.findLastChildTextNode(node.childNodes[i]);
        if (candidate !== null) {
          return candidate;
        }
      }
    }
    return null;
  }

  private findFirstChildTextNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (Marker.isBlackListedElementNode(node.childNodes[i])) {
          continue;
        }
        const candidate = this.findFirstChildTextNode(node.childNodes[i]);
        if (candidate !== null) {
          return candidate;
        }
      }
    }
    return null;
  }

  private findPreviousTextNodeInDomTree(ptr: Node | null) {
    while (ptr) {
      while (Marker.isBlackListedElementNode(ptr?.previousSibling || null)) {
        ptr = ptr?.previousSibling || null;
      }
      while (ptr?.previousSibling) {
        const candidate = this.findLastChildTextNode(
          ptr?.previousSibling || null
        );
        if (candidate) {
          return candidate;
        }
        ptr = ptr.previousSibling;
      }

      ptr = ptr?.parentElement || null;
    }
    return null;
  }

  private findNextTextNodeInDomTree(ptr: Node | null) {
    while (ptr) {
      while (Marker.isBlackListedElementNode(ptr?.nextSibling || null)) {
        ptr = ptr?.nextSibling || null;
      }
      while (ptr?.nextSibling) {
        if (Marker.isBlackListedElementNode(ptr?.nextSibling)) {
          ptr = ptr.nextSibling;
          continue;
        }
        const candidate = this.findFirstChildTextNode(ptr.nextSibling);
        if (candidate) {
          return candidate;
        }
        ptr = ptr.nextSibling;
      }

      ptr = ptr?.parentElement || null;
    }
    return null;
  }

  private forwardOffset(
    { element, offset }: { element: Node; offset: number },
    toMove: number
  ): { element: Node; offset: number } {
    const elementText = this.getNormalizedInnerText(element);
    if (elementText.length > toMove + offset) {
      offset += toMove;
      return { element, offset };
    } else {
      let nextTextNode = this.findNextTextNodeInDomTree(element);
      if (nextTextNode) {
        return this.forwardOffset(
          {
            element: nextTextNode,
            offset: 0,
          },
          toMove - (elementText.length - offset)
        );
      } else {
        offset = this.getInnerText(element);
        return { element, offset };
      }
    }
  }

  private backwardOffset(
    { element, offset }: { element: Node; offset: number },
    toMove: number
  ): { element: Node; offset: number } {
    if (offset >= toMove) {
      offset -= toMove;
      return { element, offset };
    } else {
      const previousTextNode = this.findPreviousTextNodeInDomTree(element);
      if (previousTextNode) {
        return this.backwardOffset(
          {
            element: previousTextNode,
            offset: this.getNormalizedInnerText(previousTextNode).length,
          },
          toMove - offset
        );
      } else {
        offset = 0;
        return { element, offset };
      }
    }
  }

  /**
   * 递归寻找指定偏移量的文本节点
   * @param root
   * @param offset
   * @returns
   */
  private findElementAtOffset(
    root: Node,
    offset: number
  ): { element: Node; offset: number } {
    // 如果是文本节点，直接返回
    if (root.nodeType === Node.TEXT_NODE) {
      // 检查路径是否匹配
      return { element: root, offset: offset };
    }
    // 获取所有非黑名单的子节点
    const childNodes = Array.from(root.childNodes).filter(
      (node) => !Marker.isBlackListedElementNode(node)
    );

    let cumulativeOffset = 0;

    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      const childText = this.getNormalizedInnerText(child);
      const childLength = childText.length;
      // 关键修复：计算子节点在父节点中的实际偏移量
      const childStartOffset = cumulativeOffset;
      const childEndOffset = cumulativeOffset + childLength;

      // 如果目标偏移在当前子节点范围内
      if (offset >= childStartOffset && offset < childEndOffset) {
        // 计算子节点内的相对偏移量
        const relativeOffset = offset - childStartOffset;
        return this.findElementAtOffset(child, relativeOffset);
      }
      cumulativeOffset = childEndOffset;
    }
    // 处理边界情况：偏移量超出范围
    if (childNodes.length > 0) {
      const lastChild = childNodes[childNodes.length - 1];
      const lastText = this.getNormalizedInnerText(lastChild);
      return {
        element: lastChild,
        offset: lastText.length,
      };
    }

    // 没有有效子节点时返回根节点
    return { element: root, offset: 0 };
  }

  private trimRangeSpaces(range: Range) {
    let start = this.getInnerText(range.startContainer).substr(
      range.startOffset
    );
    let startTrimmed = start.trimStart();
    range.setStart(
      range.startContainer,
      range.startOffset + (start.length - startTrimmed.length)
    );

    let end = this.getInnerText(range.endContainer).substr(0, range.endOffset);
    let endTrimmed = end.trimEnd();
    range.setEnd(
      range.endContainer,
      range.endOffset - (end.length - endTrimmed.length)
    );
  }

  private convertTextNodeToHighlightElement(word: Node) {
    const decoratedElement = this.document.createElement(HighlightTagName);
    word.parentElement?.insertBefore(decoratedElement, word.nextSibling);
    word.parentElement?.removeChild(word);
    decoratedElement.appendChild(word);
    return decoratedElement;
  }

  private buildContext(highlightId: string): EventHandlerContext {
    return {
      serializedRange: this.state.uidToSerializedRange[highlightId],
      marker: this,
    };
  }

  private adjustRangeAroundBlackListedElement(range: Range) {
    let ptr = range.startContainer;
    let blacklistedParentOfStartContainer = null;
    while (ptr) {
      if (Marker.isBlackListedElementNode(ptr)) {
        blacklistedParentOfStartContainer = ptr;
      }
      ptr = ptr.parentElement as any;
    }

    ptr = range.endContainer;
    let blacklistedParentOfEndContainer = null;
    while (ptr) {
      if (Marker.isBlackListedElementNode(ptr)) {
        blacklistedParentOfEndContainer = ptr;
      }
      ptr = ptr.parentElement as any;
    }
    if (
      blacklistedParentOfStartContainer &&
      blacklistedParentOfEndContainer &&
      blacklistedParentOfStartContainer === blacklistedParentOfEndContainer
    ) {
      throw new Error("cannot highlight blacklisted element");
    }

    if (blacklistedParentOfStartContainer) {
      range.setStart(
        this.findNextTextNodeInDomTree(
          blacklistedParentOfStartContainer
        ) as any,
        0
      );
    }
    if (blacklistedParentOfEndContainer) {
      let prevNode = this.findPreviousTextNodeInDomTree(
        blacklistedParentOfEndContainer
      ) as any;
      range.setEnd(prevNode, this.getInnerText(prevNode).length);
    }
  }

  public getSerializedRangeFromUid(uid: string): SerializedRange | null {
    return this.state.uidToSerializedRange[uid] || null;
  }

  resolveSerializedRangeOffsetInText(
    text: any,
    serializedRange: SerializedRange
  ): number {
    // TODO: optimize algorithm, maybe use https://github.com/google/diff-match-patch
    const textBeforeNormalized = Marker.normalizeText(
      serializedRange.textBefore
    );
    const textAfterNormalized = Marker.normalizeText(serializedRange.textAfter);
    const textNormalized = Marker.normalizeText(serializedRange.text);
    for (let strategy of resolveSerializedRangeOffsetInTextStrategies) {
      const textToSearch =
        (strategy.textBefore ? textBeforeNormalized : "") +
        textNormalized +
        (strategy.textAfter ? textAfterNormalized : "");

      const index = text.indexOf(textToSearch);
      if (index >= 0) {
        return index + (strategy.textBefore ? textBeforeNormalized.length : 0);
      }
    }

    throw new DeserializationError(`failed to deserialize range`);
  }
}

const resolveSerializedRangeOffsetInTextStrategies = [
  {
    textBefore: true,
    textAfter: true,
  },
  {
    textBefore: false,
    textAfter: true,
  },
  {
    textBefore: true,
    textAfter: false,
  },
  {
    textBefore: false,
    textAfter: false,
  },
];

export default Marker;
export type { MarkerConstructorArgs };
export type MarkerInstanceType = InstanceType<typeof Marker>;
