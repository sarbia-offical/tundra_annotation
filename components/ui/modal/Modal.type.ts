import { HTMLAttributes, PropsWithChildren } from "react";

export interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick: boolean;
  showCloseButton: boolean;
  onAnimationComplete?: () => void;
}

export interface ModalProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export interface ModalBackdropProps extends HTMLAttributes<HTMLDivElement> {}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}
