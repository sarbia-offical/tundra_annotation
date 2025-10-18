import { useTextHighlighter } from "../hooks/usePaint";
import { useCurrentmark } from "../store/store.hooks";
import { useNotification } from "@/components/ui/notification/notification.hooks";
import { Marker } from "@/lib/Marks/Marker";

export const useColorHighlight = (markRef: React.RefObject<Marker | null>) => {
  const { highlight } = useTextHighlighter();
  const notification = useNotification();
  const { setCurrentMark } = useCurrentmark();
  // 监听颜色的变化
  const setColor = useCallback(
    (color: string) => {
      if (!color || !markRef.current) return;
      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const nodeName = range.commonAncestorContainer.nodeName;
      if (color && nodeName.toLowerCase() !== "body") {
        const serializedRange = highlight(color, markRef.current);
        if (serializedRange) {
          setCurrentMark(serializedRange);
        }
      } else if (color) {
        notification.info("请先选取文本");
      }
    },
    [markRef.current, highlight]
  );

  return { setColor };
};
