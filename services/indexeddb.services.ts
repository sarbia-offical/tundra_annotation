import { Annotate } from "./api.type";
import { AnnotationDB } from "./annotation.db";
import { NoteDB } from "./note.db";
import { PageDataDB } from "./pagedata.db";
import {
  DBAnnotation,
  DBNote,
  DBResult,
  FullAnnotation,
} from "./indexeddb.type";

/**
 * IndexedDB服务层 - 提供与原services.ts相同的接口
 */
export class IndexedDBService {
  /**
   * 添加标注
   * @param params 标注参数
   * @returns
   */
  static async addAnnotate(
    params: Annotate
  ): Promise<{ success: boolean; data: string | FullAnnotation }> {
    try {
      // 1. 处理页面数据
      const pageDataResult = await PageDataDB.getOrCreate({
        url: params.pageData.url,
        title: params.pageData.title,
        host: params.pageData.host,
      });

      if (!pageDataResult.success || !pageDataResult.data) {
        return {
          success: false,
          data: "Failed to create or get page data",
        };
      }

      // 2. 创建标注
      const annotationData: Omit<DBAnnotation, "id"> = {
        uid: params.uid,
        textBefore: params.textBefore,
        text: params.text,
        textAfter: params.textAfter,
        pageDataId: pageDataResult.data.id!,
        startContainerPath: params.startContainerPath,
        endContainerPath: params.endContainerPath,
        startOffset: params.startOffset,
        endOffset: params.endOffset,
        color: params.color,
        createDate: params.createDate,
        updateDate: params.updateDate,
      };

      const annotationResult = await AnnotationDB.add(annotationData);
      if (!annotationResult.success || !annotationResult.data) {
        return {
          success: false,
          data: "Failed to create annotation",
        };
      }

      // 3. 添加笔记
      if (params.data.notes && params.data.notes.length > 0) {
        const notes: Omit<DBNote, "id">[] = params.data.notes.map((note) => ({
          ...note,
          annotationId: params.uid,
          createDate: note.date,
        }));
        console.log("notes", notes);
        const notesResult = await NoteDB.addMultiple(notes);
        if (!notesResult.success) {
          return {
            success: false,
            data: "Failed to create notes",
          };
        }
      }

      // 4. 返回完整的标注信息
      const fullAnnotation = await this.getFullAnnotationByUid(params.uid);
      return {
        success: true,
        data: fullAnnotation.success ? fullAnnotation.data! : "success",
      };
    } catch (error) {
      return {
        success: false,
        data: `Failed to add annotation: ${error}`,
      };
    }
  }

