import React, { createContext, useReducer, useMemo } from "react";
import { produce } from "immer";
import type { SerializedRange } from "@/lib/Marks/Mark.type";
import type {
  MarkStoreState,
  MarkStoreAction,
  MarkStoreContextType,
} from "./markStore.type";

// 初始状态
const initialState: MarkStoreState = {
  marks: {},
  markOrder: [],
  isInitialized: true, // 纯内存 store，直接初始化完成
};

// Reducer - 使用 Immer 保证不可变性
const markStoreReducer = produce(
  (draft: MarkStoreState, action: MarkStoreAction) => {
    switch (action.type) {
      case "INIT": {
        const marks: Record<string, SerializedRange> = {};
        const markOrder: string[] = [];

        action.payload.forEach((mark) => {
          marks[mark.uid] = mark;
          markOrder.push(mark.uid);
        });

        draft.marks = marks;
        draft.markOrder = markOrder;
        draft.isInitialized = true;
        break;
      }

      case "ADD_MARK": {
        const mark = action.payload;
        if (!draft.marks[mark.uid]) {
          draft.marks[mark.uid] = mark;
          draft.markOrder.unshift(mark.uid);
        }
        break;
      }

      case "REMOVE_MARK": {
        const uid = action.payload;
        if (draft.marks[uid]) {
          delete draft.marks[uid];
          draft.markOrder = draft.markOrder.filter((id) => id !== uid);
        }
        break;
      }

      case "UPDATE_MARK": {
        const mark = action.payload;
        if (draft.marks[mark.uid]) {
          draft.marks[mark.uid] = mark;
        }
        break;
      }

      case "BATCH_ADD": {
        action.payload.forEach((mark) => {
          if (!draft.marks[mark.uid]) {
            draft.marks[mark.uid] = mark;
            draft.markOrder.push(mark.uid);
          }
        });
        break;
      }

      case "BATCH_UPDATE": {
        action.payload.forEach((mark) => {
          if (draft.marks[mark.uid]) {
            draft.marks[mark.uid] = mark;
          }
        });
        break;
      }

      case "BATCH_DELETE": {
        action.payload.forEach((uid) => {
          if (draft.marks[uid]) {
            delete draft.marks[uid];
          }
        });
        draft.markOrder = draft.markOrder.filter(
          (uid) => !action.payload.includes(uid)
        );
        break;
      }

      case "CLEAR_ALL": {
        draft.marks = {};
        draft.markOrder = [];
        break;
      }
    }
  }
);

// Context
export const MarkStoreContext = createContext<MarkStoreContextType | null>(
  null
);

// Provider Props
export interface MarkStoreProviderProps {
  children: React.ReactNode;
}

// Provider - 确保只创建一次
export const MarkStoreProvider: React.FC<MarkStoreProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(markStoreReducer, initialState);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      isInitialized: state.isInitialized,
    }),
    [state]
  );

  return (
    <MarkStoreContext.Provider value={contextValue}>
      {children}
    </MarkStoreContext.Provider>
  );
};
