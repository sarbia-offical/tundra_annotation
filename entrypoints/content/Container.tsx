import React from "react";
import "@/assets/tailwind.css";
import { Button } from "@/components/ui/button";
import { useDisplaySettings } from "@/store/store.hooks";
import { useTranslation } from "react-i18next";
import { ColorSelectionBox } from "./components/ColorSelectionBox";
import { useColor, usePopoverVisibility } from "./store/store.hooks";
import { useSelection } from "./hooks/useSelection";
import { useMarker } from "./hooks/useMarker";
import { useTextHighlighter } from "./hooks/usePaint";
import { HightlightHover, Context } from "@/lib/Marks/Mark.type";
import moment from "moment";
import { applyHighlightStyle, createWavyLines } from "@/lib/utils";

const Container: React.FC = () => {
  const { defaultConfiguration } = useDisplaySettings();
  const { i18n } = useTranslation();
  const { color, setColor } = useColor();
  const [startObserver] = useSelection();
  const [markerInstance, buildMarker] = useMarker();
  const { highlight } = useTextHighlighter();
  const { theme, systemLanguage } = defaultConfiguration;
  useEffect(() => {
    const callback = async () => {
      await i18n.changeLanguage(systemLanguage);
    };
    callback();
  }, [systemLanguage]);

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
          element: HTMLElement[],
          e: Event
        ) => {
          const { uid } = context.serializedRange;
          marker.unPaint(uid);
        },
        onHighlightHover(
          context: Context,
          allElements: HTMLElement[],
          e: Event
        ) {
          allElements.forEach((ele: HTMLElement) => {
            ele.classList.add(HightlightHover);
          });
        },
        onHighlightLeave(
          context: Context,
          allElements: HTMLElement[],
          e: Event
        ) {
          allElements.forEach((ele: HTMLElement) => {
            ele.classList.remove(HightlightHover);
          });
        },
      }
    );
    marker.addEventListeners();
  }, []);

  useEffect(() => {
    if (!color || !markerInstance) return;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const nodeName = range.commonAncestorContainer.nodeName;
    if (color && nodeName.toLowerCase() !== "body") {
      const date = moment().valueOf();
      highlight(color, markerInstance, date);
    } else if (color) {
      console.log("color", color);
    }
    setColor("");
  }, [color, markerInstance]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {/* 高亮颜色选择器 */}
      <ColorSelectionBox />
    </div>
  );
};
Container.displayName = "Container";
export { Container };
