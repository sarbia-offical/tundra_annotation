import React, { PropsWithChildren } from "react";

export interface PopoverPositionType {
  x: number;
  y: number;
}

/**
 * 组件的参数
 */
export interface TranslationPanelProps extends PropsWithChildren {
  translateText: string;
  isPopoverOpen: boolean;
  position: PopoverPositionType;
  to: string;
  className?: string;
  closePopover?: () => void;
}

export enum ActionType {
  INIT = "SWITCH",
}

export type StoreAction = {
  type: ActionType.INIT;
  value: string;
};

export interface TranslationPanelState extends TranslationPanelProps {}

export interface TranslationPanelContextType {
  state: TranslationPanelState;
  dispatch: React.Dispatch<StoreAction>;
}