  /**
   * 获取标注列表
   * @param params 查询参数
   * @returns
   */
  static async getAnnotations(params: {
    path?: string;
  }): Promise<{ success: boolean; data: Annotate[] }> {
    try {
      let annotations: DBAnnotation[] = [];

      if (params.path) {
        // 根据URL获取页面数据
        const pageDataResult = await PageDataDB.getByUrl(params.path);

        if (pageDataResult.success && pageDataResult.data) {
          const annotationsResult = await AnnotationDB.getByPageDataId(
            pageDataResult.data.id!
          );
          if (annotationsResult.success) {
            annotations = annotationsResult.data || [];
          }
        }
      } else {
        // 获取所有标注
        const annotationsResult = await AnnotationDB.getAll();
        if (annotationsResult.success) {
          annotations = annotationsResult.data || [];
        }
      }

      // 转换为前端格式
      const convertedAnnotations: Annotate[] = [];
      for (const annotation of annotations) {
        const fullAnnotation = await this.convertToAnnotate(annotation);
        if (fullAnnotation) {
          convertedAnnotations.push(fullAnnotation);
        }
      }

      return {
        success: true,
        data: convertedAnnotations,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }

  /**
   * 更新标注
   * @param params 更新参数
   * @returns
   */
  static async updateAnnotate(
    params: Annotate
  ): Promise<{ success: boolean; data: Annotate | string }> {
    try {
      // 1. 获取现有标注
      const existingAnnotationResult = await AnnotationDB.getByUid(params.uid);
      if (!existingAnnotationResult.success || !existingAnnotationResult.data) {
        return {
          success: false,
          data: "Annotation not found",
        };
      }

      // 2. 更新标注
      const updatedAnnotation: DBAnnotation = {
        ...existingAnnotationResult.data,
        textBefore: params.textBefore,
        text: params.text,
        textAfter: params.textAfter,
        startContainerPath: params.startContainerPath,
        endContainerPath: params.endContainerPath,
        startOffset: params.startOffset,
        endOffset: params.endOffset,
        color: params.color,
        updateDate: Date.now(),
      };

      const updateResult = await AnnotationDB.update(updatedAnnotation);
      if (!updateResult.success) {
        return {
          success: false,
          data: "Failed to update annotation",
        };
      }

      // 4. 更新笔记（删除旧的，添加新的）
      await NoteDB.deleteByAnnotationId(params.uid);
      if (params.data.notes && params.data.notes.length > 0) {
        const notes: Omit<DBNote, "id">[] = params.data.notes.map((note) => ({
          ...note,
          annotationId: params.uid,
          createDate: note.date,
          updateDate: Date.now(),
        }));

        await NoteDB.addMultiple(notes);
      }

      // 5. 返回更新后的标注
      const convertedAnnotation = await this.convertToAnnotate(
        updatedAnnotation
      );
      return {
        success: true,
        data: convertedAnnotation || params,
      };
    } catch (error) {
      return {
        success: false,
        data: `Failed to update annotation: ${error}`,
      };
    }
  }

  /**
   * 删除标注
   * @param params 删除参数
   * @returns
   */
  static async deleteAnnotate(params: {
    uid: string;
  }): Promise<{ success: boolean; data: string }> {
    try {
      // 1. 删除相关笔记
      const deleteNotesResult = await NoteDB.deleteByAnnotationId(params.uid);
      if (!deleteNotesResult.success) {
        return {
          success: false,
          data: "Failed to delete related notes",
        };
      }

      // 2. 删除标注
      const deleteAnnotationResult = await AnnotationDB.deleteByUid(params.uid);
      if (!deleteAnnotationResult.success) {
        return {
          success: false,
          data: "Failed to delete annotation",
        };
      }

      return {
        success: true,
        data: "Annotation deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: `Failed to delete annotation: ${error}`,
      };
    }
  }

  /**
   * 根据UID获取完整标注信息
   */
  private static async getFullAnnotationByUid(
    uid: string
  ): Promise<DBResult<FullAnnotation>> {
    try {
      const annotationResult = await AnnotationDB.getByUid(uid);
      if (!annotationResult.success || !annotationResult.data) {
        return {
          success: false,
          error: "Annotation not found",
        };
      }

      const notesResult = await NoteDB.getByAnnotationId(uid);
      const pageDataResult = await PageDataDB.getById(
        annotationResult.data.pageDataId
      );

      if (!pageDataResult.success || !pageDataResult.data) {
        return {
          success: false,
          error: "Page data not found",
        };
      }

      const fullAnnotation: FullAnnotation = {
        ...annotationResult.data,
        notes: notesResult.success ? notesResult.data || [] : [],
        pageData: pageDataResult.data,
      };

      return {
        success: true,
        data: fullAnnotation,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get full annotation: ${error}`,
      };
    }
  }

  /**
   * 将数据库格式转换为前端API格式
   */
  private static async convertToAnnotate(
    dbAnnotation: DBAnnotation
  ): Promise<Annotate | null> {
    try {
      const notesResult = await NoteDB.getByAnnotationId(dbAnnotation.uid);
      const pageDataResult = await PageDataDB.getById(dbAnnotation.pageDataId);

      if (!pageDataResult.success || !pageDataResult.data) {
        return null;
      }

      const annotate: Annotate = {
        uid: dbAnnotation.uid,
        data: {
          notes: notesResult.success ? notesResult.data || [] : [],
        },
        textBefore: dbAnnotation.textBefore,
        text: dbAnnotation.text,
        textAfter: dbAnnotation.textAfter,
        pageData: {
          url: pageDataResult.data.url,
          title: pageDataResult.data.title,
          host: pageDataResult.data.host,
        },
        startContainerPath: dbAnnotation.startContainerPath,
        endContainerPath: dbAnnotation.endContainerPath,
        startOffset: dbAnnotation.startOffset,
        endOffset: dbAnnotation.endOffset,
        color: dbAnnotation.color,
        createDate: dbAnnotation.createDate,
        updateDate: dbAnnotation.updateDate,
      };

      return annotate;
    } catch (error) {
      return null;
    }
  }
}

// 导出与原services.ts相同的函数接口
export const addAnnotateService = IndexedDBService.addAnnotate;
export const getAnnotationsService = IndexedDBService.getAnnotations;
export const updateAnnotateService = IndexedDBService.updateAnnotate;
export const deleteAnnotateService = IndexedDBService.deleteAnnotate;
