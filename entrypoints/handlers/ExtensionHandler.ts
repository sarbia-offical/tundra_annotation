import ExtMessage, { MessageType } from "@/entrypoints/type";

/**
 * 扩展操作处理器
 * 处理扩展图标点击、侧边栏面板等扩展程序相关操作
 */
export class ExtensionHandler {
  /**
   * 初始化扩展程序设置
   */
  async initialize(): Promise<void> {
    try {
      // 检查是否在浏览器扩展环境中
      if (typeof browser === "undefined") {
        console.warn(
          "Browser extension APIs not available, skipping extension initialization"
        );
        return;
      }

      // 设置侧边栏面板行为
      await browser.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error: any) => {
          console.error("Failed to set panel behavior:", error);
        });

      // 注册扩展图标点击监听器
      browser.action.onClicked.addListener(
        this.handleExtensionClick.bind(this)
      );

      console.log("Extension handlers initialized successfully");
    } catch (error) {
      console.error("Failed to initialize extension handlers:", error);
    }
  }

  /**
   * 处理扩展图标点击事件
   * @param tab 当前标签页信息
   */
  private async handleExtensionClick(tab: any): Promise<void> {
    try {
      if (typeof browser === "undefined") {
        console.warn("Browser APIs not available");
        return;
      }

      if (tab.id) {
        await browser.tabs.sendMessage(tab.id, {
          messageType: MessageType.clickExtIcon,
        });
        console.log(`Extension click message sent to tab ${tab.id}`);
      }
    } catch (error) {
      console.error("Failed to handle extension click:", error);
    }
  }
}
