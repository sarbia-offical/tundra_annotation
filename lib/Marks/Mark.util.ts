import {
  AttributeNameHighlightId,
  HighlightBlacklistedElementClassName,
  HighlightTagName,
} from "./Mark.type";

/**
 * 判断这个节点是否为黑名单
 * @param element
 * @returns
 */
export const isBlackListedElementNode = (element: Node | null) => {
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
};

/**
 * 在兄弟节点中，找到上一个包含文本的节点
 * @param node
 * @returns
 */
export const findPreviousTextNodeInDomTree = (node: Node | null) => {
  while (node) {
    while (isBlackListedElementNode(node?.previousSibling || null)) {
      node = node?.previousSibling || null;
    }
    while (node?.previousSibling) {
      const candidate = findLastChildTextNode(node?.previousSibling || null);
      if (candidate) {
        return candidate;
      }
      node = node.previousSibling;
    }

    node = node?.parentElement || null;
  }
  return null;
};

/**
 * 在兄弟节点中，找到下一个包含文本的节点
 * @param node
 * @returns
 */
export const findNextTextNodeInDomTree = (node: Node | null) => {
  while (node) {
    /**
     * 跳过黑名单中的的兄弟节点
     */
    while (isBlackListedElementNode(node?.nextSibling || null)) {
      node = node?.nextSibling || null;
    }
    /**
     * 遍历兄弟节点，过滤黑名单兄弟节点，找到兄弟节点下的第一个文本节点
     */
    while (node?.nextSibling) {
      if (isBlackListedElementNode(node?.nextSibling)) {
        node = node.nextSibling;
        continue;
      }
      const candidate = findFirstChildTextNode(node.nextSibling);
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
};

/**
 * 在指定节点下，递归地寻找第一个文本节点。
 * @param node
 * @returns
 */
export const findFirstChildTextNode = (node: Node): Node | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node;
  }
  if (node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (isBlackListedElementNode(node.childNodes[i])) {
        continue;
      }
      const candidate = findFirstChildTextNode(node.childNodes[i]);
      if (candidate !== null) {
        return candidate;
      }
    }
  }
  return null;
};

/**
 * 在指定节点下，递归地最后第一个文本节点。
 * @param node
 * @returns
 */
export const findLastChildTextNode = (node: Node | null): Node | null => {
  if (!node) {
    return null;
  }
  if (node.nodeType === Node.TEXT_NODE) {
    return node;
  }
  if (node.childNodes) {
    for (let i = node.childNodes.length - 1; i >= 0; i--) {
      if (isBlackListedElementNode(node.childNodes[i])) {
        continue;
      }
      const candidate = findLastChildTextNode(node.childNodes[i]);
      if (candidate !== null) {
        return candidate;
      }
    }
  }
  return null;
};

/**
 * 递归获取节点内的所有文本
 * @param element
 * @returns
 */
export const getInnerText = (element: Node) => {
  if (isBlackListedElementNode(element)) {
    return "";
  }
  if (element.nodeType === Node.TEXT_NODE) {
    return element.textContent;
  } else {
    if (typeof (element as any).innerText === "undefined") {
      let result = "";
      for (let i = 0; i < element.childNodes.length; i++) {
        result += getInnerText(element.childNodes[i]);
      }
      return result;
    } else {
      return (element as any).innerText;
    }
  }
};

/**
 * 获取到同一高亮ID的所有标签
 * @param highlightId
 * @returns
 */
export const resolveHighlightElements = (
  highlightId: string,
  document: Document
): HTMLElement[] => {
  let elements: HTMLElement[] = [];
  for (let item of Array.from(
    document.getElementsByTagName(HighlightTagName)
  )) {
    if (item.getAttribute(AttributeNameHighlightId) === highlightId) {
      elements.push(item as HTMLElement);
    }
  }
  return elements;
};
