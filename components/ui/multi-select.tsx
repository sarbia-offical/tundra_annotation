import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, XCircle, ChevronDown, XIcon, WandSparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

/**
 * 动画类型和配置
 */
export interface AnimationConfig {
  /** 徽章动画类型 */
  badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
  /** 弹出框动画类型 */
  popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
  /** 选项悬停动画类型 */
  optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
  /** 动画持续时间（秒） */
  duration?: number;
  /** 动画延迟时间（秒） */
  delay?: number;
}

/**
 * 多选组件的变体，用于处理不同样式。
 * 使用 class-variance-authority (cva) 基于 "variant" 属性定义不同样式。
 */
const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
    badgeAnimation: {
      bounce: "hover:-translate-y-1 hover:scale-110",
      pulse: "hover:animate-pulse",
      wiggle: "hover:animate-wiggle",
      fade: "hover:opacity-80",
      slide: "hover:translate-x-1",
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    badgeAnimation: "bounce",
  },
});

/**
 * 多选组件的选项接口
 */
interface MultiSelectOption {
  /** 选项显示的文本 */
  label: string;
  /** 选项关联的唯一值 */
  value: string;
  /** 可选的图标组件 */
  icon?: React.ComponentType<{ className?: string }>;
  /** 是否禁用此选项 */
  disabled?: boolean;
  /** 自定义样式 */
  style?: {
    /** 自定义徽章颜色 */
    badgeColor?: string;
    /** 自定义图标颜色 */
    iconColor?: string;
    /** 徽章渐变背景 */
    gradient?: string;
  };
}

/**
 * 选项分组接口
 */
interface MultiSelectGroup {
  /** 分组标题 */
  heading: string;
  /** 该分组中的选项 */
  options: MultiSelectOption[];
}

type multiSelectType = "multiple" | "single";

/**
 * 多选组件的属性
 */
