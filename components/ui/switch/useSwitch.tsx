import React from "react";
import { useSwitchContext, useSwitchDispatch } from "./SwitchContext";

export const useSwitch = () => {
  const switchState = useSwitchContext();
  const { animationConfig, animation } = switchState;

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

  return {
    animation,
    animationConfig,
    getBadgeAnimationClass,
  };
};
