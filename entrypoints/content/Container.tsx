import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "@/assets/tailwind.css";
import { TranslationPanel } from "@/components/widgets/content/translationPanel";
import { ColorSelector } from "@/components/widgets/content/colorSelector";
import {
  MarkPanel,
  MarkPanelTrigger,
} from "@/components/widgets/content/markPanel";
import {
  usePopoverPosition,
  usePopoverVisibility,
  useTranslationText,
  useCurrentmark,
} from "./store/store.hooks";
import { useMarkerInitialization } from "./hooks/useMarkerInitialization";
import { useColorHighlight } from "./hooks/useHighlight";
import { cancelableApi } from "@/service/newapi";
import { useConfigEffect } from "@/store/configStore/useConfigEffect";
import { MarkStoreProvider } from "@/store/markStore";

interface DynamicComponentProps {
  id: string;
}
const DynamicComponent: React.FC<DynamicComponentProps> = ({ id }) => {
  const handleCancelRef = useRef<() => void>(() => {});
  const [returnedColor, setReturnedColor] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      // 立即获取 cancel 函数，而不是 await
      const { response, cancel } = cancelableApi.get(
        `/api/race-condition-test`,
        {
          color: id,
        }
      );
      // 立即保存 cancel 函数
      handleCancelRef.current = cancel;

      try {
        const data = await response;
        setReturnedColor(data.data.color);
        console.log("fetchData");
      } catch (error) {
        // 请求被取消或其他错误
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("请求失败:", error);
        }
      }
    };
    fetchData();
    return () => {
      handleCancelRef.current();
    };
  }, [id]);
  return (
    <div
      style={{
        color: returnedColor,
      }}
    >
      xxx
    </div>
  );
};

const Container: React.FC = () => {
  const { to } = useConfigEffect(true);
  const { markRef } = useMarkerInitialization();
  const { isVisible, hidePopover } = usePopoverVisibility();
  const { clearCurrentMark } = useCurrentmark();
  const { setColor } = useColorHighlight(markRef);
  const { translationText } = useTranslationText();
  const { popoverPosition } = usePopoverPosition();

  // MarkPanel 状态
  const [isMarkPanelOpen, setIsMarkPanelOpen] = useState(false);

  // 关闭 popover 时清空 currentMark
  const handleClosePopover = useCallback(() => {
    hidePopover();
    clearCurrentMark();
  }, [hidePopover, clearCurrentMark]);

  const handleColorChange = useCallback(
    (value: string) => {
      setColor(value);
    },
    [setColor]
  );

  const colorSelectorElement = useMemo(
    () => <ColorSelector onValueChange={handleColorChange} />,
    [handleColorChange]
  );

  return (
    <div>
      {/* 翻译&颜色选择面板 */}
      <TranslationPanel
        translateText={translationText}
        isPopoverOpen={isVisible}
        position={popoverPosition}
        to={to}
        closePopover={handleClosePopover}
      >
        {colorSelectorElement}
      </TranslationPanel>

      {/* 打开标记面板按钮 */}
      <MarkPanelTrigger
        onClick={() => setIsMarkPanelOpen((prev) => !prev)}
        className="fixed right-4 bottom-4 z-[9999] rounded-full shadow-lg"
      />

      {/* 标记面板 */}
      <MarkPanel
        isOpen={isMarkPanelOpen}
        onClose={() => setIsMarkPanelOpen(false)}
        markRef={markRef}
      />
    </div>
  );
};
Container.displayName = "Container";
export { Container };
