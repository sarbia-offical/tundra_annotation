export interface SerializedRange {
  uid: string;
  textBefore: string;
  textAfter: string;
  text: string;
  pageData: Record<string, any>;
  startOffset: number;
  endOffset: number;
  color: string;
  createDate: number;
}
export interface Context {
  serializedRange: SerializedRange;
}
export interface HighlightPainter {
  paintHighlight: (context: Context, element: HTMLElement) => void;
}

export interface EventHandlerContext {
  serializedRange: SerializedRange;
  marker: any;
}

export interface EventHandler {
  onHighlightClick: (
    context: Context,
    element: HTMLElement[],
    e: Event
  ) => void;
  onHighlightHover?: (
    context: Context,
    element: HTMLElement[],
    e: Event
  ) => void;
  onHighlightLeave?: (
    context: Context,
    element: HTMLElement[],
    e: Event
  ) => void;
}

export const defaultCharsToKeepForTextBeforeAndTextAfter = 128;
export const HighlightBlacklistedElementClassName =
  "web-marker-black-listed-element";

export const AttributeNameHighlightId = "highlight-id";
export const AttributeNameHighlightColor = "highlight-color";
export const HighlightTagName = "web-marker-highlight";
export const cancelTruncation = "cancel-truncation";
export const HighlightClassName = "annotate-highlighted-text";
export const HightlightHover = "annotate-highlighted-text-hover";
