import React from "react";
import { ColorSelectorOptionConfig } from "./ColorSelector.type";
import { useColorSelectorContext } from "./ColorSelector.context";
import { Check } from "lucide-react";

const ColorSelectorOption = React.forwardRef<
  HTMLDivElement,
  ColorSelectorOptionConfig
>((props, ref) => {
  const { style, value } = props;
  const { toggleOption, isSelected } = useColorSelectorContext();
  const selected = isSelected(value);
  return (
    <div
      ref={ref}
      className={`relative inline-flex items-center justify-center
        w-[20px] h-[20px] rounded-full mx-[3px]
        cursor-pointer shadow-sm
        transform transition-transform 
        hover:brightness-105 hover:scale-110 
        opacity-70 hover:opacity-100
        ${selected ? "ring-2 ring-offset-1 ring-indigo-400 opacity-100" : ""}`}
      style={{ backgroundColor: style.bgColor }}
      data-color={value}
      onPointerDown={(_e: React.PointerEvent<HTMLDivElement>) => {
        toggleOption(value);
      }}
    >
      {selected ? <Check className="w-3 h-3 text-white" /> : <></>}
    </div>
  );
});
ColorSelectorOption.displayName = "ColorSelector";
export { ColorSelectorOption };
