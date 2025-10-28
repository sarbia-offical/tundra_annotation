import ExtMessage, { AnnotateType, BasicType } from "@/entrypoints/type";

/**
 * 标注功能处理器
 * 专门处理与标注相关的消息和操作
 */
export class AnnotationHandler {
  private annotateCallbacks: any = {};
  private initialized = false;

  constructor() {
    // 延迟加载services，避免在模块加载时初始化IndexedDB
    this.initializeCallbacks();
  }

  /**
   * 异步初始化回调函数
   */
  private async initializeCallbacks() {
    try {
      const services = await import("@/services/services");
      this.annotateCallbacks = {
        [AnnotateType.addAnnotate]: services.addAnnotateService,
        [AnnotateType.getAnnotations]: services.getAnnotationsService,
        [AnnotateType.updateAnnotate]: services.updateAnnotateService,
        [AnnotateType.deleteAnnotate]: services.deleteAnnotateService,
      };
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize annotation services:", error);
    }
  }

  /**
   * 处理标注相关消息
   * @param message 消息对象
   * @param sender 发送者信息
   * @param sendResponse 响应回调
   * @returns 是否处理了该消息
   */
  async handleMessage(
    message: ExtMessage,
    sender: any,
    sendResponse: (response: any) => void
  ): Promise<boolean> {
    const { messageType, basicType } = message;

    // 只处理标注类型的消息
    if (basicType !== BasicType.annotate) {
      return false;
    }

    const handler = this.annotateCallbacks[messageType as AnnotateType];
    if (!handler) {
      console.warn(`Unknown annotation message type: ${messageType}`);
      return false;
    }

    try {
      const result = await handler(message.params as any);
      console.log("result", result);
      sendResponse(result);
      return true;
    } catch (error) {
      sendResponse({
        success: false,
        data: `Failed to process ${messageType}: ${error}`,
      });
      return true;
    }
  }

  /**
   * 获取支持的消息类型
   */
  getSupportedMessageTypes(): AnnotateType[] {
    return Object.keys(this.annotateCallbacks) as AnnotateType[];
  }
}
