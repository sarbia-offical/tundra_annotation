import ExtMessage, {
  AnnotateType,
  BasicType,
  MessageType,
} from "@/entrypoints/type";
import {
  addAnnotateService,
  deleteAnnotateService,
  updateAnnotateService,
  getAnnotationsService,
} from "@/services/services";

export default defineBackground(() => {
  // @ts-ignore
  browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: any) => console.error(error));

  browser.action.onClicked.addListener((tab) => {
    // 发送消息给content-script.js
    browser.tabs.sendMessage(tab.id!, {
      messageType: MessageType.clickExtIcon,
    });
  });

  const annotateCallback = {
    [AnnotateType.addAnnotate]: addAnnotateService,
    [AnnotateType.getAnnotations]: getAnnotationsService,
    [AnnotateType.updateAnnotate]: updateAnnotateService,
    [AnnotateType.deleteAnnotate]: deleteAnnotateService,
  };

  // Updated message listener
  browser.runtime.onMessage.addListener(
    (message: ExtMessage, sender, sendResponse) => {
      const { messageType, basicType } = message;
      if (messageType === MessageType.clickExtIcon) {
        (async () => {
          const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          await browser.tabs.sendMessage(tab.id!, {
            messageType: MessageType.clickExtIcon,
          });
        })();
        sendResponse(true); // 同步发送响应
        return true; // 必须返回 true 表示已调用 sendResponse
      } else if (
        messageType === MessageType.changeTheme ||
        messageType === MessageType.changeLocale ||
        messageType === MessageType.changeDefaultEnabled
      ) {
        (async () => {
          const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
          });
          for (const tab of tabs) {
            browser.tabs.sendMessage(tab.id!, message).catch(console.error);
          }
        })();
        return true;
      } else if (basicType === BasicType.annotate) {
        const handler = annotateCallback[messageType];
        if (!handler) return;
        // WXT 20版本处理监听器，使用sendResponse的回调函数新写法
        (async () => {
          const data = await handler(message.params);
          console.log("data", data);

          sendResponse(data);
        })();
        return true;
      }
      return false;
    }
  );
});
