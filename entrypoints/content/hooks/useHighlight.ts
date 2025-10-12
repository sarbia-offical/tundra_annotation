import { useTextHighlighter } from "../hooks/usePaint";
import { Marker } from "@/lib/Marks/Marker";

export const useColorHighlight = (markRef: React.RefObject<Marker | null>) => {
  const { highlight } = useTextHighlighter();

  // 监听颜色的变化
  const setColor = useCallback(
    (color: string) => {
      if (!color || !markRef.current) return;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const nodeName = range.commonAncestorContainer.nodeName;
      if (color && nodeName.toLowerCase() !== "body") {
        highlight(color, markRef.current);
      } else if (color) {
        console.log("color", color);
      }
    },
    [markRef.current, highlight]
  );

  return { setColor };
};
