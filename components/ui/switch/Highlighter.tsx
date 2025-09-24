import { cn } from "@/lib/utils";
import React from "react";
import { useSwitchContext, useSwitchDispatch } from "./SwitchContext";
import { switchVariants } from "./SwitchVariants";
import { RadioOptionConfig } from "./SwitchTypes";
const baseStyle: React.CSSProperties = {
  position: "absolute",
};
interface HighlighterProps extends Partial<Omit<HTMLDivElement, "className">> {
  highlighterStyle?: React.CSSProperties;
}
const Highlighter = React.forwardRef<HTMLDivElement, HighlighterProps>(
  ({ highlighterStyle }, ref) => {
    const context = useSwitchContext();
    const { variant, options, activeValue } = context;
    const activeItem = React.useMemo(
      () =>
        options.find(
          (option: RadioOptionConfig) => option.value === activeValue
        ),
      [options, activeValue]
    );
    return (
      <div
        className={cn("bg-primary", switchVariants({ variant }))}
        style={{
          ...baseStyle,
          ...highlighterStyle,
          ...(activeItem?.style
            ? { background: activeItem?.style?.radioColor }
            : {}),
        }}
        aria-hidden="true"
        data-highlighter
        data-checked
        ref={ref}
      />
    );
  }
);
Highlighter.displayName = "Highlighter";
export { Highlighter };
