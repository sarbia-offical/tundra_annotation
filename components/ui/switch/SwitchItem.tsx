import React from "react";
import { useSwitch } from "./useSwitch";
import { useSwitchContext, useSwitchDispatch } from "./SwitchContext";
import { switchVariants } from "./SwitchVariants";
import { cn } from "@/lib/utils";
import { ActionType, RadioOptionConfig } from "./SwitchTypes";
import { useTranslation } from "react-i18next";

interface SwitchItemProps {
  className?: string;
  item: RadioOptionConfig;
}
const SwitchItem = React.forwardRef<HTMLDivElement, SwitchItemProps>(
  ({ className, item }, ref) => {
    const { t } = useTranslation();
    const context = useSwitchContext();
    const dispatch = useSwitchDispatch();
    const { animation, animationConfig, getBadgeAnimationClass } = useSwitch();
    const badgeAnimationClass = getBadgeAnimationClass();
    const { variant, activeValue, onValueChange } = context;

    const isSelected = useMemo(
      () => activeValue === item.value,
      [activeValue, item.value]
    );

    const handleClick = React.useCallback(() => {
      dispatch({
        type: ActionType.SWITCH,
        value: item.value,
      });
      onValueChange(item.value);
    }, [item, dispatch, onValueChange]);

    const handleHover = React.useCallback(
      (value: boolean) => () => {
        if (isSelected) {
          dispatch({
            type: ActionType.HOVER,
            value,
          });
        }
      },
      [dispatch, isSelected]
    );

    const IconComponent = item?.icon;
    return (
      <div
        ref={ref}
        role="radio"
        tabIndex={isSelected ? 0 : -1}
        aria-checked={isSelected}
        className={cn(
          className,
          switchVariants({ variant }),
          badgeAnimationClass
        )}
        aria-label={`${item.label} option`}
        onClick={handleClick}
        onMouseEnter={handleHover(true)}
        onMouseLeave={handleHover(false)}
        style={{
          ...(item?.style ? { background: item?.style?.radioColor } : {}),
          animationDuration: `${
            animationConfig?.duration || animation || 0.5
          }s`,
          animationDelay: `${animationConfig?.delay || 0}s`,
        }}
        {...(isSelected ? { "data-checked": true } : {})}
      >
        {IconComponent && (
          <IconComponent
            className={cn(
              "h-4 w-4 mr-2",
              item?.style?.iconColor && "text-current"
            )}
            {...(item?.style?.iconColor && {
              style: { color: item?.style?.iconColor },
            })}
          />
        )}
        {t(item.label)}
      </div>
    );
  }
);
SwitchItem.displayName = "SwitchItem";
export { SwitchItem };
