import React, { useLayoutEffect } from "react";
import "@/assets/tailwind.css";
import { TranslationPanel } from "@/components/widgets/content/translationPanel";
import { useDisplaySettings } from "@/store/store.hooks";
import { useTranslation } from "react-i18next";
import { ColorSelectionBox } from "./components/ColorSelectionBox";
import { useColor, useTranslationPopoverVisibility } from "./store/store.hooks";
import { useSelection } from "./hooks/useSelection";
import { useMarker } from "./hooks/useMarker";
import { useTextHighlighter } from "./hooks/usePaint";
import { HightlightHover, Context } from "@/lib/Marks/Mark.type";
import moment from "moment";
import { applyHighlightStyle, createWavyLines } from "@/lib/utils";
import { Marker } from "@/lib/Marks/Marker";
import { PopoverPositionType } from "@/components/widgets/content/translationPanel/translationPanel.type";
import { updatePopoverPosOnSelectionChange } from "@/lib/SelectionObserver";

const Container: React.FC = () => {
  const [position, setPosition] = useState<PopoverPositionType>({
    x: 0,
    y: 0,
  });
  const markRef = useRef<Marker | null>(null);
  const prevPositionRef = useRef<PopoverPositionType>({
    x: 0,
    y: 0,
  });
  const [translationText, setTranslationText] = useState<string>("");
  const { i18n } = useTranslation();
  const { color, setColor } = useColor();
  const [startObserver] = useSelection();
  const [buildMarker] = useMarker();
  const { highlight } = useTextHighlighter();
  const { isVisible, showTranslationPopover, hideTranslationPopover } =
    useTranslationPopoverVisibility();
  const { defaultConfiguration } = useDisplaySettings();
  const { theme, systemLanguage } = defaultConfiguration;
  /**
   * 监听系统语言的变化
   */
  useEffect(() => {
    const callback = async () => {
      await i18n.changeLanguage(systemLanguage);
    };
    callback();
  }, [systemLanguage]);

  /**
   * 启动高亮
   */
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
            // const { uid } = context.serializedRange;
            // marker.unPaint(uid);
            hideTranslationPopover();
            if (allElements && allElements.length > 0) {
              const { scrollX, scrollY } = window;
              const rect =
                allElements[allElements.length - 1].getClientRects()[0];
              setTranslationText(context.serializedRange.text);
              setPosition({
                x: rect.right + scrollX - 70,
                y: rect.top + scrollY + 50,
              });
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
  }, [position]);

  /**
   * 监听颜色的变化
   */
  useEffect(() => {
    if (!color || !markRef.current) return;
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const nodeName = range.commonAncestorContainer.nodeName;
    if (color && nodeName.toLowerCase() !== "body") {
      const date = moment().valueOf();
      highlight(color, markRef.current, date);
    } else if (color) {
      console.log("color", color);
    }
    setColor("");
  }, [color, markRef.current]);

  /**
   * 监听dom的变化，修改翻译弹窗的位置和显隐
   */
  useLayoutEffect(() => {
    if (
      position.x !== prevPositionRef.current.x ||
      position.y !== prevPositionRef.current.y
    ) {
      showTranslationPopover();
      prevPositionRef.current = position;
    }
  }, [position]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {/* 高亮颜色选择器 */}
      <ColorSelectionBox />
      {/* 翻译面板 */}
      <TranslationPanel
        translateText={translationText}
        isPopoverOpen={isVisible}
        position={{ x: position.x, y: position.y }}
      />
    </div>
  );
};
Container.displayName = "Container";
export { Container };
