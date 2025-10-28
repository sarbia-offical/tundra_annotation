import ExtMessage, { MessageType } from "@/entrypoints/type";

/**
 * 系统设置处理器
 * 处理主题切换、语言设置、默认启用状态等系统配置相关操作
 */
export class SystemHandler {
  /**
   * 处理系统设置相关消息
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
    const { messageType } = message;
    try {
      await this.broadcastToAllTabs(message);
      sendResponse(true);
      return true;
    } catch (error) {
      sendResponse(false);
      return true;
    }
  }

  /**
   * 向所有活动标签页广播消息
   * @param message 要广播的消息
   */
  private async broadcastToAllTabs(message: ExtMessage): Promise<void> {
    try {
      // 检查是否在浏览器扩展环境中
      if (typeof browser === "undefined") {
        return;
      }

      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      const broadcastPromises = tabs.map((tab) => {
        if (tab.id) {
          return browser.tabs.sendMessage(tab.id, message).catch((error) => {
            console.warn(`Failed to send message to tab ${tab.id}:`, error);
          });
        }
        return Promise.resolve();
      });

      await Promise.all(broadcastPromises);
    } catch (error) {
      throw error;
    }
  }
}
