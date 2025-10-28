import { MessageRouter } from "./handlers/MessageRouter";

/**
 * Background Script 入口
 * 使用分层架构处理各种类型的消息和操作
 */
export default defineBackground(() => {
  console.log("Background script starting...");

  // 创建并初始化消息路由器
  const messageRouter = new MessageRouter();

  // 异步初始化
  messageRouter
    .initialize()
    .then(() => {
      console.log("Background script initialized successfully");
    })
    .catch((error) => {
      console.error("Failed to initialize background script:", error);
    });
});
