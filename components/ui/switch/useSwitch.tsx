import React from "react";
import { useSwitchContext, useSwitchDispatch } from "./SwitchContext";
import { RadioOptionConfig } from "./SwitchTypes";

export const useSwitch = () => {
  const switchState = useSwitchContext();
  const { animationConfig, animation, options, activeValue } = switchState;

  const getBadgeAnimationClass = React.useCallback((): string => {
    if (animationConfig?.badgeAnimation) {
      switch (animationConfig.badgeAnimation) {
        case "bounce":
          return "hover:-translate-y-1";
        case "pulse":
          return "hover:animate-pulse";
        case "wiggle":
          return "hover:animate-wiggle";
        case "fade":
          return "hover:opacity-80";
        case "slide":
          return "hover:translate-x-1";
        case "shake":
          return "hover:animate-shake";
        case "none":
          return "";
        default:
          return "";
      }
    }
    return "";
  }, [animationConfig]);

  const activeIndex = React.useMemo(() => {
    return options.findIndex(
      (ele: RadioOptionConfig) => ele.value === activeValue
    );
  }, [options, activeValue]);

  return {
    animation,
    animationConfig,
    activeIndex,
    getBadgeAnimationClass,
  };
};
