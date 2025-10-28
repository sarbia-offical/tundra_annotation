import { DBConfig } from "./indexeddb.type";

// IndexedDB配置
export const DB_CONFIG: DBConfig = {
  name: "AnnotationDB",
  version: 1,
  stores: {
    annotations: {
      keyPath: "id",
      indexes: {
        uid: "uid",
        pageDataId: "pageDataId",
        createDate: "createDate",
      },
    },
    notes: {
      keyPath: "id",
      indexes: {
        annotationId: "annotationId",
        userId: "userId",
        createDate: "createDate",
      },
    },
    pageData: {
      keyPath: "id",
      indexes: {
        url: "url",
        host: "host",
        createDate: "createDate",
      },
    },
  },
};

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  /**
   * 初始化数据库连接
   */
  async init(): Promise<boolean> {
    // 检查是否在浏览器环境中
    if (typeof indexedDB === "undefined") {
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => {
        reject(false);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  /**
   * 创建数据存储对象
   */
  private createStores(db: IDBDatabase): void {
    Object.entries(DB_CONFIG.stores).forEach(([storeName, storeConfig]) => {
      // 删除已存在的存储对象（如果存在）
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }

      // 创建新的存储对象
      const store = db.createObjectStore(storeName, {
        keyPath: storeConfig.keyPath,
        autoIncrement: true,
      });

      // 创建索引
      if (storeConfig.indexes) {
        Object.entries(storeConfig.indexes).forEach(([indexName, indexKey]) => {
          store.createIndex(indexName, indexKey, { unique: false });
        });
      }
    });
  }

  /**
   * 获取数据库实例
   */
  getDB(): IDBDatabase {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    return this.db;
  }

  /**
   * 开始事务
   */
  transaction(
    storeNames: string | string[],
    mode: IDBTransactionMode = "readonly"
  ): IDBTransaction {
    const db = this.getDB();
    return db.transaction(storeNames, mode);
  }

  /**
   * 获取对象存储
   */
  getStore(
    storeName: string,
    mode: IDBTransactionMode = "readonly"
  ): IDBObjectStore {
    const transaction = this.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  /**
   * 关闭数据库连接
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// 创建单例实例
export const dbManager = new IndexedDBManager();

// 只在浏览器环境中自动初始化数据库
if (typeof window !== "undefined" && typeof indexedDB !== "undefined") {
  dbManager.init().catch(console.error);
}
