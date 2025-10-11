import { Dispatch } from "react";
import { string } from "zod";

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
      type: "TRANSLATION_POPOVER_VISIBLE";
      payload: boolean;
    }
  | {
      type: "SHOW_POPOVER_AT_POSITION";
      payload: PopoverPositionType;
    }
  | {
      type: "HIDE_POPOVER";
    }
  | {
      type: "CHANGE_COLOR";
      payload: string;
    };

export interface MarkStoreType {
  popoverPosition: PopoverPositionType;
  popoverVisible: boolean;
  translationPopoverVisible: boolean;
  color: string;
}

export type MarkStoreContextType = MarkStoreType & {
  dispatch: Dispatch<MarkStoreAction>;
};

// 初始状态
export const initialMarkStoreState: MarkStoreType = {
  popoverPosition: { x: 0, y: 0 },
  popoverVisible: false,
  translationPopoverVisible: false,
  color: "",
};
