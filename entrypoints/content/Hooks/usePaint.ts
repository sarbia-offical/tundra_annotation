import { useCallback } from "react";
import { makeid } from "@/lib/Utils";
import { MarkerInstanceType } from "@/lib/Marks/Marker";
import { useMarkContext } from "../state/hooks";
import { MarkState } from "../state/type";

/**
 * 对选中的文字区块进行高亮处理
 * @returns
 */
export const useTextHighlighter = () => {
  const markState = useMarkContext((state: MarkState) => ({
    changeColor: state.changeColor,
    changeAnnotations: state.changeAnnotations,
  }));
  const highlight = useCallback(
    (color: string, markerInstance: MarkerInstanceType, createDate: number) => {
      if (!color || !markerInstance) return;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const uid = makeid();
      const serializedRange = markerInstance.serializeRange(range, {
        color,
        uid,
        createDate,
      });
      if (!serializedRange) return;
      markState.changeAnnotations(uid, serializedRange);
      markState.changeColor("");
      markerInstance.paint(serializedRange);
      return serializedRange;
    },
    []
  );

  return { highlight };
};
