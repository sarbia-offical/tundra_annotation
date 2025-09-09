import { Check } from "lucide-react";
import React, { useCallback, useState } from "react";

type ColorPickerProps = {
  colors?: string[]; // hex 颜色数组（可选）
  value?: string; // 当前选中颜色（可选）
  onChange?: (color: string) => void; // 颜色改变回调（可选）
  className?: string;
};

const defaultColors = [
  "#ed4845",
  "#4b2e2b",
  "#e2d849",
  "#2474b5",
  "#e3b4b8",
  "#43b244",
  "#1890FF",
  "#12B886",
  "#40C057",
  "#82C91E",
  "#F59F00",
  "#FFC107",
  "#FF922B",
  "#FF6D00",
  "#E03131",
  "#A3E635",
  "#7C3AED",
  "#00C2A8",
  "#F472B6",
  "#64748B",
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors = defaultColors,
  value,
  onChange,
  className = "",
}) => {
  const [selected, setSelected] = useState<string | undefined>(value);

  // 同步外部 value（如果父组件控制）
  React.useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const handleSelect = useCallback(
    (color: string) => {
      setSelected(color);
      onChange?.(color);
    },
    [onChange]
  );

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="flex flex-row flex-wrap gap-3 items-center">
        {colors.map((color) => {
          const isSelected = selected === color;
          return (
            <div
              key={color}
              onClick={() => handleSelect(color)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(color);
                }
              }}
              className={`relative flex items-center justify-center
                w-[20px] h-[20px]
                rounded-full shadow-2xl
                cursor-pointer
                transform transition duration-150 ease-in-out
                ${
                  isSelected
                    ? "ring-2 ring-offset-1 ring-indigo-400"
                    : "hover:scale-105"
                }
              `}
              style={{ backgroundColor: color }}
              role="listitem"
            >
              {isSelected ? <Check className="w-3 h-3 text-white" /> : <></>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;
