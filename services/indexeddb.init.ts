import { dbManager } from "./indexeddb.config";

/**
 * 初始化 IndexedDB
 * 确保数据库已正确初始化并可以使用
 */
export async function initIndexedDB(): Promise<boolean> {
  try {
    const result = await dbManager.init();
    if (result) {
      console.log("IndexedDB 初始化成功");
    } else {
      console.error("IndexedDB 初始化失败");
    }

    return result;
  } catch (error) {
    return false;
  }
}

/**
 * 检查 IndexedDB 是否可用
 */
export function isIndexedDBSupported(): boolean {
  return typeof indexedDB !== "undefined";
}

/**
 * 获取数据库状态信息
 */
export function getDBStatus(): {
  supported: boolean;
  initialized: boolean;
  dbName: string;
  version: number;
} {
  return {
    supported: isIndexedDBSupported(),
    initialized: !!dbManager.getDB,
    dbName: "AnnotationDB",
    version: 1,
  };
}