interface MultiSelectProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "animationConfig"
    >,
    VariantProps<typeof multiSelectVariants> {
  /**
   * 组件模式：多选(multiple)或单选(single)
   * 可选，默认为 "multiple"
   */
  multiSelectMode?: multiSelectType;
  /**
   * 要显示在多选组件中的选项对象数组或分组数组。
   */
  options: MultiSelectOption[] | MultiSelectGroup[];
  /**
   * 当选中的值发生变化时触发的回调函数。
   * 接收新选中值的数组。
   */
  onValueChange: (value: string[]) => void;

  /** 组件挂载时的默认选中值。 */
  defaultValue?: string[];

  /**
   * 未选中任何值时的占位文本。
   * 可选，默认为 "Select options"。
   */
  placeholder?: string;

  /**
   * 视觉效果的动画持续时间（秒）（例如：徽章弹跳）。
   * 可选，默认为 0（无动画）。
   */
  animation?: number;

  /**
   * 高级动画配置，用于微调不同部分的动画效果。
   * 可选，允许对各种动画效果进行细粒度控制。
   */
  animationConfig?: AnimationConfig;

  /**
   * 最大显示项目数。超出部分将被汇总显示。
   * 可选，默认为 3。
   */
  maxCount?: number;

  /**
   * 弹出框的模式。设置为 true 时，将禁用与外部元素的交互，
   * 并且只有弹出框内容对屏幕阅读器可见。
   * 可选，默认为 false。
   */
  modalPopover?: boolean;

  /**
   * 如果为 true，将多选组件作为另一个组件的子组件渲染。
   * 可选，默认为 false。
   */
  asChild?: boolean;

  /**
   * 附加的类名，用于为多选组件应用自定义样式。
   * 可选，可用于添加自定义样式。
   */
  className?: string;

  /**
   * 如果为 true，禁用全选功能。
   * 可选，默认为 false。
   */
  hideSelectAll?: boolean;

  /**
   * 如果为 true，在弹出框中显示搜索功能。
   * 如果为 false，完全隐藏搜索输入框。
   * 可选，默认为 true。
   */
  searchable?: boolean;

  /**
   * 搜索无匹配选项时的自定义空状态消息。
   * 可选，默认为 "No results found."。
   */
  emptyIndicator?: React.ReactNode;

  /**
   * 如果为 true，组件将随内容增长和收缩。
   * 如果为 false，使用固定宽度行为。
   * 可选，默认为 false。
   */
  autoSize?: boolean;

  /**
   * 如果为 true，徽章单行显示并启用水平滚动。
   * 如果为 false，徽章换行显示。
   * 可选，默认为 false。
   */
  singleLine?: boolean;

  /**
   * 弹出框内容的自定义 CSS 类。
   * 可选，可用于自定义弹出框外观。
   */
  popoverClassName?: string;

  /**
   * 如果为 true，完全禁用组件。
   * 可选，默认为 false。
   */
  disabled?: boolean;

  /**
   * 不同屏幕尺寸下的响应式配置。
   * 允许基于视口自定义 maxCount 和其他属性。
   * 可以是布尔值 true（使用默认响应式行为）或对象（自定义配置）。
   */
  responsive?:
    | boolean
    | {
        /** 移动设备配置（< 640px） */
        mobile?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        /** 平板设备配置（640px - 1024px） */
        tablet?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
        /** 桌面设备配置（> 1024px） */
        desktop?: {
          maxCount?: number;
          hideIcons?: boolean;
          compactMode?: boolean;
        };
      };

  /**
   * 组件的最小宽度。
   * 可选，默基于内容自动调整。
   * 设置后，组件不会缩小到此宽度以下。
   */
  minWidth?: string;

  /**
   * 组件的最大宽度。
   * 可选，默认为容器的 100%。
   * 组件不会超出容器边界。
   */
  maxWidth?: string;

  /**
   * 如果为 true，自动基于值去除重复选项。
   * 可选，默认为 false（在开发模式下显示警告）。
   */
  deduplicateOptions?: boolean;

  /**
   * 如果为 true，当 defaultValue 变化时组件将重置其内部状态。
   * 适用于 React Hook Form 集成和表单重置功能。
   * 可选，默认为 true。
   */
  resetOnDefaultValueChange?: boolean;

  /**
   * 如果为 true，选择选项后自动关闭弹出框。
   * 适用于类似单选的行为或移动端用户体验。
   * 可选，默认为 false。
   */
  closeOnSelect?: boolean;
}

/**
 * 通过 ref 暴露的命令式方法
 */
