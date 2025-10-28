import {
  addAnnotateService,
  getAnnotationsService,
  updateAnnotateService,
  deleteAnnotateService,
} from "./indexeddb.services";
import { Annotate } from "./api.type";

/**
 * IndexedDB服务使用示例
 */
export class IndexedDBUsageExample {
  /**
   * 示例：添加标注
   */
  static async exampleAddAnnotation() {
    const annotation: Annotate = {
      uid: "example-uid-" + Date.now(),
      data: {
        notes: [
          {
            userId: "user123",
            userName: "测试用户",
            text: "这是一个测试标注",
            date: Date.now(),
            isMe: true,
          },
        ],
      },
      textBefore: "这是标注前的文本",
      text: "这是被标注的文本",
      textAfter: "这是标注后的文本",
      pageData: {
        url: "https://example.com/test",
        title: "测试页面",
        host: "example.com",
      },
      startContainerPath: ["DIV[0]", "P[0]", "#text[0]"],
      endContainerPath: ["DIV[0]", "P[0]", "#text[0]"],
      startOffset: 10,
      endOffset: 20,
      color: "#ffff00",
      createDate: Date.now(),
    };

    try {
      const result = await addAnnotateService(annotation);
      console.log("添加标注结果:", result);
      return result;
    } catch (error) {
      console.error("添加标注失败:", error);
      throw error;
    }
  }

  /**
   * 示例：获取指定页面的标注
   */
  static async exampleGetAnnotations(url?: string) {
    try {
      const params = url ? { path: url } : {};
      const result = await getAnnotationsService(params);
      console.log("获取标注结果:", result);
      return result;
    } catch (error) {
      console.error("获取标注失败:", error);
      throw error;
    }
  }

  /**
   * 示例：更新标注
   */
  static async exampleUpdateAnnotation(uid: string) {
    try {
      // 首先获取现有标注
      const annotations = await getAnnotationsService({});
      const existingAnnotation = annotations.data.find((a) => a.uid === uid);

      if (!existingAnnotation) {
        throw new Error("标注不存在");
      }

      // 更新标注内容
      const updatedAnnotation: Annotate = {
        ...existingAnnotation,
        text: "这是更新后的标注文本",
        color: "#00ff00",
        updateDate: Date.now(),
        data: {
          notes: [
            ...(existingAnnotation.data.notes || []),
            {
              userId: "user456",
              userName: "另一个用户",
              text: "添加了新的笔记",
              date: Date.now(),
              isMe: false,
            },
          ],
        },
      };

      const result = await updateAnnotateService(updatedAnnotation);
      console.log("更新标注结果:", result);
      return result;
    } catch (error) {
      console.error("更新标注失败:", error);
      throw error;
    }
  }

  /**
   * 示例：删除标注
   */
  static async exampleDeleteAnnotation(uid: string) {
    try {
      const result = await deleteAnnotateService({ uid });
      console.log("删除标注结果:", result);
      return result;
    } catch (error) {
      console.error("删除标注失败:", error);
      throw error;
    }
  }

  /**
   * 完整的使用流程示例
   */
  static async exampleFullWorkflow() {
    console.log("=== IndexedDB 服务完整使用流程示例 ===");

    try {
      // 1. 添加标注
      console.log("1. 添加标注...");
      const addResult = await this.exampleAddAnnotation();
      const annotationUid =
        typeof addResult.data === "object" ? addResult.data.uid : "";

      if (!annotationUid) {
        throw new Error("无法获取标注UID");
      }

      // 2. 获取所有标注
      console.log("2. 获取所有标注...");
      await this.exampleGetAnnotations();

      // 3. 获取指定页面的标注
      console.log("3. 获取指定页面的标注...");
      await this.exampleGetAnnotations("https://example.com/test");

      // 4. 更新标注
      console.log("4. 更新标注...");
      await this.exampleUpdateAnnotation(annotationUid);

      // 5. 再次获取标注查看更新结果
      console.log("5. 查看更新后的标注...");
      await this.exampleGetAnnotations();

      // 6. 删除标注
      console.log("6. 删除标注...");
      await this.exampleDeleteAnnotation(annotationUid);

      // 7. 确认删除
      console.log("7. 确认标注已删除...");
      await this.exampleGetAnnotations();

      console.log("=== 流程完成 ===");
    } catch (error) {
      console.error("流程执行失败:", error);
    }
  }
}

// 导出便捷的使用函数
export const runIndexedDBExample = IndexedDBUsageExample.exampleFullWorkflow;
