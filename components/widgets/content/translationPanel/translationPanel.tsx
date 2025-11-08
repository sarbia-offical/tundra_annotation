import React from "react";
import { TranslationPanelProps } from "./TranslationPanel.type";
import { TranslationContextProvider } from "./TranslationPanel.context";
import { useTranslationContext } from "./TranslationPanel.hook";
import { Popover, PopoverContent } from "@/components/ui/popover/Popover";

const TranslationPanelWrapper: React.FC<TranslationPanelProps> = (props) => {
  const { visible, positionStyle, to, textContext, children, close } =
    useTranslationContext(props);
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
        <PopoverContent className="w-[500px] min-h-[100px] flex flex-col justify-between">
          <div>{textContext}</div>
          <div className="mt-4">{children}</div>
        </PopoverContent>
      </Popover>
    </TranslationContextProvider>
  );
};

const TranslationPanel = React.memo(TranslationPanelWrapper);
TranslationPanel.displayName = "TranslationPanel";
export { TranslationPanel };
