import React, { useState, useCallback } from "react";
import { Check } from "lucide-react";

interface ColorSelectorProps extends React.ComponentProps<"input"> {
  setColor: (color: string) => void;
}

const ColorSelector = React.forwardRef<HTMLDivElement, ColorSelectorProps>(
  ({ className, setColor }, ref) => {
    const colorList = [
      "#ed4845",
      "#4b2e2b",
      "#e2d849",
      "#2474b5",
      "#e3b4b8",
      "#43b244",
    ];

    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (color: string) => {
      setSelected(color);
      setColor(color);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const color = e.currentTarget.getAttribute("data-color") as string;
      handleSelect(color);
    };

    return (
      <div className={`flex ${className || ""}`}>
        {colorList.map((color) => {
          const isSelected = selected === color;
          return (
            <div
              key={color}
              ref={ref}
              className={`relative inline-flex items-center justify-center
              w-[20px] h-[20px] rounded-full mx-[3px]
              cursor-pointer shadow-sm
              transform transition-transform 
              hover:brightness-105 hover:scale-110 
              opacity-70 hover:opacity-100
              ${
                isSelected
                  ? "ring-2 ring-offset-1 ring-indigo-400 opacity-100"
                  : ""
              }`}
              style={{ backgroundColor: color }}
              data-color={color}
              onPointerDown={handlePointerDown}
            >
              {isSelected ? <Check className="w-3 h-3 text-white" /> : <></>}
            </div>
          );
        })}
      </div>
    );
  }
);

export default ColorSelector;
