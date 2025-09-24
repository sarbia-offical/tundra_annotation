export enum STATUS {
  OPEN = "open",
  CLOSE = "close",
}

export enum THEME {
  LIGHT = "light",
  DARK = "dark",
}

export enum TO {
  CHINESE = "zh-Hans",
  ENGLISH = "en",
}

export enum FONT_DISPLAY {
  DEFAULT = "font_display_default",
  BOLD = "font_display_bold",
  ITALIC = "font_display_italic",
}

export const FONT_GROUP = "font_display";

export const FONT_UNDERLINE = "font_underline";

export enum UNDERLINE_DISPLAY {
  DEFAULT = "underline_display_default",
  WAVY = "underline_display_wavy",
}

type SettingKeys =
  | "STATUS"
  | "THEME"
  | "TO"
  | "FONT_DISPLAY"
  | "UNDERLINE_DISPLAY";

export interface IOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  style?: Record<string, string>;
  [key: string]: unknown;
}

type OptionList = Record<SettingKeys, IOption[]>;

export const options: OptionList = {
  // 插件状态
  STATUS: [
    {
      label: "i18n_OPEN",
      value: STATUS.OPEN,
    },
    {
      label: "i18n_CLOSE",
      value: STATUS.CLOSE,
    },
  ],
  // 主题
  THEME: [
    {
      label: "i18n_LIGHT",
      value: THEME.LIGHT,
    },
    {
      label: "i18n_DARK",
      value: THEME.DARK,
    },
  ],
  // 翻译为
  TO: [
    {
      label: "i18n_CHINESE",
      value: TO.CHINESE,
    },
    {
      label: "i18n_ENGLISH",
      value: TO.ENGLISH,
    },
  ],
  // 文字展示
  FONT_DISPLAY: [
    {
      label: "i18n_FONT_DISPLAY_DEFAULT", // 默认样式
      value: FONT_DISPLAY.DEFAULT,
      groupLabel: "i18n_FONT_DISPLAY",
      group: FONT_GROUP,
    },
    {
      label: "i18n_FONT_DISPLAY_BOLD", // 加粗显示
      value: FONT_DISPLAY.BOLD,
      groupLabel: "i18n_FONT_DISPLAY",
      group: FONT_GROUP,
    },
    {
      label: "i18n_FONT_DISPLAY_ITALIC", // 斜体显示
      value: FONT_DISPLAY.ITALIC,
      groupLabel: "i18n_FONT_DISPLAY",
      group: FONT_GROUP,
    },
    // 下划线
  ],
  // 下划线展示
  UNDERLINE_DISPLAY: [
    {
      label: "i18n_UNDERLINE_DISPLAY_DEFAULT", // 默认不展示
      value: UNDERLINE_DISPLAY.DEFAULT,
      groupLabel: "i18n_FONT_UNDERLINE",
      group: FONT_UNDERLINE,
    },
    {
      label: "i18n_UNDERLINE_DISPLAY_WAVY", // 波浪线
      value: UNDERLINE_DISPLAY.WAVY,
      groupLabel: "i18n_FONT_UNDERLINE",
      group: FONT_UNDERLINE,
    },
  ],
};

export const defaultOptions: Record<SettingKeys, string> = {
  STATUS: STATUS.OPEN,
  THEME: THEME.LIGHT,
  TO: TO.ENGLISH,
  FONT_DISPLAY: FONT_DISPLAY.DEFAULT,
  UNDERLINE_DISPLAY: UNDERLINE_DISPLAY.DEFAULT,
};

/**
 * 支持的设备类型
 */
type Devices = "mobile" | "tablet" | "desktop";

export interface AnimationConfig {
  // 选项卡动画类型
  badgeAnimation:
    | "bounce"
    | "pulse"
    | "wiggle"
    | "fade"
    | "slide"
    | "shake"
    | "none";
  // 动画持续时间，单位毫秒
  duration?: number;
  // 动画延迟时间，单位毫秒
  delay?: number;
}

export interface WidthConstraints {
  minWidth?: string;
  maxWidth?: string;
  width?: string;
}

export type { SettingKeys, OptionList, Devices };
