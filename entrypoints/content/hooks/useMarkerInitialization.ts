import { useState, useRef, useEffect } from "react";
import { useSelection } from "./useSelection";
import { useMarker } from "./useMarker";
import { HightlightHover, Context } from "@/lib/Marks/Mark.type";
import { Marker } from "@/lib/Marks/Marker";
import { applyHighlightStyle, createWavyLines } from "@/lib/utils";
import { useCurrentmark } from "../store/store.hooks";

export const useMarkerInitialization = () => {
  const markRef = useRef<Marker | null>(null);
  const { startObserver } = useSelection();
  const [buildMarker] = useMarker();

  // 通过 uid 切换高亮元素的 hover 状态
  const toggleHighlightHover = (uid: string | undefined, isHover: boolean) => {
    if (!uid) return;

    const elements = document.querySelectorAll(`[highlight-id="${uid}"]`);

    if (elements && elements.length > 0) {
      elements.forEach((ele: Element) => {
        if (ele instanceof HTMLElement) {
          if (isHover) {
            ele.classList.add(HightlightHover);
          } else {
            ele.classList.remove(HightlightHover);
          }
        }
      });
    }
  };

  // 启动高亮
  useEffect(() => {
    startObserver();
    const marker = buildMarker(
      {
        paintHighlight: (context: Context, element: HTMLElement) => {
          const bgc = context?.serializedRange?.color || "#ffff00";
          const wavyBg = createWavyLines(bgc);
          applyHighlightStyle(element, bgc, wavyBg);
        },
      },
      {
        onHighlightClick: (
          context: Context,
          allElements: HTMLElement[],
          e: Event
        ) => {
          if (allElements && allElements.length > 0) {
            console.log("onHighlightClick", context);
            console.log("allElements", allElements);
          }
        },
        // 实现鼠标hover，底部波浪线滚动的效果
        onHighlightHover(
          context: Context,
          _allElements: HTMLElement[],
          _e: Event
        ) {
          toggleHighlightHover(context?.serializedRange?.uid, true);
        },
        // 实现鼠标移出，取消底部波浪线滚动的效果
        onHighlightLeave(
          context: Context,
          _allElements: HTMLElement[],
          _e: Event
        ) {
          toggleHighlightHover(context?.serializedRange?.uid, false);
        },
      }
    );
    marker.addEventListeners();
    markRef.current = marker;
  }, [startObserver, buildMarker]);

  return {
    markRef,
  };
};
