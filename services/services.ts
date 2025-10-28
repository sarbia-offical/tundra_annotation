import { Annotate } from "./api.type";
import { initIndexedDB, isIndexedDBSupported } from "./indexeddb.init";
import { IndexedDBService } from "./indexeddb.services";

// 数据库初始化状态
let dbInitialized = false;

/**
 * 确保数据库已初始化
 */
async function ensureDBInitialized(): Promise<void> {
  if (!dbInitialized && isIndexedDBSupported()) {
    try {
      dbInitialized = await initIndexedDB();
    } catch (error) {
      dbInitialized = false;
    }
  }
}

/**
 * 添加注释
 * @param params 标注参数
 * @returns
 */
export const addAnnotateService = async (
  params: Annotate
): Promise<{ success: boolean; data: any }> => {
  try {
    // 确保数据库已初始化
    await ensureDBInitialized();

    if (!dbInitialized) {
      return Promise.resolve({ success: true, data: "success" });
    }

    // 使用IndexedDB服务
    const result = await IndexedDBService.addAnnotate(params);
    return result;
  } catch (error) {
    return { success: false, data: `Failed to add annotation: ${error}` };
  }
};

/**
 * 获取注释
 * @param params 查询参数
 * @returns
 */
export const getAnnotationsService = async (params: {
  path?: string;
}): Promise<{ success: boolean; data: Annotate[] }> => {
  try {
    // 确保数据库已初始化
    await ensureDBInitialized();

    if (!dbInitialized) {
      return Promise.resolve({ success: true, data: [] });
    }

    // 使用IndexedDB服务
    console.log("params", params);

    const result = await IndexedDBService.getAnnotations(params);
    return result;
  } catch (error) {
    return { success: false, data: [] };
  }
};

/**
 * 更新注释
 * @param params 更新参数
 * @returns
 */
export const updateAnnotateService = async (params: {
  data: Annotate;
}): Promise<{ success: boolean; data: any }> => {
  try {
    // 确保数据库已初始化
    await ensureDBInitialized();

    if (!dbInitialized) {
      return Promise.resolve({ success: true, data: params.data });
    }

    // 使用IndexedDB服务
    const result = await IndexedDBService.updateAnnotate(params.data);
    return result;
  } catch (error) {
    return { success: false, data: `Failed to update annotation: ${error}` };
  }
};

/**
 * 删除注释
 * @param params 删除参数
 * @returns
 */
export const deleteAnnotateService = async (params: {
  uid: string;
}): Promise<{ success: boolean; data: any }> => {
  try {
    // 确保数据库已初始化
    await ensureDBInitialized();
    if (!dbInitialized) {
      return Promise.resolve({ success: true, data: params });
    }
    // 使用IndexedDB服务
    const result = await IndexedDBService.deleteAnnotate(params);
    return result;
  } catch (error) {
    return { success: false, data: `Failed to delete annotation: ${error}` };
  }
};

/**
 * 手动初始化数据库（可选调用）
 */
export const initDB = async (): Promise<boolean> => {
  try {
    if (isIndexedDBSupported()) {
      dbInitialized = await initIndexedDB();
      return dbInitialized;
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * 获取数据库状态
 */
export const getDBStatus = (): { supported: boolean; initialized: boolean } => {
  return {
    supported: isIndexedDBSupported(),
    initialized: dbInitialized,
  };
};