export interface MultiSelectRef {
  /**
   * 以编程方式将组件重置为默认值
   */
  reset: () => void;
  /**
   * 获取当前选中的值
   */
  getSelectedValues: () => string[];
  /**
   * 以编程方式设置选中的值
   */
  setSelectedValues: (values: string[]) => void;
  /**
   * 清除所有选中的值
   */
  clear: () => void;
  /**
   * 聚焦组件
   */
  focus: () => void;
}

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      multiSelectMode = "multiple",
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "选择选项",
      animation = 0,
      animationConfig,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      hideSelectAll = false,
      searchable = true,
      emptyIndicator,
      autoSize = false,
      singleLine = false,
      popoverClassName,
      disabled = false,
      responsive,
      minWidth,
      maxWidth,
      deduplicateOptions = false,
      resetOnDefaultValueChange = true,
      closeOnSelect = false,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    const [politeMessage, setPoliteMessage] = React.useState("");
    const [assertiveMessage, setAssertiveMessage] = React.useState("");
    const prevSelectedCount = React.useRef(selectedValues.length);
    const prevIsOpen = React.useRef(isPopoverOpen);
    const prevSearchValue = React.useRef(searchValue);

    const effectiveHideSelectAll =
      multiSelectMode === "single" ? true : hideSelectAll;
    const IsSingleSelect = multiSelectMode === "single";

    const announce = React.useCallback(
      (message: string, priority: "polite" | "assertive" = "polite") => {
        if (priority === "assertive") {
          setAssertiveMessage(message);
          setTimeout(() => setAssertiveMessage(""), 2000);
        } else {
          setPoliteMessage(message);
          setTimeout(() => setPoliteMessage(""), 2000);
        }
      },
      []
    );

    const multiSelectId = React.useId();

    const listboxId = `${multiSelectId}-listbox`;
    const triggerDescriptionId = `${multiSelectId}-description`;
    const selectedCountId = `${multiSelectId}-count`;

    const prevDefaultValueRef = React.useRef<string[]>(defaultValue);

    const isGroupedOptions = React.useCallback(
      (
        opts: MultiSelectOption[] | MultiSelectGroup[]
      ): opts is MultiSelectGroup[] => {
        return opts.length > 0 && "heading" in opts[0];
      },
      []
    );

    const arraysEqual = React.useCallback(
      (a: string[], b: string[]): boolean => {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, index) => val === sortedB[index]);
      },
      []
    );

    const resetToDefault = React.useCallback(() => {
      setSelectedValues(defaultValue);
      setIsPopoverOpen(false);
      setSearchValue("");
      onValueChange(defaultValue);
    }, [defaultValue, onValueChange]);

    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(
      ref,
      () => ({
        reset: resetToDefault,
        getSelectedValues: () => selectedValues,
        setSelectedValues: (values: string[]) => {
          setSelectedValues(values);
          onValueChange(values);
        },
        clear: () => {
          setSelectedValues([]);
          onValueChange([]);
        },
        focus: () => {
          if (buttonRef.current) {
            buttonRef.current.focus();
            const originalOutline = buttonRef.current.style.outline;
            const originalOutlineOffset = buttonRef.current.style.outlineOffset;
            buttonRef.current.style.outline = "2px solid hsl(var(--ring))";
            buttonRef.current.style.outlineOffset = "2px";
            setTimeout(() => {
              if (buttonRef.current) {
                buttonRef.current.style.outline = originalOutline;
                buttonRef.current.style.outlineOffset = originalOutlineOffset;
              }
            }, 1000);
          }
        },
      }),
      [resetToDefault, selectedValues, onValueChange]
    );

    const [screenSize, setScreenSize] = React.useState<
      "mobile" | "tablet" | "desktop"
    >("desktop");

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      const handleResize = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setScreenSize("mobile");
        } else if (width < 1024) {
          setScreenSize("tablet");
        } else {
          setScreenSize("desktop");
        }
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", handleResize);
        }
      };
    }, []);

    const getResponsiveSettings = () => {
      if (!responsive) {
        return {
          maxCount: maxCount,
          hideIcons: false,
          compactMode: false,
        };
      }
      if (responsive === true) {
        const defaultResponsive = {
          mobile: { maxCount: 2, hideIcons: false, compactMode: true },
          tablet: { maxCount: 4, hideIcons: false, compactMode: false },
          desktop: { maxCount: 6, hideIcons: false, compactMode: false },
        };
        const currentSettings = defaultResponsive[screenSize];
        return {
          maxCount: currentSettings?.maxCount ?? maxCount,
          hideIcons: currentSettings?.hideIcons ?? false,
          compactMode: currentSettings?.compactMode ?? false,
        };
      }
      const currentSettings = responsive[screenSize];

      return {
        maxCount: currentSettings?.maxCount ?? maxCount,
        hideIcons: currentSettings?.hideIcons ?? false,
        compactMode: currentSettings?.compactMode ?? false,
      };
    };

    const responsiveSettings = getResponsiveSettings();

    const getBadgeAnimationClass = () => {
      if (animationConfig?.badgeAnimation) {
        switch (animationConfig.badgeAnimation) {
          case "bounce":
            return isAnimating
              ? "animate-bounce"
              : "hover:-translate-y-1 hover:scale-110";
          case "pulse":
            return "hover:animate-pulse";
          case "wiggle":
            return "hover:animate-wiggle";
          case "fade":
            return "hover:opacity-80";
          case "slide":
            return "hover:translate-x-1";
          case "none":
            return "";
          default:
            return "";
        }
      }
      return isAnimating ? "animate-bounce" : "";
    };

    const getPopoverAnimationClass = () => {
      if (animationConfig?.popoverAnimation) {
        switch (animationConfig.popoverAnimation) {
          case "scale":
            return "animate-scaleIn";
          case "slide":
            return "animate-slideInDown";
          case "fade":
            return "animate-fadeIn";
          case "flip":
            return "animate-flipIn";
          case "none":
            return "";
          default:
            return "";
        }
      }
      return "";
    };

    const getAllOptions = React.useCallback((): MultiSelectOption[] => {
      if (options.length === 0) return [];
      let allOptions: MultiSelectOption[];
      if (isGroupedOptions(options)) {
        allOptions = options.flatMap((group) => group.options);
      } else {
        allOptions = options;
      }
      const valueSet = new Set<string>();
      const duplicates: string[] = [];
      const uniqueOptions: MultiSelectOption[] = [];
      allOptions.forEach((option) => {
        if (valueSet.has(option.value)) {
          duplicates.push(option.value);
          if (!deduplicateOptions) {
            uniqueOptions.push(option);
          }
        } else {
          valueSet.add(option.value);
          uniqueOptions.push(option);
        }
      });
      if (process.env.NODE_ENV === "development" && duplicates.length > 0) {
        const action = deduplicateOptions ? "已自动移除" : "检测到";
        console.warn(
          `MultiSelect: 重复的选项值 ${action}: ${duplicates.join(", ")}. ` +
            `${
              deduplicateOptions
                ? "重复项已被自动移除。"
                : "这可能导致意外行为。考虑设置 'deduplicateOptions={true}' 或确保所有选项值都是唯一的。"
            }`
        );
      }
      return deduplicateOptions ? uniqueOptions : allOptions;
    }, [options, deduplicateOptions, isGroupedOptions]);

    const getOptionByValue = React.useCallback(
      (value: string): MultiSelectOption | undefined => {
        const option = getAllOptions().find((option) => option.value === value);
        if (!option && process.env.NODE_ENV === "development") {
          console.warn(`MultiSelect: 在选项列表中未找到值为 "${value}" 的选项`);
        }
        return option;
      },
      [getAllOptions]
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchValue) return options;
      if (options.length === 0) return [];
      if (isGroupedOptions(options)) {
        return options
          .map((group) => ({
            ...group,
            options: group.options.filter(
              (option) =>
                option.label
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                option.value.toLowerCase().includes(searchValue.toLowerCase())
            ),
          }))
          .filter((group) => group.options.length > 0);
      }
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase())
      );
    }, [options, searchValue, searchable, isGroupedOptions]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (optionValue: string) => {
      if (disabled) {
        return;
      }
      const option = getOptionByValue(optionValue);
      if (option?.disabled) {
        return;
      }
      let newSelectedValues: string[] = [];
      if (IsSingleSelect) {
        newSelectedValues = selectedValues.includes(optionValue)
          ? []
          : [optionValue];
      } else {
        newSelectedValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((value) => value !== optionValue)
          : [...selectedValues, optionValue];
      }
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    const handleClear = () => {
      if (disabled) {
        return;
      }
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      if (disabled) return;
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      if (disabled) return;
      const newSelectedValues = selectedValues.slice(
        0,
        responsiveSettings.maxCount
      );
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const toggleAll = () => {
      if (disabled) return;
      const allOptions = getAllOptions().filter((option) => !option.disabled);
      if (selectedValues.length === allOptions.length) {
        handleClear();
      } else {
        const allValues = allOptions.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }

      if (closeOnSelect) {
        setIsPopoverOpen(false);
      }
    };

    React.useEffect(() => {
      if (!resetOnDefaultValueChange) return;
      const prevDefaultValue = prevDefaultValueRef.current;
      if (!arraysEqual(prevDefaultValue, defaultValue)) {
        if (!arraysEqual(selectedValues, defaultValue)) {
          setSelectedValues(defaultValue);
        }
        prevDefaultValueRef.current = [...defaultValue];
      }
    }, [defaultValue, selectedValues, arraysEqual, resetOnDefaultValueChange]);

    const getWidthConstraints = () => {
      const defaultMinWidth = screenSize === "mobile" ? "0px" : "200px";
      const effectiveMinWidth = minWidth || defaultMinWidth;
      const effectiveMaxWidth = maxWidth || "100%";
      return {
        minWidth: effectiveMinWidth,
        maxWidth: effectiveMaxWidth,
        width: autoSize ? "auto" : "100%",
      };
    };

    const widthConstraints = getWidthConstraints();

    React.useEffect(() => {
      if (!isPopoverOpen) {
        setSearchValue("");
      }
    }, [isPopoverOpen]);

    React.useEffect(() => {
      const selectedCount = selectedValues.length;
      const allOptions = getAllOptions();
      const totalOptions = allOptions.filter((opt) => !opt.disabled).length;
      if (selectedCount !== prevSelectedCount.current) {
        const diff = selectedCount - prevSelectedCount.current;
        if (diff > 0) {
          const addedItems = selectedValues.slice(-diff);
          const addedLabels = addedItems
            .map(
              (value) => allOptions.find((opt) => opt.value === value)?.label
            )
            .filter(Boolean);

          if (addedLabels.length === 1) {
            announce(
              `${addedLabels[0]} 已选择。已选择 ${selectedCount} / ${totalOptions} 个选项。`
            );
          } else {
            announce(
              `已选择 ${addedLabels.length} 个选项。总共已选择 ${selectedCount} / ${totalOptions} 个选项。`
            );
          }
        } else if (diff < 0) {
          announce(
            `选项已移除。已选择 ${selectedCount} / ${totalOptions} 个选项。`
          );
        }
        prevSelectedCount.current = selectedCount;
      }

      if (isPopoverOpen !== prevIsOpen.current) {
        if (isPopoverOpen) {
          announce(
            `下拉框已打开。共有 ${totalOptions} 个选项可用。使用方向键导航。`
          );
        } else {
          announce("下拉框已关闭。");
        }
        prevIsOpen.current = isPopoverOpen;
      }

      if (
        searchValue !== prevSearchValue.current &&
        searchValue !== undefined
      ) {
        if (searchValue && isPopoverOpen) {
          const filteredCount = allOptions.filter(
            (opt) =>
              opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
              opt.value.toLowerCase().includes(searchValue.toLowerCase())
          ).length;

          announce(`找到 ${filteredCount} 个选项匹配 "${searchValue}"`);
        }
        prevSearchValue.current = searchValue;
      }
    }, [selectedValues, isPopoverOpen, searchValue, announce, getAllOptions]);

    return (
      <div className="">
        <div className="sr-only">
          <div aria-live="polite" aria-atomic="true" role="status">
            {politeMessage}
          </div>
          <div aria-live="assertive" aria-atomic="true" role="alert">
            {assertiveMessage}
          </div>
        </div>

        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          modal={modalPopover}
        >
          <div id={triggerDescriptionId} className="sr-only">
            {IsSingleSelect
              ? "单选下拉框。使用方向键导航，Enter 键选择，Escape 键关闭。"
              : "多选下拉框。使用方向键导航，Enter 键选择，Escape 键关闭。"}
          </div>
          <div id={selectedCountId} className="sr-only" aria-live="polite">
            {selectedValues.length === 0
              ? "未选择任何选项"
              : `已选择 ${selectedValues.length} 个选项${
                  selectedValues.length === 1 ? "" : "s"
                }: ${selectedValues
                  .map((value) => getOptionByValue(value)?.label)
                  .filter(Boolean)
                  .join(", ")}`}
          </div>

          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              {...props}
              onClick={handleTogglePopover}
              disabled={disabled}
              role="combobox"
              aria-expanded={isPopoverOpen}
              aria-haspopup="listbox"
              aria-controls={isPopoverOpen ? listboxId : undefined}
              aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
              aria-label={`${IsSingleSelect ? "单选" : "多选"}: 已选择 ${
                selectedValues.length
              } / ${getAllOptions().length} 个选项。${placeholder}`}
              className={cn(
                "flex p-1 rounded-md border min-h-12 text-base h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
                autoSize ? "w-auto" : "w-full",
                responsiveSettings.compactMode &&
                  "min-h-8 text-sm border-red-100",
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
                      "flex items-center gap-1",
                      singleLine
                        ? "overflow-x-auto multiselect-singleline-scroll"
                        : "flex-wrap",
                      responsiveSettings.compactMode && "gap-0.5"
                    )}
                    style={
                      singleLine
                        ? {
                            paddingBottom: "4px",
                          }
                        : {}
                    }
                  >
                    {!IsSingleSelect ? (
                      <>
                        {/* 多选 */}
                        {selectedValues
                          .slice(0, responsiveSettings.maxCount)
                          .map((value) => {
                            const option = getOptionByValue(value);
                            const IconComponent = option?.icon;
                            const customStyle = option?.style;
                            if (!option) {
                              return null;
                            }
                            const badgeStyle: React.CSSProperties = {
                              animationDuration: `${animation}s`,
                              ...(customStyle?.badgeColor && {
                                backgroundColor: customStyle.badgeColor,
                              }),
                              ...(customStyle?.gradient && {
                                background: customStyle.gradient,
                                color: "white",
                              }),
                            };

                            return (
                              <Badge
                                key={value}
                                className={cn(
                                  "pt-1 pb-1",
                                  getBadgeAnimationClass(),
                                  multiSelectVariants({ variant }),
                                  customStyle?.gradient &&
                                    "text-white border-transparent",
                                  screenSize === "mobile" &&
                                    "max-w-[120px] truncate",
                                  singleLine &&
                                    "flex-shrink-0 whitespace-nowrap",
                                  "[&>svg]:pointer-events-auto"
                                )}
                                style={{
                                  ...badgeStyle,
                                  animationDuration: `${
                                    animationConfig?.duration || animation
                                  }s`,
                                  animationDelay: `${
                                    animationConfig?.delay || 0
                                  }s`,
                                }}
                              >
                                {IconComponent &&
                                  !responsiveSettings.hideIcons && (
                                    <IconComponent
                                      className={cn(
                                        "h-4 w-4 mr-1",
                                        responsiveSettings.compactMode &&
                                          "h-3 w-3",
                                        customStyle?.iconColor && "text-current"
                                      )}
                                      {...(customStyle?.iconColor && {
                                        style: { color: customStyle.iconColor },
                                      })}
                                    />
                                  )}
                                <span
                                  className={cn(
                                    screenSize === "mobile" && "truncate"
                                  )}
                                >
                                  {option.label}
                                </span>
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    toggleOption(value);
                                  }}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      toggleOption(value);
                                    }
                                  }}
                                  aria-label={`从选择中移除 ${option.label}`}
                                  className="ml-2 h-4 w-4 cursor-pointer hover:bg-white/20 transition-all duration-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                                >
                                  <XCircle
                                    className={cn(
                                      "h-3 w-3",
                                      responsiveSettings.compactMode &&
                                        "h-2.5 w-2.5"
                                    )}
                                  />
                                </div>
                              </Badge>
                            );
                          })
                          .filter(Boolean)}
                        {/* 其他已选中的 */}
                        {selectedValues.length >
                          responsiveSettings.maxCount && (
                          <Badge
                            className={cn(
                              "pt-1 pb-1 bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                              getBadgeAnimationClass(),
                              multiSelectVariants({ variant }),
                              responsiveSettings.compactMode && "text-xs",
                              singleLine && "flex-shrink-0 whitespace-nowrap",
                              "[&>svg]:pointer-events-auto"
                            )}
                            style={{
                              animationDuration: `${
                                animationConfig?.duration || animation
                              }s`,
                              animationDelay: `${animationConfig?.delay || 0}s`,
                            }}
                          >
                            {`+ ${
                              selectedValues.length -
                              responsiveSettings.maxCount
                            } 更多`}
                            <XCircle
                              className={cn(
                                "ml-2 h-4 w-4 cursor-pointer hover:bg-secondary rounded-sm transition-all duration-300",
                                responsiveSettings.compactMode && "ml-1 h-3 w-3"
                              )}
                              onClick={(event) => {
                                event.stopPropagation();
                                clearExtraOptions();
                              }}
                            />
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        {/* 单选 */}
                        {selectedValues.map((value) => {
                          const option = getOptionByValue(value);
                          const IconComponent = option?.icon;
                          const customStyle = option?.style;
                          if (!option) {
                            return null;
                          }
                          return (
                            <Badge
                              className={cn(
                                "pt-1 pb-1 bg-transparent text-foreground m-1 transition-all duration-300 ease-in-out",
                                getBadgeAnimationClass(),
                                responsiveSettings.compactMode && "text-xs",
                                singleLine && "flex-shrink-0 whitespace-nowrap",
                                "[&>svg]:pointer-events-auto"
                              )}
                              style={{
                                animationDuration: `${
                                  animationConfig?.duration || animation
                                }s`,
                                animationDelay: `${
                                  animationConfig?.delay || 0
                                }s`,
                              }}
                            >
                              {IconComponent &&
                                !responsiveSettings.hideIcons && (
                                  <IconComponent
                                    className={cn(
                                      "h-4 w-4 mr-1",
                                      responsiveSettings.compactMode &&
                                        "h-3 w-3",
                                      customStyle?.iconColor && "text-current"
                                    )}
                                    {...(customStyle?.iconColor && {
                                      style: { color: customStyle.iconColor },
                                    })}
                                  />
                                )}
                              <span
                                className={cn(
                                  screenSize === "mobile" && "truncate"
                                )}
                              >
                                {option.label}
                              </span>
                            </Badge>
                          );
                        })}
                      </>
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
          <PopoverContent
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
            aria-label="可用选项"
            className={cn(
              "w-auto p-0",
              getPopoverAnimationClass(),
              screenSize === "mobile" && "w-[85vw] max-w-[280px]",
              screenSize === "tablet" && "w-[70vw] max-w-md",
              screenSize === "desktop" && "min-w-[300px]",
              popoverClassName
            )}
            style={{
              animationDuration: `${animationConfig?.duration || animation}s`,
              animationDelay: `${animationConfig?.delay || 0}s`,
              maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
              maxHeight: screenSize === "mobile" ? "70vh" : "60vh",
              touchAction: "manipulation",
            }}
            align="start"
            // onEscapeKeyDown={() => setIsPopoverOpen(false)}
          >
            <Command shouldFilter={false}>
              {searchable && (
                <CommandInput
                  placeholder="搜索选项..."
                  onKeyDown={handleInputKeyDown}
                  value={searchValue}
                  onValueChange={setSearchValue}
                  aria-label="搜索可用选项"
                  aria-describedby={`${multiSelectId}-search-help`}
                />
              )}
              {searchable && (
                <div id={`${multiSelectId}-search-help`} className="sr-only">
                  输入以过滤选项。使用方向键导航结果。
                </div>
              )}
              <CommandList
                className={cn(
                  "max-h-[40vh] overflow-y-auto multiselect-scrollbar",
                  screenSize === "mobile" && "max-h-[50vh]",
                  "overscroll-behavior-y-contain"
                )}
              >
                {filteredOptions.length === 0 ? (
                  <div className="p-3 text-center text-sm">
                    {emptyIndicator || "未找到结果。"}
                  </div>
                ) : (
                  <></>
                )}
                {filteredOptions.length > 0 ? (
                  <>
                    {!effectiveHideSelectAll && !searchValue && (
                      <CommandGroup>
                        <CommandItem
                          key="all"
                          onSelect={toggleAll}
                          role="option"
                          aria-selected={
                            selectedValues.length ===
                            getAllOptions().filter((opt) => !opt.disabled)
                              .length
                          }
                          aria-label={`选择全部 ${
                            getAllOptions().length
                          } 个选项`}
                          className="cursor-pointer"
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedValues.length ===
                                getAllOptions().filter((opt) => !opt.disabled)
                                  .length
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                            aria-hidden="true"
                          >
                            <Check className="h-4 w-4 text-background" />
                          </div>
                          <span>
                            (选择全部
                            {getAllOptions().length > 20
                              ? ` - ${getAllOptions().length} 个选项`
                              : ""}
                            )
                          </span>
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {isGroupedOptions(filteredOptions) ? (
                      filteredOptions.map((group) => (
                        <CommandGroup
                          key={group.heading}
                          heading={group.heading}
                        >
                          {group.options.map((option) => {
                            const isSelected = selectedValues.includes(
                              option.value
                            );
                            const customStyle = option.style;
                            return (
                              <CommandItem
                                key={option.value}
                                onSelect={() => toggleOption(option.value)}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={option.disabled}
                                aria-label={`${option.label}${
                                  isSelected ? ", 已选择" : ", 未选择"
                                }${option.disabled ? ", 已禁用" : ""}`}
                                className={cn(
                                  "cursor-pointer",
                                  option.disabled &&
                                    "opacity-50 cursor-not-allowed"
                                )}
                                disabled={option.disabled}
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible"
                                  )}
                                  aria-hidden="true"
                                >
                                  <Check className="h-4 w-4 text-background" />
                                </div>
                                {option.icon && (
                                  <option.icon
                                    className={cn(
                                      "h-4 w-4 text-muted-foreground",
                                      customStyle?.iconColor && "text-current"
                                    )}
                                    {...(customStyle?.iconColor && {
                                      style: { color: customStyle.iconColor },
                                    })}
                                    aria-hidden="true"
                                  />
                                )}
                                <span>{option.label}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      ))
                    ) : (
                      <CommandGroup>
                        {filteredOptions.map((option) => {
                          const isSelected = selectedValues.includes(
                            option.value
                          );
                          const customStyle = option.style;
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => toggleOption(option.value)}
                              role="option"
                              aria-selected={isSelected}
                              aria-disabled={option.disabled}
                              aria-label={`${option.label}${
                                isSelected ? ", 已选择" : ", 未选择"
                              }${option.disabled ? ", 已禁用" : ""}`}
                              className={cn(
                                "cursor-pointer",
                                option.disabled &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                              disabled={option.disabled}
                            >
                              <div
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-full border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                                aria-hidden="true"
                              >
                                <Check className="h-4 w-4 text-background" />
                              </div>
                              {option.icon && (
                                <option.icon
                                  className={cn(
                                    "h-4 w-4 text-muted-foreground",
                                    customStyle?.iconColor && "text-current"
                                  )}
                                  {...(customStyle?.iconColor && {
                                    style: { color: customStyle.iconColor },
                                  })}
                                  aria-hidden="true"
                                />
                              )}
                              <span>{option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <CommandSeparator />
                <CommandGroup>
                  <div className="flex items-center justify-between">
                    {selectedValues.length > 0 && (
                      <>
                        <CommandItem
                          onSelect={handleClear}
                          className="flex-1 justify-center cursor-pointer"
                        >
                          清除
                        </CommandItem>
                        <Separator
                          orientation="vertical"
                          className="flex min-h-6 h-full"
                        />
                      </>
                    )}
                    <CommandItem
                      onSelect={() => setIsPopoverOpen(false)}
                      className="flex-1 justify-center cursor-pointer max-w-full"
                    >
                      关闭
                    </CommandItem>
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
          {animation > 0 && selectedValues.length > 0 && (
            <WandSparkles
              className={cn(
                "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
                isAnimating ? "" : "text-muted-foreground"
              )}
              onClick={() => setIsAnimating(!isAnimating)}
            />
          )}
        </Popover>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
export type { MultiSelectOption, MultiSelectGroup, MultiSelectProps };
