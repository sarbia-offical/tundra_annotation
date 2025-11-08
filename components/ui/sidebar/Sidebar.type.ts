import { HTMLAttributes, PropsWithChildren } from "react";

export type SidebarPosition = "left" | "right" | "top" | "bottom";

export interface SidebarContextValue {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick: boolean;
  showCloseButton: boolean;
  position: SidebarPosition;
  onAnimationComplete?: () => void;
}

export interface SidebarProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  position?: SidebarPosition;
}

export interface SidebarBackdropProps extends HTMLAttributes<HTMLDivElement> {}

export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface SidebarBodyProps extends HTMLAttributes<HTMLDivElement> {}
