import { HTMLAttributes, PropsWithChildren } from "react";

export type PopoverPosition = {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
};

export interface PopoverContextValue {
  isOpen: boolean;
  handleClose: () => void;
  closeOnOutsideClick: boolean;
  position?: PopoverPosition;
  onAnimationComplete?: () => void;
}

export interface PopoverProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  position?: PopoverPosition;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface PopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface PopoverBodyProps extends HTMLAttributes<HTMLDivElement> {}
