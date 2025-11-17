import { useTextHighlighter } from "../hooks/usePaint";
import { useCurrentmark } from "../store/store.hooks";
import { Marker } from "@/lib/Marks/Marker";
import { useMarkOperations } from "@/store/markStore";

export const useColorHighlight = (markRef: React.RefObject<Marker | null>) => {
  const { highlight, repaint } = useTextHighlighter();
  const { addMark, updateMark, removeMark } = useMarkOperations();
  const { currentMark, setCurrentMark, clearCurrentMark } = useCurrentmark();

  // 监听颜色的变化
  const setColor = useCallback(
    (color: string) => {
      if (!markRef.current) return;

      // 特殊处理：取消颜色 (cancel)
      if (color === "cancel") {
        if (currentMark) {
          // 移除当前标记
          markRef.current.unPaint(currentMark.uid);
          // 清空 currentMark
          clearCurrentMark();
          removeMark(currentMark.uid);
        }
        return;
      }

      if (!color) return;

      // 如果有 currentMark，重新绘制已有标记
      if (currentMark) {
        const updatedMark = repaint(color, currentMark, markRef.current);
        if (updatedMark) {
          updateMark(updatedMark);
          setCurrentMark(updatedMark);
        }
        return;
      }

      // 如果没有 currentMark，创建新的标记
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const nodeName = range.commonAncestorContainer.nodeName;

      if (color && nodeName.toLowerCase() !== "body") {
        const serializedRange = highlight(color, markRef.current);
        if (serializedRange) {
          setCurrentMark(serializedRange);
          addMark(serializedRange);
        }
      } else if (color) {
        console.log("请先选取文本");
      }
    },
    [currentMark, markRef, highlight, repaint, setCurrentMark, clearCurrentMark]
  );

  return { setColor };
};
