import React from "react";
import { useSelectContext } from "./SelectContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { selectVariants } from "./SelectVariants";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SelectBadgeProps {
  className?: string;
  value: string;
  onRemove: () => void;
}

const SelectBadge = React.forwardRef<HTMLDivElement, SelectBadgeProps>(
  ({ value, className = "", onRemove }, ref) => {
    const {
      variant,
      animation,
      animationConfig,
      screenSize,
      singleLine,
      getOptionByValue,
      getResponsiveConfig,
      getBadgeAnimationClass,
    } = useSelectContext();
    const { t } = useTranslation();
    const option = getOptionByValue(value);
    const IconComponent = option?.icon;
    const customStyle = option?.style;
    const responsiveSettings = getResponsiveConfig();
    const badgeAnimationClass = getBadgeAnimationClass();
    const badgeStyle: React.CSSProperties = {
      ...(customStyle?.badgeColor
        ? {
            background: customStyle.badgeColor,
            borderColor: customStyle.badgeColor,
          }
        : {}),
    };
    if (!option) return;
    return (
      <Badge
        ref={ref}
        className={cn(
          className,
          "pt-1 pb-1",
          badgeAnimationClass,
          selectVariants({ variant }),
          screenSize === "mobile" && "max-w-[120px] truncate",
          singleLine && "flex-shrink-0 whitespace-nowrap",
          "[&>svg]:pointer-events-auto"
        )}
        style={{
          ...badgeStyle,
          animationDuration: `${
            animationConfig?.duration || animation || 0.5
          }s`,
          animationDelay: `${animationConfig?.delay || 0}s`,
        }}
      >
        {IconComponent && !responsiveSettings.hideIcons && (
          <IconComponent
            className={cn(
              "h-4 w-4 mr-1",
              responsiveSettings.compactMode && "h-4 w-4",
              customStyle?.iconColor && "text-current"
            )}
            {...(customStyle?.iconColor && {
              style: { color: customStyle.iconColor },
            })}
          />
        )}
        <span className={cn(screenSize === "mobile" && "truncate", "mr-1")}>
          {t(option.label)}
        </span>
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onRemove();
            }
          }}
          aria-label={`从选择中移除 ${option.label}`}
          className="h-4 w-4 cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/50"
        >
          <XCircle
            className={cn(
              "h-4 w-4",
              responsiveSettings.compactMode && "h-2.5 w-2.5"
            )}
          />
        </div>
      </Badge>
    );
  }
);

SelectBadge.displayName = "SelectBadge";
export { SelectBadge };
