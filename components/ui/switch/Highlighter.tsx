import { cn } from "@/lib/utils";
import React from "react";
import { useSwitchContext, useSwitchDispatch } from "./SwitchContext";
import { switchVariants } from "./SwitchVariants";
import { ActionType, RadioOptionConfig } from "./SwitchTypes";
const baseStyle: React.CSSProperties = {
  position: "absolute",
};
interface HighlighterProps extends Partial<Omit<HTMLDivElement, "className">> {
  className?: string;
}
const Highlighter = React.forwardRef<HTMLDivElement, HighlighterProps>(
  ({ className }, ref) => {
    const context = useSwitchContext();
    const dispatch = useSwitchDispatch();
    const { variant, options, activeValue, hoverState, highlighterStyle } =
      context;
    const activeItem = React.useMemo(
      () =>
        options.find(
          (option: RadioOptionConfig) => option.value === activeValue
        ),
      [options, activeValue]
    );

    return (
      <div
        className={cn(className, "bg-primary", switchVariants({ variant }))}
        style={{
          ...baseStyle,
          ...(activeItem?.style
            ? { background: activeItem?.style?.radioColor }
            : {}),
          ...highlighterStyle,
          opacity: hoverState ? 0 : 100,
        }}
        aria-hidden="true"
        data-highlighter
        data-checked
        ref={ref}
        onTransitionEnd={(e) => {
          if (e.propertyName === "left" || e.propertyName === "top") {
            dispatch({
              type: ActionType.HOVER,
              value: true,
            });
          }
        }}
      />
    );
  }
);
Highlighter.displayName = "Highlighter";
export { Highlighter };
