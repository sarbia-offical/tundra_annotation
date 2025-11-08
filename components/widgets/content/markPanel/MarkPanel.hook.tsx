import { useCallback } from "react";
import { useMarkPanelContext } from "./MarkPanel.context";
import { useAllMarks, useMarkOperations } from "@/store/markStore";
import type { SerializedRange } from "@/lib/Marks/Mark.type";

export const useMarkPanelData = () => {
  const { state, onClose, markRef } = useMarkPanelContext();
  const allMarks = useAllMarks();
  const { removeMark } = useMarkOperations();

  // 处理标记点击
  const handleMarkClick = useCallback((mark: SerializedRange) => {
    // 根据 mark 的 uid 查找对应的元素并滑动到该位置
    const element = document.querySelector(`[highlight-id="${mark.uid}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - 100; // 偏移 100px 以便更好地显示

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // 处理标记删除
  const handleMarkRemove = useCallback(
    (uid: string) => {
      removeMark(uid);
      // 同时从 DOM 中移除高亮
      if (markRef.current) {
        markRef.current.unPaint(uid);
      }
    },
    [removeMark, markRef]
  );

  return {
    isOpen: useMemo(() => state.isOpen, [state.isOpen]),
    onClose,
    allMarks,
    handleMarkClick,
    handleMarkRemove,
  };
};
