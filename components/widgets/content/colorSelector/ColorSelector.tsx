import React from "react";
import { ColorSelectorOption } from "./ColorSelectorOption";
import { ColorSelectorCancelOption } from "./ColorSelectorCancelOption";
import {
  ColorSelectorOptionConfig,
  ColorSelectorProps,
  ColorSelectorRef,
} from "./ColorSelector.type";
import { useColorSelector } from "./ColorSelector.hook";
import { ColorSelectorProvider } from "./ColorSelector.context";
import { cn } from "@/lib/utils";

const ColorSelector = React.forwardRef<ColorSelectorRef, ColorSelectorProps>(
  (props, ref) => {
    const contextValue = useColorSelector(props);
    const { colorList, className, toggleOption } = contextValue;
    React.useImperativeHandle(ref, () => ({
      handleClearSelectedValue: () => {
        toggleOption("");
      },
      handleSetSelectedValue: (value: string) => {
        toggleOption(value);
      },
    }));
    return (
      <ColorSelectorProvider value={contextValue}>
        <div className={cn("grid grid-cols-8 gap-4 w-full", className)}>
          {/* 取消颜色选项 */}
          <ColorSelectorCancelOption />
          {/* 颜色选项 */}
          {colorList.map((color: ColorSelectorOptionConfig) => {
            return <ColorSelectorOption {...color} key={color.value} />;
          })}
        </div>
      </ColorSelectorProvider>
    );
  }
);

ColorSelector.displayName = "ColorSelector";

export { ColorSelector };
