import { dbManager } from "./indexeddb.config";
import { DBNote, DBResult } from "./indexeddb.type";

/**
 * Note表的CRUD操作
 */
export class NoteDB {
  /**
   * 添加笔记
   */
  static async add(note: Omit<DBNote, "id">): Promise<DBResult<number>> {
    try {
      const store = dbManager.getStore("notes", "readwrite");
      const request = store.add(note);

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
            error: `Failed to add note: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to add note: ${error}`,
      };
    }
  }

  /**
   * 根据ID获取笔记
   */
  static async getById(id: number): Promise<DBResult<DBNote>> {
    try {
      const store = dbManager.getStore("notes", "readonly");
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
              error: "Note not found",
            });
          }
        };

        request.onerror = () => {
          resolve({
            success: false,
            error: `Failed to get note: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get note: ${error}`,
      };
    }
  }

  /**
   * 根据标注ID获取所有笔记
   */
  static async getByAnnotationId(
    annotationId: string
  ): Promise<DBResult<DBNote[]>> {
    try {
      const store = dbManager.getStore("notes", "readonly");
      const index = store.index("annotationId");
      const request = index.getAll(annotationId);

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
            error: `Failed to get notes: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get notes: ${error}`,
      };
    }
  }

  /**
   * 根据用户ID获取所有笔记
   */
  static async getByUserId(userId: string): Promise<DBResult<DBNote[]>> {
    try {
      const store = dbManager.getStore("notes", "readonly");
      const index = store.index("userId");
      const request = index.getAll(userId);

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
            error: `Failed to get notes: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get notes: ${error}`,
      };
    }
  }

  /**
   * 获取所有笔记
   */
  static async getAll(): Promise<DBResult<DBNote[]>> {
    try {
      const store = dbManager.getStore("notes", "readonly");
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
            error: `Failed to get notes: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to get notes: ${error}`,
      };
    }
  }

  /**
   * 更新笔记
   */
  static async update(note: DBNote): Promise<DBResult<boolean>> {
    try {
      if (!note.id) {
        return {
          success: false,
          error: "Note ID is required for update",
        };
      }

      note.updateDate = Date.now();
      const store = dbManager.getStore("notes", "readwrite");
      const request = store.put(note);

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
            error: `Failed to update note: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to update note: ${error}`,
      };
    }
  }

  /**
   * 删除笔记
   */
  static async delete(id: number): Promise<DBResult<boolean>> {
    try {
      const store = dbManager.getStore("notes", "readwrite");
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
            error: `Failed to delete note: ${request.error?.message}`,
          });
        };
      });
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete note: ${error}`,
      };
    }
  }

  /**
   * 根据标注ID删除所有相关笔记
   */
  static async deleteByAnnotationId(
    annotationId: string
  ): Promise<DBResult<boolean>> {
    try {
      const notesResult = await this.getByAnnotationId(annotationId);
      if (!notesResult.success || !notesResult.data) {
        return {
          success: false,
          error: "Notes not found",
        };
      }

      const deletePromises = notesResult.data.map((note) => {
        if (note.id) {
          return this.delete(note.id);
        }
        return Promise.resolve({ success: false, error: "Note ID missing" });
      });

      const results = await Promise.all(deletePromises);
      const hasError = results.some((result) => !result.success);

      if (hasError) {
        return {
          success: false,
          error: "Some notes failed to delete",
        };
      }

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to delete notes: ${error}`,
      };
    }
  }

  /**
   * 批量添加笔记
   */
  static async addMultiple(
    notes: Omit<DBNote, "id">[]
  ): Promise<DBResult<number[]>> {
    try {
      const results: number[] = [];
      const transaction = dbManager.transaction("notes", "readwrite");
      const store = transaction.objectStore("notes");

      const promises = notes.map((note) => {
        return new Promise<number>((resolve, reject) => {
          const request = store.add(note);
          request.onsuccess = () => resolve(request.result as number);
          request.onerror = () => reject(request.error);
        });
      });

      const ids = await Promise.all(promises);
      return {
        success: true,
        data: ids,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to add multiple notes: ${error}`,
      };
    }
  }
}
