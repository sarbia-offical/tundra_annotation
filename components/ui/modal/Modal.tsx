import React, {
  forwardRef,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  ModalProps,
  ModalBackdropProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
} from "./Modal.type";
import { ModalProvider, useModalContext } from "./Modal.context";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { Button } from "../button";
import { X } from "lucide-react";

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  closeOnOverlayClick = true,
  showCloseButton = true,
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
    <ModalProvider
      value={{
        isOpen: internalOpen,
        onClose: handleClose,
        closeOnOverlayClick,
        showCloseButton,
        onAnimationComplete: handleAnimationComplete,
      }}
    >
      {children}
    </ModalProvider>
  );
};
Modal.displayName = "Modal";

const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  ({ className, onClick }, ref) => {
    const { isOpen, onClose, closeOnOverlayClick } = useModalContext();
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
            key="backdrop"
            onClick={handleBackdropClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3, // 转换为秒
            }}
            className={cn(
              "bg-black/50 fixed inset-0 z-[999] backdrop-blur-sm",
              className
            )}
          ></motion.div>
        ) : (
          <></>
        )}
      </AnimatePresence>
    );
  }
);
ModalBackdrop.displayName = "ModalBackdrop";

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children }, ref) => {
    const { isOpen, onAnimationComplete } = useModalContext();
    const shadowRoot =
      typeof window !== "undefined"
        ? document.querySelector("tundra-annotation")?.shadowRoot
        : null;
    const content = (
      <>
        <ModalBackdrop />
        <AnimatePresence mode="wait" onExitComplete={onAnimationComplete}>
          {isOpen && (
            <motion.div
              ref={ref}
              key="modal-content"
              initial={{ opacity: 0, scale: 0.2, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.2, x: "-50%", y: "-50%" }}
              transition={{
                duration: 0.3, // 转换为秒
              }}
              style={{
                position: "fixed",
                left: "50%",
                top: "50%",
              }}
              className={cn(
                "z-[999] w-[calc(100%-2rem)] max-w-md sm:max-w-lg md:max-w-lg lg:max-w-lg",
                "space-y-4 rounded-lg border-[1px] border-ctx-primary-inverse/20 px-4 shadow-lg",
                "bg-ctx-primary",
                className
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
    if (shadowRoot) {
      const body = shadowRoot.querySelector("body");
      if (body) {
        return createPortal(content, body);
      }
      return createPortal(content, document.body);
    }
  }
);
ModalContent.displayName = "ModalContent";

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { onClose, showCloseButton } = useModalContext();

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between pt-4", className)}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {showCloseButton && (
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();
              console.log("modal close--");

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

ModalHeader.displayName = "ModalHeader";

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  }
);

ModalBody.displayName = "ModalBody";
