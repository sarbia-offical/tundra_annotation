import React, {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { PopoverProps, PopoverContentProps } from "./Popover.type";
import { PopoverProvider, usePopoverContext } from "./Popover.context";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

export const Popover: React.FC<PopoverProps> = ({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  position,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const isClosingRef = useRef(false);

  // 当外部 isOpen 变为 true 时，立即打开
  useEffect(() => {
    if (isOpen) {
      setInternalOpen(true);
      isClosingRef.current = false;
    }
  }, [isOpen]);

  // 处理关闭：先触发动画
  const handleClose = useCallback(() => {
    if (!isClosingRef.current) {
      isClosingRef.current = true;
      setInternalOpen(false);
    }
  }, []);

  // 动画完成后调用父组件的 onClose
  const handleAnimationComplete = useCallback(() => {
    if (isClosingRef.current && !internalOpen) {
      isClosingRef.current = false;
      onClose();
    }
  }, [onClose, internalOpen]);

  return (
    <PopoverProvider
      value={{
        isOpen: internalOpen,
        handleClose: handleClose,
        closeOnOutsideClick,
        position,
        onAnimationComplete: handleAnimationComplete,
      }}
    >
      {children}
    </PopoverProvider>
  );
};
Popover.displayName = "Popover";

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children }, ref) => {
    const {
      isOpen,
      handleClose,
      closeOnOutsideClick,
      position,
      onAnimationComplete,
    } = usePopoverContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const [isActuallyDragging, setIsActuallyDragging] = useState(false);

    // 计算拖拽边界约束
    const dragConstraints = useMemo(() => {
      if (typeof window === "undefined") return undefined;

      const scrollWidth = document.documentElement.scrollWidth;
      const scrollHeight = document.documentElement.scrollHeight;
      const popoverMinWidth = 500;
      const popoverMinHeight = 100;

      // 将 position 的值转换为数字
      const leftPos =
        typeof position?.left === "number"
          ? position.left
          : parseFloat(String(position?.left || 0)) || 0;
      const topPos =
        typeof position?.top === "number"
          ? position.top
          : parseFloat(String(position?.top || 0)) || 0;

      return {
        left: -leftPos,
        right: scrollWidth - leftPos - popoverMinWidth,
        top: -topPos,
        bottom: scrollHeight - topPos - popoverMinHeight,
      };
    }, [position, isOpen]);

    // 处理外部点击关闭
    useLayoutEffect(() => {
      if (!isOpen || !closeOnOutsideClick) return;

      const handleClickOutside = (event: MouseEvent) => {
        const path = event.composedPath();
        const isClickInsidePopover = path.some(
          (element) => element === contentRef.current
        );
        if (!isClickInsidePopover) {
          handleClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, closeOnOutsideClick, handleClose]);

    const shadowRoot =
      typeof window !== "undefined"
        ? document.querySelector("tundra-annotation")?.shadowRoot
        : null;

    const positionStyle = useMemo<React.CSSProperties>(
      () => ({
        position: "absolute",
        ...position,
      }),
      [position]
    );

    const content = (
      <AnimatePresence mode="wait" onExitComplete={onAnimationComplete}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            key="popover-content"
            drag
            dragConstraints={dragConstraints}
            dragMomentum={false}
            dragElastic={0.5}
            onDrag={() => setIsActuallyDragging(true)}
            onDragEnd={() => setIsActuallyDragging(false)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            style={{
              ...positionStyle,
              cursor: isActuallyDragging ? "grabbing" : "grab",
            }}
            className={cn(
              "z-[1000] rounded-lg border-[1px] border-ctx-primary-inverse/20 shadow-lg",
              "bg-popover text-popover-foreground p-4",
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );

    if (shadowRoot) {
      const body = shadowRoot.querySelector("body");
      if (body) {
        return createPortal(content, body);
      }
      return createPortal(content, document.body);
    }

    return createPortal(content, document.body);
  }
);
PopoverContent.displayName = "PopoverContent";
