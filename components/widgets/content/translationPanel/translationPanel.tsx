import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";
import {
  TranslationPanelProps,
  TranslationPanelRef,
} from "./TranslationPanel.type";
import { StoreProvider } from "./TranslationPanel.context";
import { useTranslationPopover } from "./TranslationPanel.hook";

const TranslationPanel = React.forwardRef<
  TranslationPanelRef,
  TranslationPanelProps
>((props, ref) => {
  const { positionStyle, visible, textContext, children } =
    useTranslationPopover(props);

  React.useImperativeHandle(ref, () => ({
    open: () => {},
    close: () => {},
  }));
  return (
    <StoreProvider initialConfig={props}>
      {visible ? (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            ...positionStyle,
          }}
        >
          <Popover open={true} modal={false}>
            <PopoverTrigger asChild>
              <div />
            </PopoverTrigger>
            <PopoverContent className="z-[1000] dark:bg-neutral-900">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">translate</h4>
                  <p className="text-muted-foreground text-sm">{textContext}</p>
                </div>
                {children}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <></>
      )}
    </StoreProvider>
  );
});
TranslationPanel.displayName = "TranslationPanel";
export { TranslationPanel };
