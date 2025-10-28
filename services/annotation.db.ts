import { dbManager } from "./indexeddb.config";
import {
  DBAnnotation,
  DBNote,
  DBPageData,
  DBResult,
  FullAnnotation,
} from "./indexeddb.type";

/**
 * Annotation表的CRUD操作
 */
export class AnnotationDB {
  /**
   * 添加标注
   */
  static async add(
    annotation: Omit<DBAnnotation, "id">
  ): Promise<DBResult<number>> {
    try {
      const store = dbManager.getStore("annotations", "readwrite");
      const request = store.add(annotation);

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
            error: `Failed to add annotation: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to add annotation: ${error}`,
      };
    }
  }

  /**
   * 根据ID获取标注
   */
  static async getById(id: number): Promise<DBResult<DBAnnotation>> {
    try {
      const store = dbManager.getStore("annotations", "readonly");
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
              error: "Annotation not found",
            });
          }
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get annotation: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get annotation: ${error}`,
      };
    }
  }

  /**
   * 根据UID获取标注
   */
  static async getByUid(uid: string): Promise<DBResult<DBAnnotation>> {
    try {
      const store = dbManager.getStore("annotations", "readonly");
      const index = store.index("uid");
      const request = index.get(uid);

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
              error: "Annotation not found",
            });
          }
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get annotation: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get annotation: ${error}`,
      };
    }
  }

  /**
   * 根据页面数据ID获取所有标注
   */
  static async getByPageDataId(
    pageDataId: number
  ): Promise<DBResult<DBAnnotation[]>> {
    try {
      const store = dbManager.getStore("annotations", "readonly");
      const index = store.index("pageDataId");
      const request = index.getAll(pageDataId);

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
            error: `Failed to get annotations: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get annotations: ${error}`,
      };
    }
  }

  /**
   * 获取所有标注
   */
  static async getAll(): Promise<DBResult<DBAnnotation[]>> {
    try {
      const store = dbManager.getStore("annotations", "readonly");
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
            error: `Failed to get annotations: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get annotations: ${error}`,
      };
    }
  }

  /**
   * 更新标注
   */
  static async update(annotation: DBAnnotation): Promise<DBResult<boolean>> {
    try {
      if (!annotation.id) {
        return {
          success: false,
          error: "Annotation ID is required for update",
        };
      }

      annotation.updateDate = Date.now();
      const store = dbManager.getStore("annotations", "readwrite");
      const request = store.put(annotation);

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
            error: `Failed to update annotation: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to update annotation: ${error}`,
      };
    }
  }

  /**
   * 删除标注
   */
  static async delete(id: number): Promise<DBResult<boolean>> {
    try {
      const store = dbManager.getStore("annotations", "readwrite");
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
            error: `Failed to delete annotation: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete annotation: ${error}`,
      };
    }
  }

  /**
   * 根据UID删除标注
   */
  static async deleteByUid(uid: string): Promise<DBResult<boolean>> {
    try {
      const annotationResult = await this.getByUid(uid);
      if (!annotationResult.success || !annotationResult.data) {
        return {
          success: false,
          error: "Annotation not found",
        };
      }

      return await this.delete(annotationResult.data.id!);
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete annotation: ${error}`,
      };
    }
  }
}
