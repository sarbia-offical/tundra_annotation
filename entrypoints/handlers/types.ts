/**
 * Background Handlers Export
 * 统一导出所有处理器和路由器
 */

export { AnnotationHandler } from "./AnnotationHandler";
export { SystemHandler } from "./SystemHandler";
export { ExtensionHandler } from "./ExtensionHandler";
export { MessageRouter } from "./MessageRouter";

/**
 * Handler 类型定义
 */
export interface IMessageHandler {
  handleMessage(
    message: any,
    sender: any,
    sendResponse: (response: any) => void
  ): Promise<boolean>;

  getSupportedMessageTypes(): any[];
}

/**
 * 处理器配置
 */
export const HANDLER_CONFIG = {
  ANNOTATION: {
    name: "AnnotationHandler",
    description: "处理标注相关操作（添加、获取、更新、删除）",
  },
  SYSTEM: {
    name: "SystemHandler",
    description: "处理系统设置（主题、语言、默认启用状态）",
  },
  EXTENSION: {
    name: "ExtensionHandler",
    description: "处理扩展程序操作（图标点击、侧边栏）",
  },
} as const;
