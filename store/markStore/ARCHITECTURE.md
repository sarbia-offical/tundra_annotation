# MarkStore 技术架构设计

## 技术选型及理由

### 1. React Context + useReducer

**选择理由**：

- **集中式状态管理**: Context 提供跨组件共享状态，无需 prop drilling
- **可预测的状态更新**: useReducer 提供单向数据流，所有更新都通过 dispatch
- **原生支持**: React 内置 API，无需额外依赖
- **类型安全**: 与 TypeScript 完美集成，编译时检查 Action 类型

**与 Redux 对比**：

- Redux 过重，需要额外的库和样板代码
- useReducer 足够满足中小型状态管理需求
- 本项目标记数据结构简单，不需要 Redux 的复杂中间件

### 2. Immer

**选择理由**：

- **简化不可变更新**: 使用 `produce` 可以像修改普通对象一样更新状态
- **防止意外修改**: 自动创建新对象，避免直接修改原状态导致的 bug
- **提高可读性**: 代码更直观，减少 `...spread` 语法的嵌套

**示例对比**：

```typescript
// 没有 Immer (繁琐且易错)
case "REMOVE_MARK":
  return {
    ...state,
    marks: Object.keys(state.marks)
      .filter(k => k !== uid)
      .reduce((acc, k) => ({ ...acc, [k]: state.marks[k] }), {}),
    markOrder: state.markOrder.filter(id => id !== uid),
  };

// 使用 Immer (简洁清晰)
case "REMOVE_MARK":
  delete draft.marks[uid];
  draft.markOrder = draft.markOrder.filter(id => id !== uid);
```

### 3. Record<string, SerializedRange> 数据结构

**选择理由**：

- **O(1) 查找**: 通过 uid 直接访问，不需要遍历数组
- **高效更新**: 添加、删除、更新都是常数时间
- **保持顺序**: 配合 `markOrder` 数组维护插入顺序

**与纯数组对比**：

```typescript
// 数组方式 - O(n) 查找
const mark = marks.find((m) => m.uid === uid); // 需要遍历

// Record 方式 - O(1) 查找
const mark = marks[uid]; // 直接访问
```

## 架构设计

### 单例模式

```
┌─────────────────────────────────────┐
│     App Root (只创建一次)             │
│  <MarkStoreProvider>                │
│    ├── state (纯内存)                │
│    ├── dispatch                      │
│    └── isInitialized (始终 true)     │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴───────────┐
    │                      │
┌───▼───────┐      ┌──────▼──────┐
│  Popup    │      │   Content   │
│  (独立实例)│      │  Script     │
│ useAddMark│      │ (独立实例)   │
│ ...       │      │ useAllMarks │
└───────────┘      └─────────────┘
```

### 数据流

```
用户操作 → dispatch(action)
    ↓
Reducer (Immer)
    ↓
新状态 → Context
    ↓
所有订阅组件 re-render
```

**注意**: 每个页面（popup/content）有独立的 store 实例，不会相互影响。

## 状态隔离

### 核心原则：只通过 dispatch 更新

```typescript
// ❌ 错误：直接修改 state
const { state } = useMarkStore();
state.marks[uid] = newMark; // 不会触发 re-render

// ✅ 正确：通过 dispatch
const dispatch = useMarkDispatch();
dispatch({ type: "UPDATE_MARK", payload: newMark });
```

### Provider 只创建一次

```tsx
// ✅ 正确：在根组件创建
function App() {
  return (
    <MarkStoreProvider>
      <Page1 />
      <Page2 />
    </MarkStoreProvider>
  );
}

// ❌ 错误：在多处创建
function Page1() {
  return (
    <MarkStoreProvider>
      {" "}
      {/* 会创建新实例！*/}
      <Content />
    </MarkStoreProvider>
  );
}
```

## 性能优化策略

### 1. Context 分离（未来优化）

如果发现性能问题，可以将 state 和 dispatch 分离：

```typescript
<MarkStoreStateContext.Provider value={state}>
  <MarkStoreDispatchContext.Provider value={dispatch}>
    {children}
  </MarkStoreDispatchContext.Provider>
</MarkStoreStateContext.Provider>
```

只使用 dispatch 的组件不会因 state 变化而 re-render。

### 2. useMemo 缓存计算

所有查询 hooks 都使用 useMemo：

