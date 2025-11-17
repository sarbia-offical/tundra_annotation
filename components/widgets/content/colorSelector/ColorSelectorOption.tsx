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
        flex-[0.8] aspect-square rounded-lg
        cursor-pointer shadow-sm
        transform transition-all duration-200
        hover:brightness-105 hover:scale-110 
        opacity-70 hover:opacity-100
        ${
          selected
            ? "ring-2 ring-offset-1 ring-indigo-400 opacity-100 scale-105"
            : ""
        }`}
      style={{ backgroundColor: style.bgColor }}
      data-color={value}
      onPointerDown={(_e: React.PointerEvent<HTMLDivElement>) => {
        toggleOption(value);
      }}
    >
      {selected ? <Check className="w-5 h-5 text-white" /> : <></>}
    </div>
  );
});
ColorSelectorOption.displayName = "ColorSelector";
export { ColorSelectorOption };
