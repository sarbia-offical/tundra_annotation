// Context & Provider
export { MarkStoreContext, MarkStoreProvider } from "./markStore.context";
export type { MarkStoreProviderProps } from "./markStore.context";

// Types
export type {
  MarkStoreState,
  MarkStoreAction,
  MarkStoreContextType,
  MarkQueryOptions,
} from "./markStore.type";

// Hooks - 基础
export {
  useMarkStore,
  useMarkStoreInitialized,
  useMarkDispatch,
} from "./markStore.hooks";

// Hooks - 查询
export {
  useAllMarks,
  useMarkByUid,
  useMarkCount,
  useQueryMarks,
  useMarksByColor,
} from "./markStore.hooks";

// Hooks - 操作
export {
  useAddMark,
  useRemoveMark,
  useUpdateMark,
  useBatchOperations,
  useClearAllMarks,
  useMarkOperations,
} from "./markStore.hooks";