```typescript
export const useAllMarks = () => {
  const { state } = useMarkStore();
  return useMemo(
    () => state.markOrder.map((uid) => state.marks[uid]),
    [state.marks, state.markOrder]
  );
};
```

### 3. useCallback 缓存函数

所有操作 hooks 都使用 useCallback：

```typescript
export const useAddMark = () => {
  const dispatch = useMarkDispatch();
  return useCallback(
    (mark: SerializedRange) => {
      dispatch({ type: "ADD_MARK", payload: mark });
    },
    [dispatch]
  );
};
```

## 与其他 Store 的关系

### ConfigStore vs MarkStore

| 特性     | ConfigStore                   | MarkStore                     |
| -------- | ----------------------------- | ----------------------------- |
| 数据类型 | 配置项（theme, status, etc.） | 标记数据（SerializedRange[]） |
| 数据量   | 小（< 20 个字段）             | 大（可能上千个标记）          |
| 更新频率 | 低（用户手动修改设置）        | 高（每次高亮都会添加）        |
| 持久化   | Storage 持久化                | 纯内存（刷新后清空）          |
| 跨页面   | 跨页面同步                    | 每页面独立实例                |

### 独立性保证

```typescript
// ✅ 两个 Store 完全独立
<ConfigStoreProvider>
  <MarkStoreProvider>
    <App />
  </MarkStoreProvider>
</ConfigStoreProvider>;

// MarkStore 的更新不会影响 ConfigStore
dispatch({ type: "ADD_MARK", payload: mark }); // 只更新 MarkStore

// ConfigStore 的更新不会影响 MarkStore
dispatch({ type: "UPDATE_CONFIG", payload: config }); // 只更新 ConfigStore
```

## 扩展性设计

### 1. 添加新 Action

```typescript
// 1. 在 markStore.type.ts 添加类型
export type MarkStoreAction =
  | ...
  | { type: "ARCHIVE_MARK"; payload: string };  // 新增

// 2. 在 reducer 添加处理
case "ARCHIVE_MARK":
  draft.marks[action.payload].archived = true;
  break;

// 3. 添加对应 hook
export const useArchiveMark = () => {
  const dispatch = useMarkDispatch();
  return useCallback(
    (uid: string) => dispatch({ type: "ARCHIVE_MARK", payload: uid }),
    [dispatch]
  );
};
```

### 2. 添加新查询

```typescript
// 查询已归档标记
export const useArchivedMarks = () => {
  const allMarks = useAllMarks();
  return useMemo(() => allMarks.filter((mark) => mark.archived), [allMarks]);
};
```

### 3. 添加中间件（未来）

如果需要日志、撤销等功能，可以包装 dispatch：

```typescript
const enhancedDispatch = (action: MarkStoreAction) => {
  console.log("Action:", action);
  dispatch(action);
  console.log("New State:", state);
};
```

## 测试策略

### 单元测试

```typescript
describe("markStoreReducer", () => {
  it("should add mark", () => {
    const state = initialState;
    const action = { type: "ADD_MARK", payload: mockMark };
    const newState = markStoreReducer(state, action);

    expect(newState.marks[mockMark.uid]).toEqual(mockMark);
    expect(newState.markOrder).toContain(mockMark.uid);
  });
});
```

### 集成测试

```typescript
describe("MarkStore Integration", () => {
  it("should sync across components", async () => {
    const { result: addResult } = renderHook(() => useAddMark(), {
      wrapper: MarkStoreProvider,
    });

    act(() => {
      addResult.current(mockMark);
    });

    const { result: queryResult } = renderHook(() => useAllMarks(), {
      wrapper: MarkStoreProvider,
    });

    expect(queryResult.current).toContainEqual(mockMark);
  });
});
```

## 总结

MarkStore 采用 **React Context + useReducer + Immer** 的技术栈，提供了：

1. ✅ **单例模式**: 每个页面创建一个独立实例
2. ✅ **类型安全**: 完整的 TypeScript 支持
3. ✅ **性能优化**: useMemo/useCallback 缓存，O(1) 查找
4. ✅ **纯内存状态**: 轻量级，无持久化开销
5. ✅ **状态隔离**: 只能通过 dispatch 更新
6. ✅ **易于扩展**: 清晰的架构，方便添加新功能
7. ✅ **完整的 CRUD**: 增删改查批量操作全覆盖

这个架构既满足当前需求，又为未来扩展留有余地。
