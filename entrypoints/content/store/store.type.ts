import { Dispatch } from "react";

export interface PopoverPositionType {
  x: number;
  y: number;
}

export type MarkStoreAction =
  | {
      type: "SET_POPOVER_POSITION";
      payload: PopoverPositionType;
    }
  | {
      type: "POPOVER_VISIBLE";
      payload: boolean;
    }
  | {
      type: "SET_TRANSLATION_TEXT";
      payload: string;
    };

export interface MarkStoreType {
  popoverPosition: PopoverPositionType;
  popoverVisible: boolean;
  translationText: string;
}

export type MarkStoreContextType = MarkStoreType & {
  dispatch: Dispatch<MarkStoreAction>;
};

// 初始状态
export const initialMarkStoreState: MarkStoreType = {
  popoverPosition: { x: 0, y: 0 },
  popoverVisible: false,
  translationText: "",
};
