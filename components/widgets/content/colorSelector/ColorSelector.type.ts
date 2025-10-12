import { IOption } from "@/constant/options";
import { RemoveIndexSignature } from "@/constant/util";
import React from "react";

/**
 * 暴露的钩子
 */
export interface ColorSelectorRef {
  /**
   * 打开翻译菜单
   */
  handleSetSelectedValue: (value: string) => void;
  /**
   * 关闭翻译菜单
   */
  handleClearSelectedValue: () => void;
}

export interface optionStyleConfig {
  /** 自定义背景颜色 */
  bgColor?: string;
}

export interface ColorSelectorOptionConfig
  extends Omit<RemoveIndexSignature<IOption>, "style" | "icon" | "style"> {
  style: optionStyleConfig;
}

/**
 * 组件的参数
 */
export interface ColorSelectorProps {
  color?: string;
  colorSelectorArray?: ColorSelectorOptionConfig[];
  children?: React.ReactNode | undefined;
  className?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}

export const defaultColorSelectorArray: ColorSelectorOptionConfig[] = [
  {
    label: "茜红",
    value: "#ed4845",
    style: {
      bgColor: "#ed4845",
    },
  },
  {
    label: "暗橄榄绿",
    value: "#4b2e2b",
    style: {
      bgColor: "#4b2e2b",
    },
  },
  {
    label: "含羞草黄",
    value: "#e2d849",
    style: {
      bgColor: "#e2d849",
    },
  },
  {
    label: "蔚蓝",
    value: "#2474b5",
    style: {
      bgColor: "#2474b5",
    },
  },
  {
    label: "沙棕",
    value: "#e3b4b8",
    style: {
      bgColor: "#e3b4b8",
    },
  },
  {
    label: "常春藤绿",
    value: "#43b244",
    style: {
      bgColor: "#43b244",
    },
  },
];

export interface ColorSelectorContextValue extends ColorSelectorProps {
  toggleOption: (value: string) => void;
  isSelected: (value: string) => boolean;
  selectedValue: string;
  currentColor?: string;
  colorList: ColorSelectorOptionConfig[];
  componentDisabled: boolean;
}
