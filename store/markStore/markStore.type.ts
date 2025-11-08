import type { SerializedRange } from "@/lib/Marks/Mark.type";

// MarkStore 状态结构
export interface MarkStoreState {
  // 使用 Record 存储标记，提供 O(1) 查找性能
  marks: Record<string, SerializedRange>;
  // 保持标记顺序的 uid 数组
  markOrder: string[];
  // 初始化标志
  isInitialized: boolean;
}

// Action 类型定义
export type MarkStoreAction =
  | { type: "INIT"; payload: SerializedRange[] }
  | { type: "ADD_MARK"; payload: SerializedRange }
  | { type: "REMOVE_MARK"; payload: string } // uid
  | { type: "UPDATE_MARK"; payload: SerializedRange }
  | { type: "BATCH_ADD"; payload: SerializedRange[] }
  | { type: "BATCH_UPDATE"; payload: SerializedRange[] }
  | { type: "BATCH_DELETE"; payload: string[] } // uid[]
  | { type: "CLEAR_ALL" };

// Context 类型
export interface MarkStoreContextType {
  state: MarkStoreState;
  dispatch: React.Dispatch<MarkStoreAction>;
  isInitialized: boolean;
}

// 查询选项
export interface MarkQueryOptions {
  color?: string;
  startDate?: number;
  endDate?: number;
  pageUrl?: string;
  sortBy?: "createDate" | "uid" | "color";
  sortOrder?: "asc" | "desc";
}
