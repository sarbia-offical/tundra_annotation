import React, {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  SidebarProps,
  SidebarBackdropProps,
  SidebarContentProps,
  SidebarHeaderProps,
  SidebarBodyProps,
  SidebarPosition,
} from "./Sidebar.type";
import { SidebarProvider, useSidebarContext } from "./Sidebar.context";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Button } from "../button";
import { X } from "lucide-react";

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  showCloseButton = true,
  position = "right",
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const isClosingRef = useRef(false);

  useEffect(() => {
    setInternalOpen(isOpen);
    isClosingRef.current = !isOpen;
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
    <SidebarProvider
      value={{
        isOpen: internalOpen,
        onClose: handleClose,
        closeOnOverlayClick,
        showCloseButton,
        position,
        onAnimationComplete: handleAnimationComplete,
      }}
    >
      {children}
    </SidebarProvider>
  );
};
Sidebar.displayName = "Sidebar";

export const SidebarBackdrop = forwardRef<HTMLDivElement, SidebarBackdropProps>(
  ({ className, onClick }, ref) => {
    const { isOpen, onClose, closeOnOverlayClick } = useSidebarContext();

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick) {
        onClose();
      }
      onClick?.(e);
    };

    return (
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={ref}
            key="sidebar-backdrop"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
            className={cn(
              "bg-black/50 fixed inset-0 z-[999] backdrop-blur-sm",
              className
            )}
          />
        ) : null}
      </AnimatePresence>
    );
  }
);
SidebarBackdrop.displayName = "SidebarBackdrop";

/**
 * 根据侧边栏位置获取动画配置
 */
const getAnimationVariants = (position: SidebarPosition) => {
  const variants = {
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    top: {
      initial: { y: "-100%" },
      animate: { y: 0 },
      exit: { y: "-100%" },
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
    },
  };

  return variants[position];
};

/**
 * 根据侧边栏位置获取样式类名
 */
const getPositionClassName = (position: SidebarPosition) => {
  const classNames = {
    left: "left-0 top-0 h-full w-96 max-w-[80vw]",
    right: "right-0 top-0 h-full w-96 max-w-[80vw]",
    top: "top-0 left-0 w-full h-96 max-h-[80vh]",
    bottom: "bottom-0 left-0 w-full h-96 max-h-[80vh]",
  };

  return classNames[position];
};

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children }, ref) => {
    const { isOpen, onAnimationComplete, position } = useSidebarContext();
    const shadowRoot =
      typeof window !== "undefined"
        ? document.querySelector("tundra-annotation")?.shadowRoot
        : null;

    const animationVariants = getAnimationVariants(position);
    const positionClassName = getPositionClassName(position);

    const content = (
      <AnimatePresence mode="wait" onExitComplete={onAnimationComplete}>
        {isOpen && (
          <motion.div
            ref={ref}
            key="sidebar-content"
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            exit={animationVariants.exit}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed z-[1000]",
              "border-ctx-primary-inverse/20 shadow-lg",
              "bg-ctx-primary",
              positionClassName,
              // 根据位置添加边框
              position === "left" && "border-r",
              position === "right" && "border-l",
              position === "top" && "border-b",
              position === "bottom" && "border-t",
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
SidebarContent.displayName = "SidebarContent";

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { onClose, showCloseButton } = useSidebarContext();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-4 border-b border-ctx-primary-inverse/20",
          "bg-popover text-popover-foreground p-4",
          className
        )}
        {...props}
      >
        <div className="flex-1 mr-2">{children}</div>
        {showCloseButton && (
          <Button
            size="iconMini"
            variant="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </Button>
        )}
      </div>
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarBody = forwardRef<HTMLDivElement, SidebarBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-4 bg-popover text-popover-foreground h-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarBody.displayName = "SidebarBody";
