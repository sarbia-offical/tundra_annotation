import React from "react";
import { useSwitchContext, useSwitchDispatch } from "./SwitchContext";
import { SwitchItem } from "./SwitchItem";
import { cn } from "@/lib/utils";
import {
  ActionType,
  RadioOptionConfig,
  SwitchRef,
  SwitchType,
} from "./SwitchTypes";
import { useSwitch } from "./useSwitch";
import { Highlighter } from "./Highlighter";
interface SwitchContainerProps {
  children?: React.ReactNode;
}
const SwitchContainer = React.forwardRef<HTMLDivElement, SwitchContainerProps>(
  ({ children }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const radioRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const switchState = useSwitchContext();
    const dispatch = useSwitchDispatch();
    const { activeIndex } = useSwitch();
    const { options, className, activeValue, switchType, onValueChange } =
      switchState;

    React.useImperativeHandle(
      ref,
      () => {
        if (!containerRef.current) {
          return {} as SwitchRef;
        }
        return {
          ...containerRef.current,
          reset: () => {
            console.log("reset called");
          },
          switch: (value: string) => {
            dispatch({ type: ActionType.SWITCH, value });
          },
        } as SwitchRef;
      },
      [dispatch]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!e.defaultPrevented) {
          let newIndex = activeIndex;
          switch (e.key) {
            case "ArrowDown":
            case "ArrowRight":
              e.preventDefault();
              newIndex = (activeIndex + 1) % options.length;
              break;
            case "ArrowUp":
            case "ArrowLeft":
              e.preventDefault();
              newIndex = (activeIndex - 1 + options.length) % options.length;
              break;
            default:
              return; // 不处理其他按键
          }
          const value = options[newIndex].value;
          // 分发切换动作
          dispatch({
            type: ActionType.SWITCH,
            value,
          });

          // 手动设置焦点到新的选项
          radioRefs.current[newIndex]?.focus();
          onValueChange(value);
        }
      },
      [activeValue, options, activeIndex, dispatch]
    );

    const updateToggle = React.useCallback(() => {
      const selected = radioRefs.current[activeIndex];
      const container = containerRef.current;
      if (!selected || !container) return;

      const containerStyle = window.getComputedStyle(container);
      const borderLeft = parseFloat(containerStyle.borderLeftWidth);
      const borderTop = parseFloat(containerStyle.borderTopWidth);

      // 使用 offsetLeft/offsetTop 获取相对于偏移父元素的位置
      const selectedWidth = selected.offsetWidth;
      const selectedHeight = selected.offsetHeight;

      // 高亮器比元素小 2px（每边各 1px）
      const highlighterWidth = selectedWidth - 2;
      const highlighterHeight = selectedHeight - 2;

      // 使用 left 和 top 进行定位，避免 transform 被覆盖
      const left = selected.offsetLeft - borderLeft + 1;
      const top = selected.offsetTop - borderTop + 1;
      dispatch({
        type: ActionType.HIGHLIGHTERSTYLE,
        value: {
          height: highlighterHeight,
          width: highlighterWidth,
          left: `${left}px`,
          top: `${top}px`,
        },
      });
    }, [activeIndex]);

    React.useEffect(() => {
      updateToggle();
    }, [updateToggle]);

    React.useEffect(() => {
      const resizeObserver = new ResizeObserver(updateToggle);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => resizeObserver.disconnect();
    }, [updateToggle]);

    return (
      <div
        className={cn(
          className,
          "rounded-xl border relative gap-2 p-2",
          switchType === SwitchType.Horizontal ? "flex" : "flex flex-col"
        )}
        role="radiogroup"
        aria-label="Fancy switch options"
        ref={containerRef}
        onKeyDown={handleKeyDown}
      >
        <Highlighter />
        {options.map((ele: RadioOptionConfig, index: number) => (
          <SwitchItem
            ref={(el) => {
              radioRefs.current[index] = el;
            }}
            item={ele}
            key={index}
          />
        ))}
        <div className="sr-only" aria-live="polite">
          {options[activeIndex]?.label} selected
        </div>
        {children ? children : <></>}
      </div>
    );
  }
);
SwitchContainer.displayName = "SwitchContainer";
export { SwitchContainer };
