import {
  Devices,
  IOption,
  AnimationConfig,
  WidthConstraints,
} from "@/constant/options";
import { RemoveIndexSignature } from "@/constant/util";
import { VariantProps } from "class-variance-authority";
import React from "react";
import { selectVariants } from "./SelectVariants";

/**
 * Select 组件选择类型
 */
export type SelectType = "multiple" | "single";

/**
 * 徽章样式配置
 */
export interface BadgeStyleConfig {
  /** 自定义徽章颜色 */
  badgeColor?: string;
  /** 自定义图标颜色 */
  iconColor?: string;
}

/**
 * Select 组件选项类型
 */
export interface SelectOptionConfig
  extends Omit<RemoveIndexSignature<IOption>, "style"> {
  style?: BadgeStyleConfig;
}

/**
 * Select组件分组类型
 */
export interface SelectGroupConfig {
  heading: string;
  options: SelectOptionConfig[];
}

/**
 * 响应式配置
 */
export interface ResponsiveConfig {
  maxCount: number;
  hideIcons?: boolean;
  compactMode?: boolean;
}

/**
 * 设备响应式配置
 */
export interface DeviceConfig
  extends Partial<Record<Devices, ResponsiveConfig>> {}

export interface BaseSelectProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "delay" | "defaultValue"
    >,
    VariantProps<typeof selectVariants> {
  /**
   * 分组选项还是单条选项
   */
  options: SelectOptionConfig[] | SelectGroupConfig[];

  /**
   * 当选中的值发生变化时触发的回调函数。
   */
  onValueChange: (value: string[]) => void;

  // 其他共有属性
  placeholder?: string;
  animation?: number;
  animationConfig?: AnimationConfig;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  hideSelectAll?: boolean;
  searchable?: boolean;
  emptyIndicator?: React.ReactNode;
  autoSize?: boolean;
  singleLine?: boolean;
  popoverClassName?: string;
  disabled?: boolean;
  responsive?: boolean | DeviceConfig;
  minWidth?: string;
  maxWidth?: string;
  deduplicateOptions?: boolean;
  closeOnSelect?: boolean;
}

// 单选
export interface SingleSelectProps extends BaseSelectProps {
  selectType: "single";
  defaultValue?: string;
}

// 多选
export interface MultipleSelectProps extends BaseSelectProps {
  selectType: "multiple";
  defaultValue?: string[];
}

// 最终导出
export type SelectProps = SingleSelectProps | MultipleSelectProps;

/**
 * 通过 ref 暴露的命令式方法
 */
export interface SelectRef {
  /**
   * 将组件重置为默认值
   */
  reset: () => void;
  /**
   * 打开下拉菜单
   */
  open: () => void;
  /**
   * 关闭下拉菜单
   */
  close: () => void;
  /**
   * 清除所有选中的值
   */
  clear: () => void;
  /**
   * 设置选中的值
   */
  setSelectedValues: (value: string[]) => void;
  /**
   * 获取当前选中的值
   */
  getSelectedValues: () => string[];
}

export interface SelectContextValue extends BaseSelectProps {
  selectType: "single" | "multiple";
  defaultValue?: string | string[];
  selectedValues: string[];
  isPopoverOpen: boolean;
  searchValue: string;
  isAnimating: boolean;
  screenSize: Devices;
  selectId: string;
  listboxId: string;
  triggerDescriptionId: string;
  selectedCountId: string;
  isSingleSelect: boolean;
  filteredOptions: SelectOptionConfig[] | SelectGroupConfig[];
  isGroupedOptions: (
    opts: SelectGroupConfig[] | SelectOptionConfig[]
  ) => opts is SelectGroupConfig[];
  toggleOption: (valud: string) => void;
  handleClear: () => void;
  handleTogglePopover: () => void;
  toggleAll: () => void;
  setSelectedValues: (value: string[]) => void;
  setIsPopoverOpen: (open: boolean) => void;
  setSearchValue: (value: string) => void;
  setIsAnimating: (animating: boolean) => void;
  onValueChange: (value: string[]) => void;
  getAllOptions: () => SelectOptionConfig[];
  getOptionByValue: (value: string) => SelectOptionConfig | undefined;
  getResponsiveConfig: () => ResponsiveConfig;
  getWidthConstraints: () => WidthConstraints;
  getBadgeAnimationClass: () => string;
}
