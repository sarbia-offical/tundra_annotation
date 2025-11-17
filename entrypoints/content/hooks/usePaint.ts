import { MarkerInstanceType } from "@/lib/Marks/Marker";
import { SerializedRange } from "@/lib/Marks/Mark.type";
import { makeid } from "@/lib/utils";

/**
 * 对选中的文字区块进行高亮处理
 * @returns
 */
export const useTextHighlighter = () => {
  /**
   * 创建新的高亮标记
   */
  const highlight = useCallback(
    (color: string, markerInstance: MarkerInstanceType) => {
      if (!color || !markerInstance) return;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const uid = makeid();
      const date = Date.now();
      console.log("date", date);
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

  /**
   * 重新绘制已有的标记（更新颜色）
   */
  const repaint = useCallback(
    (
      color: string,
      currentMark: SerializedRange,
      markerInstance: MarkerInstanceType
    ) => {
      if (!color || !currentMark || !markerInstance) return;

      // 创建更新后的 mark
      const updatedMark: SerializedRange = {
        ...currentMark,
        color,
      };

      // 先移除旧的高亮元素
      markerInstance.unPaint(currentMark.uid);
      // 重新绘制新颜色的标记
      markerInstance.paint(updatedMark);

      return updatedMark;
    },
    []
  );

  return { highlight, repaint };
};
