# MarkStore 使用文档

## 概述

MarkStore 是一个完整的全局标记（SerializedRange）管理系统，提供了增、删、改、查、批量操作等能力。

## 技术栈

- **React Context**: 提供跨组件的状态共享
- **useReducer + Immer**: 确保状态不可变性和类型安全
- **TypeScript**: 完整的类型支持

## 核心特性

### 1. 单例模式

- MarkStoreProvider 只需在应用根部创建一次
- 所有子组件通过 hooks 访问同一个 store 实例
- 避免多个 store 实例导致的状态不一致

### 2. 存储结构

```typescript
{
  marks: Record<string, SerializedRange>,  // O(1) 查找性能
  markOrder: string[],                      // 保持插入顺序
  isInitialized: boolean                    // 初始化标志（始终为 true）
}
```

### 3. 纯内存状态

- 所有数据只保存在内存中
- 页面刷新后数据会清空
- 适合运行时临时标记管理

## 使用方法

### 1. 在根组件注入 Provider

```tsx
// 在 popup/Container.tsx 或 content/Container.tsx
import { MarkStoreProvider } from "@/store/markStore";

function Container() {
  return <MarkStoreProvider>{/* 其他组件 */}</MarkStoreProvider>;
}
```

### 2. 查询操作

```tsx
import {
  useAllMarks,
  useMarkByUid,
  useMarkCount,
  useQueryMarks,
  useMarksByColor,
  useMarksByPage,
} from "@/store/markStore";

function MyComponent() {
  // 获取所有标记（按顺序）
  const allMarks = useAllMarks();

  // 根据 uid 获取单个标记
  const mark = useMarkByUid("some-uid");

  // 获取标记总数
  const count = useMarkCount();

  // 条件查询
  const filteredMarks = useQueryMarks({
    color: "#FFD700",
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 最近7天
    sortBy: "createDate",
    sortOrder: "desc",
  });

  // 按颜色分组
  const marksByColor = useMarksByColor();
  // 结果: { "#FFD700": [...], "#FF6B6B": [...] }

  // 按页面分组
  const marksByPage = useMarksByPage();
  // 结果: { "https://example.com": [...] }
}
```

### 3. 增删改操作

```tsx
import {
  useAddMark,
  useRemoveMark,
  useUpdateMark,
  useClearAllMarks,
} from "@/store/markStore";

function MarkOperations() {
  const addMark = useAddMark();
  const removeMark = useRemoveMark();
  const updateMark = useUpdateMark();
  const clearAll = useClearAllMarks();

  const handleAdd = () => {
    const newMark: SerializedRange = {
      uid: "unique-id",
      text: "highlighted text",
      color: "#FFD700",
      createDate: Date.now(),
      // ... 其他字段
    };
    addMark(newMark);
  };

  const handleRemove = (uid: string) => {
    removeMark(uid);
  };

  const handleUpdate = (mark: SerializedRange) => {
    const updatedMark = {
      ...mark,
      color: "#FF6B6B", // 更新颜色
    };
    updateMark(updatedMark);
  };

  const handleClearAll = () => {
    clearAll();
  };
}
```

### 4. 批量操作

```tsx
import { useBatchOperations } from "@/store/markStore";

function BatchOperations() {
  const { batchAdd, batchUpdate, batchDelete } = useBatchOperations();

  const handleBatchAdd = () => {
    const newMarks: SerializedRange[] = [
      { uid: "1" /* ... */ },
      { uid: "2" /* ... */ },
      { uid: "3" /* ... */ },
    ];
    batchAdd(newMarks);
  };

  const handleBatchUpdate = () => {
    const updatedMarks: SerializedRange[] = [
      { uid: "1", color: "#FFD700" /* ... */ },
      { uid: "2", color: "#FF6B6B" /* ... */ },
    ];
    batchUpdate(updatedMarks);
  };

  const handleBatchDelete = () => {
    const uidsToDelete = ["1", "2", "3"];
    batchDelete(uidsToDelete);
  };
}
```

### 5. 直接使用 dispatch（高级）

