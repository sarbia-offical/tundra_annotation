import { dbManager } from "./indexeddb.config";
import { DBPageData, DBResult } from "./indexeddb.type";

/**
 * PageData表的CRUD操作
 */
export class PageDataDB {
  /**
   * 添加页面数据
   */
  static async add(
    pageData: Omit<DBPageData, "id">
  ): Promise<DBResult<number>> {
    try {
      const store = dbManager.getStore("pageData", "readwrite");
      const request = store.add(pageData);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve({
            success: true,
            data: request.result as number,
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to add page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to add page data: ${error}`,
      };
    }
  }

  /**
   * 根据ID获取页面数据
   */
  static async getById(id: number): Promise<DBResult<DBPageData>> {
    try {
      const store = dbManager.getStore("pageData", "readonly");
      const request = store.get(id);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          if (request.result) {
            resolve({
              success: true,
              data: request.result,
            });
          } else {
            resolve({
              success: false,
              error: "Page data not found",
            });
          }
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get page data: ${error}`,
      };
    }
  }

  /**
   * 根据URL获取页面数据
   */
  static async getByUrl(url: string): Promise<DBResult<DBPageData>> {
    try {
      const store = dbManager.getStore("pageData", "readonly");
      const index = store.index("url");
      const request = index.get(url);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          if (request.result) {
            resolve({
              success: true,
              data: request.result,
            });
          } else {
            resolve({
              success: false,
              error: "Page data not found",
            });
          }
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get page data: ${error}`,
      };
    }
  }

  /**
   * 根据主机名获取所有页面数据
   */
  static async getByHost(host: string): Promise<DBResult<DBPageData[]>> {
    try {
      const store = dbManager.getStore("pageData", "readonly");
      const index = store.index("host");
      const request = index.getAll(host);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve({
            success: true,
            data: request.result || [],
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get page data: ${error}`,
      };
    }
  }

  /**
   * 获取所有页面数据
   */
  static async getAll(): Promise<DBResult<DBPageData[]>> {
    try {
      const store = dbManager.getStore("pageData", "readonly");
      const request = store.getAll();

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve({
            success: true,
            data: request.result || [],
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get page data: ${error}`,
      };
    }
  }

  /**
   * 更新页面数据
   */
  static async update(pageData: DBPageData): Promise<DBResult<boolean>> {
    try {
      if (!pageData.id) {
        return {
          success: false,
          error: "Page data ID is required for update",
        };
      }

      pageData.updateDate = Date.now();
      const store = dbManager.getStore("pageData", "readwrite");
      const request = store.put(pageData);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve({
            success: true,
            data: true,
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to update page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to update page data: ${error}`,
      };
    }
  }

  /**
   * 删除页面数据
   */
  static async delete(id: number): Promise<DBResult<boolean>> {
    try {
      const store = dbManager.getStore("pageData", "readwrite");
      const request = store.delete(id);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve({
            success: true,
            data: true,
          });
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to delete page data: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete page data: ${error}`,
      };
    }
  }

  /**
   * 根据URL删除页面数据
   */
  static async deleteByUrl(url: string): Promise<DBResult<boolean>> {
    try {
      const pageDataResult = await this.getByUrl(url);
      if (!pageDataResult.success || !pageDataResult.data) {
        return {
          success: false,
          error: "Page data not found",
        };
      }

      return await this.delete(pageDataResult.data.id!);
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete page data: ${error}`,
      };
    }
  }

  /**
   * 获取或创建页面数据（如果不存在则创建）
   */
  static async getOrCreate(
    pageDataInput: Omit<DBPageData, "id" | "createDate" | "updateDate">
  ): Promise<DBResult<DBPageData>> {
    try {
      // 首先尝试根据URL获取现有数据
      const existingResult = await this.getByUrl(pageDataInput.url);
      if (existingResult.success && existingResult.data) {
        return existingResult;
      }

      // 如果不存在，则创建新的页面数据
      const newPageData: Omit<DBPageData, "id"> = {
        ...pageDataInput,
        createDate: Date.now(),
      };

      const addResult = await this.add(newPageData);
      console.log("addResult", addResult);

      if (!addResult.success || !addResult.data) {
        return {
          success: false,
          error: "Failed to create page data",
        };
      }

      // 返回新创建的页面数据
      return await this.getById(addResult.data);
    } catch (error) {
      return {
        success: false,
        error: `Failed to get or create page data: ${error}`,
      };
    }
  }

  /**
   * 获取或创建页面数据（如果不存在则创建）
   */
  static async create(
    pageDataInput: Omit<DBPageData, "id" | "createDate" | "updateDate">
  ): Promise<DBResult<DBPageData>> {
    try {
      // 创建新的页面数据
      const newPageData: Omit<DBPageData, "id"> = {
        ...pageDataInput,
        createDate: Date.now(),
      };

      const addResult = await this.add(newPageData);
      if (!addResult.success || !addResult.data) {
        return {
          success: false,
          error: "Failed to create page data",
        };
      }

      // 返回新创建的页面数据
      return await this.getById(addResult.data);
    } catch (error) {
      return {
        success: false,
        error: `Failed to get or create page data: ${error}`,
      };
    }
  }
}
