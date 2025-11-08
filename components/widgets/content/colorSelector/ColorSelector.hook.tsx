import React from "react";
import {
  ColorSelectorProps,
  defaultColorSelectorArray,
} from "./ColorSelector.type";

export const useColorSelector = (props: ColorSelectorProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const {
    color,
    colorSelectorArray = defaultColorSelectorArray,
    disabled = false,
    onValueChange,
  } = props;
  const componentDisabled = useMemo<boolean>(() => disabled, [disabled]);
  const colorList = useMemo(() => colorSelectorArray, [colorSelectorArray]);
  const currentColor = useMemo(() => color, [color]);
  const toggleOption = React.useCallback(
    (value: string): void => {
      if (disabled) return;
      setSelectedValue(value);
      onValueChange(value);
    },
    [disabled, onValueChange]
  );
  const isSelected = React.useCallback(
    (value: string) => value === selectedValue,
    [selectedValue]
  );

  useEffect(() => {
    setSelectedValue(currentColor || "");
  }, [currentColor]);

  return {
    ...props,
    toggleOption,
    isSelected,
    selectedValue,
    currentColor,
    colorList,
    componentDisabled,
  };
};
