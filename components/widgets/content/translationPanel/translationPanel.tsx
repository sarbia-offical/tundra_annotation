import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";
import {
  TranslationPanelProps,
  TranslationPanelRef,
} from "./translationPanel.type";
import { StoreProvider } from "./translationPanel.context";
import { usePopoverPosition } from "./translationPanel.hook";

const TranslationPanel = React.forwardRef<
  TranslationPanelRef,
  TranslationPanelProps
>((props, ref) => {
  const { positionStyle, visible, textContext } = usePopoverPosition(props);

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
          <Popover open={true}>
            <PopoverTrigger asChild>
              <div />
            </PopoverTrigger>
            <PopoverContent className="z-[1000] dark:bg-neutral-900">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">translate</h4>
                  <p className="text-muted-foreground text-sm">{textContext}</p>
                </div>
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
