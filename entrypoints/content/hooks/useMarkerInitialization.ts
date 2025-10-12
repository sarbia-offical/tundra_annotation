import { useState, useRef, useEffect } from "react";
import { useSelection } from "./useSelection";
import { useMarker } from "./useMarker";
import { HightlightHover, Context } from "@/lib/Marks/Mark.type";
import { Marker } from "@/lib/Marks/Marker";
import { applyHighlightStyle, createWavyLines } from "@/lib/utils";

export const useMarkerInitialization = () => {
  const markRef = useRef<Marker | null>(null);
  const { startObserver } = useSelection();
  const [buildMarker] = useMarker();

  // 启动高亮
  useEffect(() => {
    startObserver();
    if (!markRef.current) {
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
              const { scrollX, scrollY } = window;
              const rect =
                allElements[allElements.length - 1].getClientRects()[0];
              console.log(context.serializedRange.text);
            }
          },
          onHighlightHover(
            context: Context,
            allElements: HTMLElement[],
            e: Event
          ) {
            if (allElements && allElements.length > 0) {
              allElements.forEach((ele: HTMLElement) => {
                ele.classList.add(HightlightHover);
              });
            }
          },
          onHighlightLeave(
            context: Context,
            allElements: HTMLElement[],
            e: Event
          ) {
            if (allElements && allElements.length > 0) {
              allElements.forEach((ele: HTMLElement) => {
                ele.classList.remove(HightlightHover);
              });
            }
          },
        }
      );
      marker.addEventListeners();
      markRef.current = marker;
    }
  }, [startObserver, buildMarker]);

  return {
    markRef,
  };
};
