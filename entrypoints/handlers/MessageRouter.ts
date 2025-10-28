import ExtMessage from "@/entrypoints/type";
import { AnnotationHandler } from "./AnnotationHandler";
import { SystemHandler } from "./SystemHandler";
import { ExtensionHandler } from "./ExtensionHandler";

/**
 * 消息路由器
 * 负责将收到的消息分发给相应的处理器
 */
export class MessageRouter {
  private annotationHandler: AnnotationHandler;
  private systemHandler: SystemHandler;
  private extensionHandler: ExtensionHandler;

  constructor() {
    this.annotationHandler = new AnnotationHandler();
    this.systemHandler = new SystemHandler();
    this.extensionHandler = new ExtensionHandler();
  }

  /**
   * 初始化路由器和所有处理器
   */
  async initialize(): Promise<void> {
    try {
      // 检查是否在浏览器扩展环境中
      if (typeof browser === "undefined") {
        return;
      }

      // 初始化扩展程序处理器
      await this.extensionHandler.initialize();

      // 注册消息监听器
      browser.runtime.onMessage.addListener(
        (
          message: ExtMessage,
          sender: any,
          sendResponse: (response: any) => void
        ) => {
          this.handleMessage(message, sender, sendResponse);
          return true;
        }
      );
    } catch (error) {
      console.error("Failed to initialize message router:", error);
    }
  }

  /**
   * 处理收到的消息
   * @param message 消息对象
   * @param sender 发送者信息
   * @param sendResponse 响应回调
   * @returns 是否处理了该消息
   */
  private async handleMessage(
    message: ExtMessage,
    sender: any,
    sendResponse: (response: any) => void
  ): Promise<boolean> {
    try {
      // 按优先级尝试各个处理器
      const handlers = [this.annotationHandler, this.systemHandler];

      for (const handler of handlers) {
        const handled = await handler.handleMessage(
          message,
          sender,
          sendResponse
        );
        if (handled) {
          return true;
        }
      }

      sendResponse({
        success: false,
        data: `Unknown message type: ${message.messageType}`,
      });
      return false;
    } catch (error) {
      sendResponse({
        success: false,
        data: `Message routing error: ${error}`,
      });
      return true;
    }
  }
}
