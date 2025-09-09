import React from "react";
import { useTranslation } from "react-i18next";
import { MarkState } from "../state/type";
import { useMarkContext } from "../state/hooks";

interface ColorSelectorProps extends React.ComponentProps<"input"> {
  onClear?: () => void;
}

const ColorSelector = React.forwardRef<HTMLDivElement, ColorSelectorProps>(
  ({ className, type, value, onClear, ...props }, ref) => {
    const changeColor = useMarkContext((state: MarkState) => state.changeColor);
    const colorList = [
      "#ed4845",
      "#4b2e2b",
      "#e2d849",
      "#2474b5",
      "#e3b4b8",
      "#43b244",
    ];
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const color = e.currentTarget.getAttribute("data-color") as string;
      onHighlightElementClick(color);
    };
    const onHighlightElementClick = (color: string) => {
      changeColor(color);
    };
    return (
      <div className={`flex ${className || ""}`}>
        {colorList.map((color, index) => (
          <div
            key={color}
            className={`inline-block w-[20px] h-[20px] rounded-full mx-[3px]
            cursor-pointer shadow-sm
            transform transition-transform hover:brightness-105 hover:scale-110 opacity-50 hover:opacity-100`}
            style={{ backgroundColor: color }}
            data-color={color}
            onPointerDown={handlePointerDown}
          ></div>
        ))}
      </div>
    );
  }
);

export default ColorSelector;
