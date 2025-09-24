import { AnimationConfig, Devices, IOption } from "@/constant/options";
import { RemoveIndexSignature } from "@/constant/util";
import { VariantProps } from "class-variance-authority";
import { switchVariants } from "./SwitchVariants";
/**
 * 组件类型选择
 */
export enum SwitchType {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

/**
 * 单选颜色样式
 */
export interface RadioStyleConfig {
  /**
   * 单选的背景颜色
   */
  radioColor?: string;
  /**
   * 图标颜色
   */
  iconColor?: string;
}

/**
 * 响应式配置
 */
export interface ResponsiveConfig {
  hideIcon?: boolean;
  compactMode?: boolean;
}

/**
 * 多端响应式配置
 */
export interface DeviceConfig
  extends Partial<Record<Devices, ResponsiveConfig>> {}

/**
 * 组件属性
 */
export interface RadioOptionConfig
  extends Omit<RemoveIndexSignature<IOption>, "style"> {
  style?: RadioStyleConfig;
}

export interface SwitchProps
  extends Omit<React.AllHTMLAttributes<HTMLDivElement>, "defaultValue">,
    VariantProps<typeof switchVariants> {
  options: RadioOptionConfig[];
  defaultValue: string;
  onValueChange: (value: string) => void;
  switchType?: SwitchType;
  animation?: number;
  animationConfig?: AnimationConfig;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  responsive?: boolean | DeviceConfig;
  minWidth?: number;
  maxWidth?: number;
  autoSize?: boolean;
}

/**
 * 通过 ref 暴露的命令式方法
 */
export interface SwitchRef extends HTMLDivElement {
  /**
   * 将组件重置为默认值
   */
  reset: () => void;
  /**
   * 清除所有选中的值
   */
  switch: (value: string) => void;
}

export enum ActionType {
  SWITCH = "SWITCH",
}

export type Action = {
  type: ActionType.SWITCH;
  text: string;
};

export interface SwitchState extends SwitchProps {
  activeValue: string;
}
