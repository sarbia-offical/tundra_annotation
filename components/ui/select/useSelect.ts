import React from "react";
import {
  DeviceConfig,
  ResponsiveConfig,
  SelectContextValue,
  SelectGroupConfig,
  SelectOptionConfig,
  SelectProps,
} from "./SelectTypes";
import { WidthConstraints } from "@/constant/options";
import { useGetScreenSize } from "@/hooks/useGetScreenSize";

export const useSelect = (props: SelectProps) => {
  const {
    selectType = "multiple",
    options,
    minWidth,
    maxWidth,
    animationConfig,
    defaultValue = [],
    placeholder = "Select options",
    animation = 0,
    maxCount = 3,
    modalPopover = false,
    asChild = false,
    className = "",
    hideSelectAll = false,
    searchable = true,
    emptyIndicator,
    autoSize = false,
    singleLine = false,
    disabled = false,
    responsive,
    deduplicateOptions = false,
    resetOnDefaultValueChange = true,
    closeOnSelect = false,
    onValueChange,
    variant,
  } = props;
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const isSingleSelect = selectType === "single";
  const [screenSize] = useGetScreenSize();
  const selectId = React.useId();
  /**
   * 获取所有选项，扁平化分组选项，并去重
   */
  const getAllOptions = React.useCallback((): SelectOptionConfig[] => {
    if (options.length === 0) return [];
    let allOptions: SelectOptionConfig[] = [];
    const isGrouped = options.length > 0 && "heading" in options[0];
    if (isGrouped) {
      allOptions = (options as SelectGroupConfig[]).flatMap(
        (group) => group.options
      );
    } else {
      allOptions = options as SelectOptionConfig[];
    }
    // 去重
    const valueSet = new Set<string>();
    const duplicates: string[] = [];
    const uniqueOptions: SelectOptionConfig[] = [];
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
  }, [options, deduplicateOptions]);

  const isGroupedOptions = (
    opts: SelectGroupConfig[] | SelectOptionConfig[]
  ): opts is SelectGroupConfig[] => {
    return opts.length > 0 && "heading" in opts[0];
  };

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchValue) return options;
    if (options.length === 0) return [];
    const handleFilter: (option: SelectOptionConfig) => boolean = (
      option: SelectOptionConfig
    ) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.value.toLowerCase().includes(searchValue.toLowerCase());
    if (isGroupedOptions(options)) {
      return options
        .map((group) => ({
          ...group,
          options: group.options.filter((option: SelectOptionConfig) =>
            handleFilter(option)
          ),
        }))
        .filter((group) => group.options.length > 0);
    }

    return (options as SelectOptionConfig[]).filter(
      (option: SelectOptionConfig) => handleFilter(option)
    );
  }, [options, searchValue, searchable, isGroupedOptions]);

  /**
   * 根据value寻找选项
   */
  const getOptionByValue = React.useCallback(
    (value: string): SelectOptionConfig => {
      const option = getAllOptions().find((option) => option.value === value);
      if (!option && process.env.NODE_ENV === "development") {
        console.warn(`MultiSelect: 在选项列表中未找到值为 "${value}" 的选项`);
      }
      return option!;
    },
    [getAllOptions]
  );

  /**
   * 响应式配置
   */
  const getResponsiveConfig = React.useCallback((): ResponsiveConfig => {
    if (!responsive) {
      return {
        maxCount: 2,
        hideIcons: false,
        compactMode: false,
      };
    }
    const defaultDeviceConfig: DeviceConfig = {
      mobile: { maxCount: 2, hideIcons: false, compactMode: true },
      tablet: { maxCount: 4, hideIcons: false, compactMode: false },
      desktop: { maxCount: 6, hideIcons: false, compactMode: false },
    };
    if (responsive === true) {
      const settings = defaultDeviceConfig[screenSize] || {
        maxCount: 2,
        hideIcons: false,
        compactMode: true,
      };
      return {
        maxCount: settings.maxCount,
        hideIcons: settings?.hideIcons,
        compactMode: settings?.compactMode,
      };
    }
    const settings = responsive[screenSize];
    return {
      maxCount: settings?.maxCount ?? maxCount,
      hideIcons: settings?.hideIcons ?? false,
      compactMode: settings?.compactMode ?? false,
    };
  }, [responsive, maxCount, screenSize]);

  /**
   * 宽度
   */
  const getWidthConstraints = React.useCallback((): WidthConstraints => {
    const defaultMinWidth = screenSize === "mobile" ? "0px" : "200px";
    const effectiveMinWidth = minWidth || defaultMinWidth;
    const effectiveMaxWidth = maxWidth || "100%";
    return {
      minWidth: effectiveMinWidth,
      maxWidth: effectiveMaxWidth,
      width: autoSize ? "auto" : "100%",
    };
  }, [screenSize, autoSize, minWidth, maxWidth]);

  /**
   * 设置徽章动画
   */
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

  /**
   * 切换选项选中状态
   */
  const toggleOption = React.useCallback(
    (optionValue: string): void => {
      if (disabled) return;

      const option = getOptionByValue(optionValue);
      if (option?.disabled) return;

      let newSelectedValues: string[] = [];
      if (isSingleSelect) {
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
    },
    [
      disabled,
      getOptionByValue,
      isSingleSelect,
      selectedValues,
      onValueChange,
      closeOnSelect,
    ]
  );

  // 清除所有选中
  const handleClear = React.useCallback(() => {
    if (disabled) return;
    setSelectedValues([]);
    onValueChange([]);
  }, [disabled, onValueChange]);

  // 切换弹出框
  const handleTogglePopover = React.useCallback(() => {
    if (disabled) return;
    setIsPopoverOpen((prev) => !prev);
  }, [disabled]);

  // 全选/取消全选
  const toggleAll = React.useCallback(() => {
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
  }, [
    disabled,
    getAllOptions,
    selectedValues,
    handleClear,
    onValueChange,
    closeOnSelect,
  ]);

  useEffect(() => {
    setSelectedValues(
      defaultValue instanceof Array ? defaultValue : [defaultValue]
    );
  }, [defaultValue]);
  const contextValue: SelectContextValue = {
    ...props,
    selectedValues,
    isPopoverOpen,
    isSingleSelect,
    searchValue,
    isAnimating,
    screenSize,
    selectId,
    listboxId: `${selectId}-listbox`,
    triggerDescriptionId: `${selectId}-description`,
    selectedCountId: `${selectId}-count`,
    placeholder,
    animation,
    modalPopover,
    asChild,
    className,
    hideSelectAll,
    searchable,
    emptyIndicator,
    autoSize,
    singleLine,
    resetOnDefaultValueChange,
    variant,
    filteredOptions,
    isGroupedOptions,
    setSelectedValues,
    setSearchValue,
    setIsAnimating,
    setIsPopoverOpen,
    toggleOption,
    getAllOptions,
    getOptionByValue,
    getResponsiveConfig,
    getWidthConstraints,
    getBadgeAnimationClass,
    handleClear,
    handleTogglePopover,
    toggleAll,
  };
  return contextValue;
};
