// IndexedDB 相关类型定义
export * from "./indexeddb.type";

// IndexedDB 数据库配置和管理器
export { dbManager, DB_CONFIG } from "./indexeddb.config";

// 各表的 CRUD 操作类
export { AnnotationDB } from "./annotation.db";
export { NoteDB } from "./note.db";
export { PageDataDB } from "./pagedata.db";

// 统一的服务接口（与原 services.ts 兼容）
export {
  IndexedDBService,
  addAnnotateService,
  getAnnotationsService,
  updateAnnotateService,
  deleteAnnotateService,
} from "./indexeddb.services";

// 使用示例
export {
  IndexedDBUsageExample,
  runIndexedDBExample,
} from "./indexeddb.example";

// 便捷的初始化函数
export {
  initIndexedDB,
  isIndexedDBSupported,
  getDBStatus,
} from "./indexeddb.init";
