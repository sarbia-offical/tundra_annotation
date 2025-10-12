import { MarkerInstanceType } from "@/lib/Marks/Marker";
import { makeid } from "@/lib/utils";
import moment from "moment";
import { useCallback } from "react";

/**
 * 对选中的文字区块进行高亮处理
 * @returns
 */
export const useTextHighlighter = () => {
  const highlight = useCallback(
    (color: string, markerInstance: MarkerInstanceType) => {
      if (!color || !markerInstance) return;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const uid = makeid();
      const date = moment().valueOf();
      const serializedRange = markerInstance.serializeRange(range, {
        color,
        createDate: date,
        uid,
      });
      if (!serializedRange) return;
      markerInstance.paint(serializedRange);
      return serializedRange;
    },
    []
  );

  return { highlight };
};
