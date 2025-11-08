import React from "react";
import { useColorSelectorContext } from "./ColorSelector.context";
import { X } from "lucide-react";

/**
 * 取消颜色选项 - 显示为白色背景，中间有斜线
 */
const ColorSelectorCancelOption = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { toggleOption, isSelected } = useColorSelectorContext();
    const selected = isSelected("cancel");

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center
        w-[20px] h-[20px] rounded-full mx-[3px]
        cursor-pointer shadow-sm border border-gray-300
        transform transition-transform 
        hover:brightness-95 hover:scale-110 
        opacity-70 hover:opacity-100
        ${selected ? "ring-2 ring-offset-1 ring-red-400 opacity-100" : ""}`}
        style={{ backgroundColor: "#ffffff" }}
        data-color="cancel"
        onPointerDown={(_e: React.PointerEvent<HTMLDivElement>) => {
          toggleOption("cancel");
        }}
        title="取消高亮"
      >
        {/* 斜线 */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "rotate(45deg)",
          }}
        >
          <div
            className="w-full h-[2px] bg-red-500"
            style={{
              width: "70%",
            }}
          />
        </div>
      </div>
    );
  }
);

ColorSelectorCancelOption.displayName = "ColorSelectorCancelOption";
export { ColorSelectorCancelOption };
