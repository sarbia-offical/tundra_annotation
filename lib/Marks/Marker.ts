import {
  AttributeNameHighlightColor,
  AttributeNameHighlightId,
  Context,
  defaultCharsToKeepForTextBeforeAndTextAfter,
  EventHandler,
  HighlightBlacklistedElementClassName,
  HighlightPainter,
  HighlightTagName,
  SerializedRange,
  EventHandlerContext,
} from "./Mark.type";
import { generateUUID } from "@/lib/utils";

interface MarkerConstructorArgs {
  rootElement?: HTMLElement;
  highlightPainter?: HighlightPainter;
  eventHandler: EventHandler;
}

const defaultHighlightPainter: HighlightPainter = {
  paintHighlight(contetx: Context, element: HTMLElement) {
    Object.assign(element.style, {
      backgroundColor: "#606060",
      textDecoration: "underline",
      color: "#FFFFFF",
    });
  },
};

const defaultEventHandler: EventHandler = {
  onHighlightClick: (context, element) => {
    console.log("onHighlightClick", context, element);
  },
  onHighlightHover: (context, element) => {
    console.log("onHighlightHover", context, element);
  },
};

const blackListedElementStyle = document.createElement("style");
blackListedElementStyle.innerText = `.${HighlightBlacklistedElementClassName}, .MJX_Assistive_MathML>math>*, math>semantics>* {display:none!important;};`;
export class Marker {
  public static normalizeTextCache = {} as any;
  public static normalizeElementCache = {} as any;
  private _rootElement: Element;
  private _document: Document;
  private _window: Window;
  private _highlightPainter: HighlightPainter;
  private _eventHandler: EventHandler;
  private state = {
    lastHoverId: "",
    uidToSerializedRange: {} as { [key: string]: SerializedRange },
  };
  private resolveSerializedRangeOffsetInTextStrategies = [
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
  constructor({
    rootElement,
    highlightPainter,
    eventHandler,
  }: MarkerConstructorArgs) {
    this._rootElement = rootElement || document.body;
    this._document = this._rootElement.getRootNode() as Document;
    this._window = this._document.defaultView as Window;
    this._highlightPainter = highlightPainter || defaultHighlightPainter;
    this._eventHandler = eventHandler || defaultEventHandler;
  }

  /**
   * 以特定的结构序列化数据
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
    this._document.head.appendChild(blackListedElementStyle);
    this.adjustRangeAroundBlackListedElement(range);

    const uid = options?.uid || generateUUID();

    const color = options?.color;

    const createDate = options.createDate;

    const selection = this.convertRangeToSelection(range);

    let text = selection.toString();
    let textNormalized = this.normalizeText(text);
    if (!textNormalized) {
      console.warn("No valid text content in selected range");
      return null;
    }

    const charsToKeep =
      options?.charsToKeepForTextBeforeAndTextAfter ||
      defaultCharsToKeepForTextBeforeAndTextAfter;

    const [textBefore, textAfter] = this.extractContextText(range, charsToKeep);
    this.state.uidToSerializedRange[uid] = {
      uid,
      textBefore,
      text,
      textAfter,
      pageData: {},
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      color,
      createDate,
    };
    return this.state.uidToSerializedRange[uid];
  }

  /**
   * 调整range选中的范围
   * @param range
   */
  private adjustRangeAroundBlackListedElement(range: Range) {
    let startContainer = range.startContainer;
    let blacklistedParentOfStartContainer = null;
    while (startContainer) {
      if (this.isBlackListedElementNode(startContainer)) {
        blacklistedParentOfStartContainer = startContainer;
      }
      startContainer = startContainer.parentElement as any;
    }

    let endContainer = range.endContainer;
    let blacklistedParentOfEndContainer = null;
    while (endContainer) {
      if (this.isBlackListedElementNode(endContainer)) {
        blacklistedParentOfEndContainer = endContainer;
      }
      endContainer = endContainer.parentElement as any;
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

  /**
   * 在兄弟节点中，找到下一个包含文本的节点
   * @param node
   * @returns
   */
  private findNextTextNodeInDomTree(node: Node | null) {
    while (node) {
      /**
       * 跳过黑名单中的的兄弟节点
       */
      while (this.isBlackListedElementNode(node?.nextSibling || null)) {
        node = node?.nextSibling || null;
      }
      /**
       * 遍历兄弟几点，过滤黑名单兄弟节点，找到兄弟节点下的第一个文本节点
       */
      while (node?.nextSibling) {
        if (this.isBlackListedElementNode(node?.nextSibling)) {
          node = node.nextSibling;
          continue;
        }
        const candidate = this.findFirstChildTextNode(node.nextSibling);
        if (candidate) {
          return candidate;
        }
        node = node.nextSibling;
      }
      /**
       * 如果当前层的兄弟节点都没找到文本节点，则继续查找父级元素
       */
      node = node?.parentElement || null;
    }
    return null;
  }

  /**
   * 在指定节点下，递归地寻找第一个文本节点。
   * @param node
   * @returns
   */
  private findFirstChildTextNode(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    if (node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (this.isBlackListedElementNode(node.childNodes[i])) {
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

  /**
   * 在兄弟节点中，找到上一个包含文本的节点
   * @param node
   * @returns
   */
  private findPreviousTextNodeInDomTree(node: Node | null) {
    while (node) {
      while (this.isBlackListedElementNode(node?.previousSibling || null)) {
        node = node?.previousSibling || null;
      }
      while (node?.previousSibling) {
        const candidate = this.findLastChildTextNode(
          node?.previousSibling || null
        );
        if (candidate) {
          return candidate;
        }
        node = node.previousSibling;
      }

      node = node?.parentElement || null;
    }
    return null;
  }

  /**
   * 在前一个兄弟节点内部查找最后一个文本节点；
   * @param node
   * @returns
   */
  private findLastChildTextNode(node: Node | null): Node | null {
    if (!node) {
      return null;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    if (node.childNodes) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        if (this.isBlackListedElementNode(node.childNodes[i])) {
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

  /**
   * 判断这个节点是否为黑名单
   * @param element
   * @returns
   */
  private isBlackListedElementNode(element: Node | null) {
    if (!element) {
      return false;
    }
    if (element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const style = getComputedStyle(element as any);
    if (style.display === "none") {
      return true;
    }
    if (style.visibility === "hidden") {
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
    const blacklistedTags = ["STYLE", "SCRIPT", "TITLE", "NOSCRIPT", "SVG"];
    return blacklistedTags.includes(tagName?.toUpperCase());
  }

  /**
   * 递归获取节点内的所有文本
   * @param element
   * @returns
   */
  private getInnerText(element: Node) {
    if (this.isBlackListedElementNode(element)) {
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

  /**
   * 重新选定range
   * @param range
   * @returns
   */
  private convertRangeToSelection(range: Range) {
    const selection = this._window.getSelection() as any;
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  /**
   * 缓存文本
   * @param s
   * @returns
   */
  private normalizeText(s: string) {
    if (!Marker.normalizeTextCache[s]) {
      Marker.normalizeTextCache[s] = s.replace(/\s/g, "").toLowerCase();
    }
    return Marker.normalizeTextCache[s];
  }

  /**
   * 缓存节点
   * @param uid
   * @param elements
   * @returns
   */
  private normalizeElements(uid: string, elements: HTMLElement[]) {
    if (!Marker.normalizeElementCache[uid]) {
      Marker.normalizeElementCache[uid] = elements;
    }
    return Marker.normalizeElementCache[uid];
  }

  /**
   * 从range对象已选中的文本中，寻找固定长度的上下文字符
   * @param range
   * @param charsToKeep
   * @returns
   */
  private extractContextText(range: Range, charsToKeep: number) {
    let textBefore = "";
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    if (startContainer.nodeType === Node.TEXT_NODE) {
      textBefore = startContainer.textContent?.substring(0, startOffset) || "";
    }
    let totalNumberOfBeforeCharsNumber = charsToKeep - textBefore.length;
    let beforeElement: Node | null = startContainer;
    while (totalNumberOfBeforeCharsNumber > 0) {
      beforeElement = this.findPreviousTextNodeInDomTree(beforeElement);
      if (!beforeElement) {
        break;
      }
      const nodeText = this.getInnerText(beforeElement);
      if (nodeText.length > totalNumberOfBeforeCharsNumber) {
        textBefore =
          nodeText.substring(nodeText.length - totalNumberOfBeforeCharsNumber) +
          textBefore;
        break;
      }
      textBefore = nodeText + textBefore;
      totalNumberOfBeforeCharsNumber -= nodeText.length;
    }

    let textAfter = "";
    const endContainer = range.endContainer;
    const endOffset = range.endOffset;
    if (endContainer.nodeType === Node.TEXT_NODE) {
      textAfter = endContainer.textContent?.substring(endOffset) || "";
    }

    let afterElement: Node | null = endContainer;
    let totalNumberOfAfterCharsNumber = charsToKeep - textAfter.length;
    while (totalNumberOfAfterCharsNumber > 0) {
      afterElement = this.findNextTextNodeInDomTree(afterElement);
      if (!afterElement) break;

      const nodeText = this.getInnerText(afterElement);
      if (nodeText.length > totalNumberOfAfterCharsNumber) {
        textAfter += nodeText.substring(0, totalNumberOfAfterCharsNumber);
        break;
      }

      textAfter += nodeText;
      totalNumberOfAfterCharsNumber -= nodeText.length;
    }

    return [textBefore, textAfter];
  }

  /**
   * 绘制高亮
   * @param serializedRange
   * @param errorCallback
   * @returns
   */
  public paint(
    serializedRange: SerializedRange,
    errorCallback?: (errorLog: any) => void
  ): any {
    if (!serializedRange) {
      return;
    }
    this.batchPaint([serializedRange]);
    return {};
  }

  /**
   * 批量化进行绘制
   * @param serializedRange
   */
  public batchPaint(serializedRanges: SerializedRange[]) {
    const errors = {} as any;
    // 获取反序列化之后的range对象
    const { results: deserializedRanges, errors: deserializedRangeErrors } =
      this.batchDeserializeRange(serializedRanges);
    for (let i = 0; i < serializedRanges.length; i++) {
      if (deserializedRangeErrors[i]) {
        errors[i] = deserializedRangeErrors[i];
        continue;
      }
      const uid = serializedRanges[i].uid;
      const color = serializedRanges[i].color;
      const range = deserializedRanges[i];
      if (!range.collapsed) {
        const setElementHighlightIdAttribute = (element: HTMLElement) => {
          element.setAttribute(AttributeNameHighlightId, uid);
          element.setAttribute(AttributeNameHighlightColor, color);
        };
        try {
          (() => {
            // 单节点的情况
            if (range.startContainer === range.endContainer) {
              if (range.startOffset === range.endOffset) {
                return; // 空范围跳过
              }
              const word = (<Text>range.startContainer).splitText(
                range.startOffset
              );
              word.splitText(range.endOffset);
              setElementHighlightIdAttribute(
                this.convertTextNodeToHighlightElement(word)
              );
              return;
            }
            // 情况2: 跨多个节点的选择
            const toPaint = [];

            // 处理起始节点
            let ptr = (<Text>range.startContainer).splitText(
              range.startOffset
            ) as Node | null;
            toPaint.push(ptr);

            // 收集中间所有文本节点
            while (true) {
              ptr = this.findNextTextNodeInDomTree(ptr);
              if (ptr === range.endContainer) {
                break;
              }
              toPaint.push(ptr);
            }

            // 处理结束节点
            (<Text>range.endContainer).splitText(range.endOffset);
            toPaint.push(range.endContainer);
            toPaint.forEach((item) => {
              if (item) {
                let decoratedElement =
                  this.convertTextNodeToHighlightElement(item);
                setElementHighlightIdAttribute(decoratedElement);

                if (!decoratedElement.innerText) {
                  decoratedElement.parentElement?.insertBefore(
                    item,
                    decoratedElement.nextSibling
                  );
                  decoratedElement.parentElement?.removeChild(decoratedElement);
                }
              }
            });
          })();
          this.paintHighlights(uid);
        } catch (error) {}
      }
    }
  }

  /**
   * 遍历绘制高亮
   * @param highlightId
   */
  public paintHighlights(highlightId: string) {
    let context = {
      serializedRange: this.state.uidToSerializedRange[highlightId],
      marker: this,
    };
    for (let element of this.resolveHighlightElements(highlightId)) {
      this._highlightPainter.paintHighlight(context, element);
    }
  }

  /**
   * 取消高亮
   * @param id
   */
  public unPaint(id: string) {
    for (const element of this.resolveHighlightElements(id)) {
      let childNodes = Array.from(element.childNodes);
      for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        element.parentNode?.insertBefore(childNode, element);
      }
      element.parentNode?.removeChild(element);
    }
  }

  /**
   * 获取到同一高亮ID的所有标签
   * @param highlightId
   * @returns
   */
  private resolveHighlightElements(highlightId: string): HTMLElement[] {
    let elements: HTMLElement[] = [];
    for (let item of Array.from(
      this._document.getElementsByTagName(HighlightTagName)
    )) {
      if (item.getAttribute(AttributeNameHighlightId) === highlightId) {
        elements.push(item as HTMLElement);
      }
    }
    return elements;
  }

  /**
   * 移动word节点到高亮标签下
   * @param word
   * @returns
   */
  private convertTextNodeToHighlightElement(word: Node) {
    const decoratedElement = this._document.createElement(HighlightTagName);
    word.parentElement?.insertBefore(decoratedElement, word.nextSibling);
    decoratedElement.appendChild(word);
    return decoratedElement;
  }

  /**
   * 反序列化数据
   * @param serializedRanges
   */
  private batchDeserializeRange(serializedRanges: SerializedRange[]) {
    this._document.head.appendChild(blackListedElementStyle);
    // 获取根元素的文本内容
    const rootText = this.normalizeText(this.getInnerText(this._rootElement));
    const results = {} as any;
    const errors = {} as any;
    for (let i = 0; i < serializedRanges.length; i++) {
      try {
        const sr = serializedRanges[i];
        this.state.uidToSerializedRange[serializedRanges[i].uid] = sr;
        const offset = this.resolveSerializedRangeOffsetInText(rootText, sr);
        const start = this.findElementAtOffset(this._rootElement, offset);
        const end = this.findElementAtOffset(
          this._rootElement,
          offset + this.normalizeText(sr.text).length
        );
        const range = this._document.createRange();
        range.setStart(
          start.element,
          this.getRealOffset(start.element, start.offset)
        );

        range.setEnd(end.element, this.getRealOffset(end.element, end.offset));
        // 可省略
        this.trimRangeSpaces(range);
        results[i] = range;
      } catch (error) {
        errors[i] = error;
      }
    }
    this._document.head.removeChild(blackListedElementStyle);
    return {
      results,
      errors,
    };
  }

  /**
   * 去除range对象两端的空格
   * @param range
   */
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

  /**
   * 递归查找目标元素和便宜值
   * @param root
   * @param offset
   * @returns
   */
  private findElementAtOffset(
    root: Node,
    offset: number
  ): { element: Node; offset: number } {
    if (root.nodeType === Node.TEXT_NODE) {
      return {
        element: root,
        offset,
      };
    }
    const childNodes = Array.from(root.childNodes).filter((node) => {
      return !this.isBlackListedElementNode(node);
    });

    let cumulativeOffset = 0;
    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      const childText = this.normalizeText(this.getInnerText(child));
      const childLength = childText.length;
      const childStartOffset = cumulativeOffset;
      const childEndOffset = cumulativeOffset + childLength;
      if (offset >= childStartOffset && offset < childEndOffset) {
        // 计算子节点内的相对偏移量
        const relativeOffset = offset - childStartOffset;
        return this.findElementAtOffset(child, relativeOffset);
      }
      cumulativeOffset = childEndOffset;
    }
    if (childNodes.length > 0) {
      const lastChild = childNodes[childNodes.length - 1];
      const lastText = this.normalizeText(this.getInnerText(lastChild));
      return {
        element: lastChild,
        offset: lastText.length,
      };
    }
    return { element: root, offset: 0 };
  }

  /**
   * 获取DOM节点具体的偏移值
   * @param textNode
   * @param offset
   * @returns
   */
  private getRealOffset(textNode: Node, offset: number) {
    let cumulative = 0;
    const s = textNode.textContent || "";
    for (let i = 0; i < s.length; i++) {
      while (i < s.length && !this.normalizeText(s.substr(i, 1))) {
        // omit whitespaces
        i++;
      }
      if (cumulative === offset) {
        return i;
      }
      cumulative++;
    }
    if (cumulative === offset) {
      return s.length;
    }
    throw new Error("failed to get real offset");
  }

  /**
   * 查找标准化文本中的起始偏移量
   * @param rootText
   * @param serializedRange
   * @returns
   */
  private resolveSerializedRangeOffsetInText(
    rootText: string,
    serializedRange: SerializedRange
  ) {
    const { textBefore, text, textAfter } = serializedRange;
    const textBeforeNormalized = this.normalizeText(textBefore);
    const textNormalized = this.normalizeText(text);
    const textAfterNormalized = this.normalizeText(textAfter);
    for (const strategy of this.resolveSerializedRangeOffsetInTextStrategies) {
      const textBeforeToSearch = strategy.textBefore
        ? textBeforeNormalized
        : "";
      const textAfterToSearch = strategy.textAfter ? textAfterNormalized : "";
      const textToSearch =
        textBeforeToSearch + textNormalized + textAfterToSearch;
      const index = rootText.indexOf(textToSearch);
      if (index > 0) {
        return index + (strategy.textBefore ? textBeforeNormalized.length : 0);
      }
    }
  }

  private buildContext(highlightId: string): EventHandlerContext {
    return {
      serializedRange: this.state.uidToSerializedRange[highlightId],
      marker: this,
    };
  }

  /**
   * 开启事件监听
   */
  public addEventListeners() {
    let events = ["click", "mouseenter", "mouseleave"];
    const _eventHandler = (event: Event) => {
      if (
        !event.target ||
        !(event.target instanceof (this._window as any).HTMLElement)
      ) {
        return;
      }
      const target = event.target as HTMLElement;
      const id = target.getAttribute(AttributeNameHighlightId);
      if (!id) {
        return;
      }
      const allElements: HTMLElement[] = this.normalizeElements(
        id,
        this.resolveHighlightElements(id)
      );
      if (allElements.length === 0) return;
      if (event.type === "click") {
        if (!this._eventHandler.onHighlightClick) return;
        this._eventHandler.onHighlightClick(
          this.buildContext(id),
          allElements,
          event
        );
      }
      if (event.type === "mouseenter") {
        if (!this._eventHandler.onHighlightHover) return;
        this._eventHandler.onHighlightHover(
          this.buildContext(id),
          allElements,
          event
        );
      }

      if (event.type === "mouseleave") {
        if (!this._eventHandler.onHighlightLeave) return;
        this._eventHandler.onHighlightLeave(
          this.buildContext(id),
          allElements,
          event
        );
      }
    };
    for (const event of events) {
      this._rootElement.addEventListener(event, _eventHandler, true);
    }
  }
}

export type MarkerInstanceType = InstanceType<typeof Marker>;
