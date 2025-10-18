import { Dispatch } from "react";
import { SerializedRange } from "@/lib/Marks/Mark.type";

export interface PopoverPositionType {
  x: number;
  y: number;
}

export interface TriggeringExistingMarkType {
  popoverPosition: PopoverPositionType;
  popoverVisible: boolean;
  translationText: string;
  currentMark: SerializedRange;
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
    }
  | {
      type: "SET_CURRENT_MARK";
      payload: SerializedRange | null;
    }
  | {
      type: "TRIGGERING_EXISTING_MARK";
      payload: TriggeringExistingMarkType;
    };

export interface MarkStoreType {
  popoverPosition: PopoverPositionType; // 弹窗坐标
  popoverVisible: boolean; // 是否展示弹窗
  translationText: string; // 翻译文本
  currentMark: SerializedRange | null; // 当前的标记
  markSerializedList: SerializedRange[]; // 标记的数组
}

// 初始状态
export const initialMarkStoreState: MarkStoreType = {
  popoverPosition: { x: 0, y: 0 },
  popoverVisible: false,
  translationText: "",
  currentMark: null,
  markSerializedList: [],
};

export type MarkStoreContextType = MarkStoreType & {
  dispatch: Dispatch<MarkStoreAction>;
};
