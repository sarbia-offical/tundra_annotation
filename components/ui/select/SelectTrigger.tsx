import React from "react";
import { useSelectContext } from "./SelectContext";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { ChevronDown, XCircle, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { SelectBadge } from "./SelectBadge";
import { selectVariants } from "./SelectVariants";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>((props, ref) => {
  const {
    selectedValues,
    isSingleSelect,
    selectId,
    disabled,
    isPopoverOpen,
    autoSize,
    className,
    placeholder,
    singleLine,
    animation,
    animationConfig,
    variant,
    screenSize,
    getResponsiveConfig,
    getBadgeAnimationClass,
    getWidthConstraints,
    getOptionByValue,
    handleClear,
    handleTogglePopover,
    toggleOption,
    setSelectedValues,
    onValueChange,
  } = useSelectContext();
  const responsiveSettings = getResponsiveConfig();
  const widthConstraints = getWidthConstraints();
  const badgeAnimationClass = getBadgeAnimationClass();

  return (
    <PopoverTrigger
      asChild
      className=" dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      <Button
        ref={ref}
        id={`multi-select-${selectId}`}
        {...props}
        onClick={handleTogglePopover}
        disabled={disabled}
        role="combobox"
        aria-expanded={isPopoverOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex p-2 rounded-xl border min-h-12 text-base h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
          autoSize ? "w-auto" : "w-full",
          responsiveSettings.compactMode && "min-h-8 text-sm",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{
          ...widthConstraints,
          maxWidth: `min(${widthConstraints.maxWidth}, 100%)`,
        }}
      >
        {selectedValues.length > 0 ? (
          <div className="flex justify-between items-center w-full">
            <div
              className={cn(
                "flex gap-2 items-center",
                singleLine
                  ? "overflow-x-auto multiselect-singleline-scroll"
                  : "flex-wrap",
                responsiveSettings.compactMode && "gap-0.5"
              )}
              style={singleLine ? { paddingBottom: "4px" } : {}}
            >
              {!isSingleSelect ? (
                <>
                  {selectedValues
                    .slice(0, responsiveSettings.maxCount)
                    .map((value) => (
                      <SelectBadge
                        key={value}
                        value={value}
                        onRemove={() => {
                          toggleOption(value);
                        }}
                      />
                    ))}
                  {selectedValues.length > responsiveSettings.maxCount ? (
                    <Badge
                      className={cn(
                        "pt-1 pb-1 bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                        badgeAnimationClass,
                        selectVariants({ variant }),
                        responsiveSettings.compactMode && "text-xs",
                        singleLine && "flex-shrink-0 whitespace-nowrap",
                        "[&>svg]:pointer-events-auto"
                      )}
                      style={{
                        animationDuration: `${
                          animationConfig?.duration || animation || 0.5
                        }s`,
                        animationDelay: `${animationConfig?.delay || 0}s`,
                      }}
                    >
                      {`+${
                        selectedValues.length - responsiveSettings.maxCount
                      } 更多`}
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label={`移除多余的选项`}
                        className="h-4 w-4 cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                        onClick={(event) => {
                          event.stopPropagation();
                          // 清除超出部分的选项
                          const newSelectedValues = selectedValues.slice(
                            0,
                            responsiveSettings.maxCount
                          );
                          setSelectedValues(newSelectedValues);
                          onValueChange(newSelectedValues);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.stopPropagation();
                            const newSelectedValues = selectedValues.slice(
                              0,
                              responsiveSettings.maxCount
                            );
                            setSelectedValues(newSelectedValues);
                            onValueChange(newSelectedValues);
                          }
                        }}
                      >
                        <XCircle
                          className={cn(
                            "h-3 w-3",
                            responsiveSettings.compactMode && "h-2.5 w-2.5"
                          )}
                        />
                      </div>
                    </Badge>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                selectedValues.map((value) => {
                  const option = getOptionByValue(value);
                  const IconComponent = option?.icon;
                  const customStyle = option?.style;

                  if (!option) return null;

                  return (
                    <Badge
                      key={value}
                      className={cn(
                        "bg-transparent text-foreground transition-all duration-300 ease-in-out",
                        responsiveSettings.compactMode && "text-xs",
                        singleLine && "flex-shrink-0 whitespace-nowrap",
                        "[&>svg]:pointer-events-auto"
                      )}
                    >
                      <span
                        className={cn(
                          screenSize === "mobile" && "truncate",
                          "flex"
                        )}
                      >
                        {IconComponent && !responsiveSettings.hideIcons && (
                          <IconComponent
                            className={cn(
                              "h-4 w-4 mr-1",
                              responsiveSettings.compactMode && "h-3 w-3",
                              customStyle?.iconColor && "text-current"
                            )}
                            {...(customStyle?.iconColor && {
                              style: { color: customStyle.iconColor },
                            })}
                          />
                        )}
                        {option.label}
                      </span>
                    </Badge>
                  );
                })
              )}
            </div>
            <div className="flex items-center justify-between">
              {/* 全部删除和下拉展开逻辑 */}
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  handleClear();
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    handleClear();
                  }
                }}
                aria-label={`清除所有 ${selectedValues.length} 个已选选项`}
                className="flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 rounded-sm"
              >
                <XIcon className="h-4 w-4" />
              </div>
              <Separator
                orientation="vertical"
                className="flex min-h-6 h-full"
              />
              <ChevronDown
                className="h-4 mx-2 cursor-pointer text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full mx-auto">
            <span className="text-sm text-muted-foreground mx-3">
              {placeholder}
            </span>
            <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
          </div>
        )}
      </Button>
    </PopoverTrigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";
export { SelectTrigger };
