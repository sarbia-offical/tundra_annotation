import { useContext, useMemo, useCallback } from "react";
import { MarkStoreContext } from "./markStore.context";
import type { SerializedRange } from "@/lib/Marks/Mark.type";
import type { MarkQueryOptions } from "./markStore.type";

// ====== 基础 Hook ======

/**
 * 获取 MarkStore 的完整上下文
 * @throws 如果在 Provider 外部调用将抛出错误
 */
export const useMarkStore = () => {
  const context = useContext(MarkStoreContext);
  if (!context) {
    throw new Error("useMarkStore must be used within MarkStoreProvider");
  }
  return context;
};

/**
 * 获取初始化状态
 */
export const useMarkStoreInitialized = () => {
  const { isInitialized } = useMarkStore();
  return isInitialized;
};

/**
 * 获取 dispatch 函数（只暴露这个给外部更新 store）
 */
export const useMarkDispatch = () => {
  const { dispatch } = useMarkStore();
  return dispatch;
};

// ====== 查询 Hooks ======

/**
 * 获取所有标记（数组形式，按照 markOrder 排序）
 */
export const useAllMarks = (): SerializedRange[] => {
  const { state } = useMarkStore();

  return useMemo(() => {
    return state.markOrder.map((uid) => state.marks[uid]);
  }, [state.marks, state.markOrder]);
};

/**
 * 根据 uid 获取单个标记
 */
export const useMarkByUid = (uid: string): SerializedRange | undefined => {
  const { state } = useMarkStore();

  return useMemo(() => {
    return state.marks[uid];
  }, [state.marks, uid]);
};

/**
 * 获取标记总数
 */
export const useMarkCount = (): number => {
  const { state } = useMarkStore();
  return state.markOrder.length;
};

/**
 * 根据条件查询标记
 */
export const useQueryMarks = (options: MarkQueryOptions): SerializedRange[] => {
  const allMarks = useAllMarks();

  return useMemo(() => {
    let filtered = [...allMarks];

    // 按颜色过滤
    if (options.color) {
      filtered = filtered.filter((mark) => mark.color === options.color);
    }

    // 按日期范围过滤
    if (options.startDate) {
      filtered = filtered.filter(
        (mark) => mark.createDate >= options.startDate!
      );
    }
    if (options.endDate) {
      filtered = filtered.filter((mark) => mark.createDate <= options.endDate!);
    }

    // 按页面 URL 过滤
    if (options.pageUrl) {
      filtered = filtered.filter(
        (mark) => mark.pageData?.url === options.pageUrl
      );
    }

    // 排序
    if (options.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (options.sortBy) {
          case "createDate":
            comparison = a.createDate - b.createDate;
            break;
          case "color":
            comparison = a.color.localeCompare(b.color);
            break;
          case "uid":
            comparison = a.uid.localeCompare(b.uid);
            break;
        }
        return options.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }, [allMarks, options]);
};

/**
 * 按颜色分组获取标记
 */
export const useMarksByColor = (): Record<string, SerializedRange[]> => {
  const allMarks = useAllMarks();

  return useMemo(() => {
    const grouped: Record<string, SerializedRange[]> = {};
    allMarks.forEach((mark) => {
      if (!grouped[mark.color]) {
        grouped[mark.color] = [];
      }
      grouped[mark.color].push(mark);
    });
    return grouped;
  }, [allMarks]);
};

// ====== 操作 Hooks ======

/**
 * 添加单个标记
 */
export const useAddMark = () => {
  const dispatch = useMarkDispatch();

  return useCallback(
    (mark: SerializedRange) => {
      dispatch({ type: "ADD_MARK", payload: mark });
    },
    [dispatch]
  );
};

/**
 * 删除单个标记
 */
export const useRemoveMark = () => {
  const dispatch = useMarkDispatch();

  return useCallback(
    (uid: string) => {
      dispatch({ type: "REMOVE_MARK", payload: uid });
    },
    [dispatch]
  );
};

/**
 * 更新单个标记
 */
export const useUpdateMark = () => {
  const dispatch = useMarkDispatch();

  return useCallback(
    (mark: SerializedRange) => {
      dispatch({ type: "UPDATE_MARK", payload: mark });
    },
    [dispatch]
  );
};

/**
 * 批量操作
 */
export const useBatchOperations = () => {
  const dispatch = useMarkDispatch();

  return useMemo(
    () => ({
      batchAdd: (marks: SerializedRange[]) => {
        dispatch({ type: "BATCH_ADD", payload: marks });
      },
      batchUpdate: (marks: SerializedRange[]) => {
        dispatch({ type: "BATCH_UPDATE", payload: marks });
      },
      batchDelete: (uids: string[]) => {
        dispatch({ type: "BATCH_DELETE", payload: uids });
      },
    }),
    [dispatch]
  );
};

/**
 * 清空所有标记
 */
export const useClearAllMarks = () => {
  const dispatch = useMarkDispatch();

  return useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, [dispatch]);
};

// ====== 便捷组合 Hooks ======

/**
 * 获取所有操作函数（增删改查批量清空）
 */
export const useMarkOperations = () => {
  const addMark = useAddMark();
  const removeMark = useRemoveMark();
  const updateMark = useUpdateMark();
  const batchOps = useBatchOperations();
  const clearAll = useClearAllMarks();

  return useMemo(
    () => ({
      addMark,
      removeMark,
      updateMark,
      ...batchOps,
      clearAll,
    }),
    [addMark, removeMark, updateMark, batchOps, clearAll]
  );
};