```tsx
import { useMarkDispatch } from "@/store/markStore";

function AdvancedComponent() {
  const dispatch = useMarkDispatch();

  // 只有通过 dispatch 才能更新 store
  const handleCustomAction = () => {
    dispatch({
      type: "ADD_MARK",
      payload: {
        /* SerializedRange */
      },
    });
  };
}
```

### 6. 组合 Hook

```tsx
import { useMarkOperations } from "@/store/markStore";

function AllInOneComponent() {
  // 一次性获取所有操作函数
  const {
    addMark,
    removeMark,
    updateMark,
    batchAdd,
    batchUpdate,
    batchDelete,
    clearAll,
  } = useMarkOperations();

  // 使用任意操作
  addMark(/* ... */);
  batchDelete([
    /* ... */
  ]);
}
```

## Action 类型

```typescript
type MarkStoreAction =
  | { type: "INIT"; payload: SerializedRange[] } // 初始化
  | { type: "ADD_MARK"; payload: SerializedRange } // 添加单个
  | { type: "REMOVE_MARK"; payload: string } // 删除单个 (uid)
  | { type: "UPDATE_MARK"; payload: SerializedRange } // 更新单个
  | { type: "BATCH_ADD"; payload: SerializedRange[] } // 批量添加
  | { type: "BATCH_UPDATE"; payload: SerializedRange[] } // 批量更新
  | { type: "BATCH_DELETE"; payload: string[] } // 批量删除 (uid[])
  | { type: "CLEAR_ALL" }; // 清空所有
```

## 与现有代码集成

### 在 useHighlight 中同步标记

```tsx
// entrypoints/content/hooks/useHighlight.ts
import { useAddMark, useUpdateMark, useRemoveMark } from "@/store/markStore";

export const useHighlight = () => {
  const addMark = useAddMark();
  const updateMark = useUpdateMark();
  const removeMark = useRemoveMark();

  const handleColorSelect = (color: string) => {
    if (color === "cancel") {
      // 删除标记
      removeMark(currentMark.uid);
      unPaint(currentMark.uid);
    } else if (currentMark) {
      // 更新标记颜色
      const updated = { ...currentMark, color };
      updateMark(updated);
      repaint(currentMark.uid, color);
    } else {
      // 创建新标记
      const newMark = createMark(selection, color);
      addMark(newMark);
      paint(newMark);
    }
  };
};
```

### 在 usePaint 中同步状态

```tsx
// entrypoints/content/hooks/usePaint.ts
import { useUpdateMark } from "@/store/markStore";

export const usePaint = () => {
  const updateMark = useUpdateMark();

  const repaint = (uid: string, newColor: string) => {
    const oldMark = markerInstance.state.uidToSerializedRange[uid];
    const updatedMark = { ...oldMark, color: newColor };

    // 同步到全局 store
    updateMark(updatedMark);

    // 更新 Marker 内部状态
    markerInstance.state.uidToSerializedRange[uid] = updatedMark;

    // 重新绘制
    markerInstance.paint(updatedMark);
  };
};
```

## 性能优化

1. **useMemo 缓存**: 所有查询 hooks 都使用 useMemo 避免不必要的重新计算
2. **useCallback 缓存**: 所有操作函数都使用 useCallback 避免重新创建
3. **Context 优化**: contextValue 使用 useMemo 避免不必要的 re-render
4. **O(1) 查找**: marks 使用 Record 而不是数组，提供常数时间复杂度的查找

## 注意事项

1. **只在 Provider 内部使用**: 所有 hooks 必须在 MarkStoreProvider 子组件中调用
2. **只通过 dispatch 更新**: 不要直接修改 state，所有更新必须通过 dispatch
3. **纯内存状态**: 数据只保存在内存中，页面刷新后会清空
4. **单页面作用域**: 每个页面（popup/content）有独立的 store 实例

## 文件结构

```
store/markStore/
├── markStore.type.ts        # 类型定义
├── markStore.context.tsx    # Context 和 Reducer
├── markStore.hooks.ts       # 所有 hooks
└── index.ts                 # 统一导出
```
