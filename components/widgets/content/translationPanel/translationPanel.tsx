import React, { useEffect } from "react";
import { TranslationPanelProps } from "./TranslationPanel.type";
import { TranslationContextProvider } from "./TranslationPanel.context";
import { useTranslationContext } from "./TranslationPanel.hook";
import { Popover, PopoverContent } from "@/components/ui/popover/Popover";
import { TranslationActions } from "./TranslationActions";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskQueueManager } from "@/lib/TaskQueue";
import { cancelableApi } from "@/service/newapi";
import { Input } from "@/components/ui/input";

const TranslationPanelWrapper: React.FC<TranslationPanelProps> = (props) => {
  const { visible, positionStyle, to, textContext, children, close } =
    useTranslationContext(props);
  const taskQueueManagerRef = React.useRef<TaskQueueManager | null>(
    new TaskQueueManager({ maxConcurrent: 3 })
  );
  React.useEffect(() => {
    if (visible) {
      // const fn = async () => {
      //   // 同时将所有任务加入队列
      //   const promises = [
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 1,
      //       });
      //       const result = await response;
      //       console.log("任务1完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 2,
      //       });
      //       const result = await response;
      //       console.log("任务2完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 3,
      //       });
      //       const result = await response;
      //       console.log("任务3完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 4,
      //       });
      //       const result = await response;
      //       console.log("任务4完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 5,
      //       });
      //       const result = await response;
      //       console.log("任务5完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 6,
      //       });
      //       const result = await response;
      //       console.log("任务5完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 7,
      //       });
      //       const result = await response;
      //       console.log("任务7完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 8,
      //       });
      //       const result = await response;
      //       console.log("任务8完成:", result);
      //       return result;
      //     }),
      //     taskQueueManagerRef.current?.enqueue(async () => {
      //       const { response } = cancelableApi.get(`/api/race-condition-test`, {
      //         color: 9,
      //       });
      //       const result = await response;
      //       console.log("任务9完成:", result);
      //       return result;
      //     }),
      //   ];
      //   // 等待所有任务完成
      //   const results = await Promise.all(promises);
      //   console.log("所有任务完成", results);
      // };
      // fn();
    }
  }, [visible]);
  return (
    <TranslationContextProvider initialConfig={props}>
      <Popover
        isOpen={visible}
        onClose={() => {
          close && close();
        }}
        position={{
          top: `${positionStyle.y}px`,
          left: `${positionStyle.x}px`,
        }}
      >
        <PopoverContent className="w-[400px] min-h-[100px] flex flex-col justify-between">
          <Button
            size="iconMini"
            variant="icon"
            onClick={() => close && close()}
            className="absolute top-2 right-2"
            title="关闭"
          >
            <X className="w-4 h-4 text-ctx-primary-inverse/80" />
          </Button>
          <div className="text-base flex-1">{textContext}</div>
          <TranslationActions className="mt-4" textContext={textContext} />
          <div className="mt-4">{children}</div>
        </PopoverContent>
      </Popover>
    </TranslationContextProvider>
  );
};

const TranslationPanel = React.memo(TranslationPanelWrapper);
TranslationPanel.displayName = "TranslationPanel";
export { TranslationPanel };
