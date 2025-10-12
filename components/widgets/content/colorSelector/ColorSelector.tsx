import React from "react";
import { Check } from "lucide-react";
import { ColorSelectorOption } from "./ColorSelectorOption";
import {
  ColorSelectorOptionConfig,
  ColorSelectorProps,
  ColorSelectorRef,
} from "./ColorSelector.type";
import { useColorSelector } from "./ColorSelector.hook";
import { ColorSelectorProvider } from "./colorSelector.context";
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
        <div className={cn("dark")}>
          <div className={`flex ${className || ""}`}>
            {colorList.map((color: ColorSelectorOptionConfig) => {
              return <ColorSelectorOption {...color} key={color.value} />;
            })}
          </div>
        </div>
      </ColorSelectorProvider>
    );
  }
);

ColorSelector.displayName = "ColorSelector";
export { ColorSelector };
