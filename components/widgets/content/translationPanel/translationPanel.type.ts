import React from "react";

export interface PopoverPositionType {
  x: number;
  y: number;
}

/**
 * 暴露的钩子
 */
export interface TranslationPanelRef {
  /**
   * 打开翻译菜单
   */
  open: () => void;
  /**
   * 关闭翻译菜单
   */
  close: () => void;
}

/**
 * 组件的参数
 */
export interface TranslationPanelProps {
  translateText: string;
  isPopoverOpen: boolean;
  position: PopoverPositionType;
  children?: React.ReactNode | undefined;
  className?: string;
  asChild?: boolean;
  autoSize?: boolean;
  disabled?: boolean;
  minWidth?: string;
  maxWidth?: string;
}

export enum ActionType {
  INIT = "SWITCH",
}

export type StoreAction = {
  type: ActionType.INIT;
  value: string;
};

export interface TranslationPanelState extends TranslationPanelProps {}

export interface TranslationContextType {
  state: TranslationPanelState;
  dispatch: React.Dispatch<StoreAction>;
}
