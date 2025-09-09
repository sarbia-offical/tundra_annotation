import { NotesProps } from "@/services/api.type";

export interface SerializedRange {
  uid: string;
  data: Record<string, any> & NotesProps;
  textBefore: string;
  text: string;
  textAfter: string;
  pageData: Record<string, any>;
  startContainerPath: string[];
  endContainerPath: string[];
  startOffset: number;
  endOffset: number;
  color: string;
  createDate: number;
  updateDate?: number;
}

export interface Context {
  serializedRange: SerializedRange;
  marker: any;
}

export interface HighlightPainter {
  paintHighlight: (context: Context, element: HTMLElement) => void;
  beforePaintHighlight?: (context: Context) => void;
  afterPaintHighlight?: (context: Context) => void;
}

export interface EventHandler {
  onHighlightClick?: (context: Context, element: HTMLElement, e: Event) => void;
  onHighlightHoverStateChange?: (
    context: Context,
    element: HTMLElement,
    hovering: boolean,
    e: Event
  ) => void;
}

export class DeserializationError extends Error {}

export function isDeserializationError(err: Error): boolean {
  return err instanceof DeserializationError;
}

export const HighlightTagName = "web-marker-highlight";
export const HighlightBlacklistedElementClassName =
  "web-marker-black-listed-element";
export const AttributeNameHighlightId = "highlight-id";
export const AttributeNameHighlightColor = "highlight-color";
export const defaultCharsToKeepForTextBeforeAndTextAfter = 128;
export const annotationWrapper = "annotationWrapper";
export const cancelTruncation = "cancelTruncation";
export const HighlightClassName = "annotate-highlighted-text";
