import { Icons } from "@/components/ui/icons";

export enum STATUS {
  OPEN = "open",
  CLOSE = "close",
}

export enum THEME {
  LIGHT = "light",
  DARK = "dark",
}

export enum TO {
  CHINESE = "zh_cn",
  ENGLISH = "en",
}

export enum FONT_DISPLAY {
  DEFAULT = "font_display_default",
  BOLD = "font_display_bold",
  ITALIC = "font_display_italic",
}

export enum SYSTEM_LANGUAGE {
  EN = "en",
  ZH_CN = "zh_cn",
}

export enum SERVICES {
  MICROSOFT = "microsoft",
  GOOGLE = "google",
  XIAONIU = "xiaoniu",
  YOUDAO = "youdao",
  TENCENT = "tencent",
  OPENAI = "openai",
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
  | "UNDERLINE_DISPLAY"
  | "SYSTEM_ROLE"
  | "USER_ROLE"
  | "TRANSLATION_SERVICES"
  | "SYSTEM_LANGUAGE";

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
      icon: Icons.lockOpen,
    },
    {
      label: "i18n_CLOSE",
      value: STATUS.CLOSE,
      icon: Icons.lock,
    },
  ],
  // 主题
  THEME: [
    {
      label: "i18n_LIGHT",
      value: THEME.LIGHT,
      icon: Icons.sunIcon,
    },
    {
      label: "i18n_DARK",
      value: THEME.DARK,
      icon: Icons.moonIcon,
    },
  ],
  // 翻译为
  TO: [
    {
      label: "i18n_CHINESE",
      value: TO.CHINESE,
      icon: Icons.globe,
    },
    {
      label: "i18n_ENGLISH",
      value: TO.ENGLISH,
      icon: Icons.globe,
    },
  ],
  // 文字展示
  FONT_DISPLAY: [
    {
      label: "i18n_FONT_DISPLAY_DEFAULT", // 默认样式
      value: FONT_DISPLAY.DEFAULT,
      groupLabel: "i18n_FONT_DISPLAY",
      group: FONT_GROUP,
      icon: Icons.type,
    },
    {
      label: "i18n_FONT_DISPLAY_BOLD", // 加粗显示
      value: FONT_DISPLAY.BOLD,
      groupLabel: "i18n_FONT_DISPLAY",
      group: FONT_GROUP,
      icon: Icons.bold,
    },
    {
      label: "i18n_FONT_DISPLAY_ITALIC", // 斜体显示
      value: FONT_DISPLAY.ITALIC,
      groupLabel: "i18n_FONT_DISPLAY",
      group: FONT_GROUP,
      icon: Icons.italic,
    },
  ],
  // 下划线展示
  UNDERLINE_DISPLAY: [
    {
      label: "i18n_UNDERLINE_DISPLAY_DEFAULT", // 默认不展示
      value: UNDERLINE_DISPLAY.DEFAULT,
      groupLabel: "i18n_FONT_UNDERLINE",
      group: FONT_UNDERLINE,
      icon: Icons.highlighter,
    },
    {
      label: "i18n_UNDERLINE_DISPLAY_WAVY", // 波浪线
      value: UNDERLINE_DISPLAY.WAVY,
      groupLabel: "i18n_FONT_UNDERLINE",
      group: FONT_UNDERLINE,
      icon: Icons.waves,
    },
  ],
  SYSTEM_ROLE: [],
  USER_ROLE: [],
  // 翻译服务
  TRANSLATION_SERVICES: [
    {
      label: "i18n_Microsoft_Translator",
      value: SERVICES.MICROSOFT,
      icon: Icons.languages,
    },
    {
      label: "i18n_Google_Translator",
      value: SERVICES.GOOGLE,
      icon: Icons.languages,
    },
    {
      label: "i18n_Xiaoniu_Translator",
      value: SERVICES.XIAONIU,
      icon: Icons.languages,
    },
    {
      label: "i18n_Youdao_Translator",
      value: SERVICES.YOUDAO,
      icon: Icons.languages,
    },
    {
      label: "i18n_Tencent_Translator",
      value: SERVICES.TENCENT,
      icon: Icons.languages,
    },
    {
      label: "i18n_OpenAI_Translator",
      value: SERVICES.OPENAI,
      icon: Icons.languages,
    },
  ],
  SYSTEM_LANGUAGE: [
    {
      label: "i18n_System_Chinese",
      value: SYSTEM_LANGUAGE.ZH_CN,
      icon: Icons.earth,
    },
    {
      label: "i18n_System_English",
      value: SYSTEM_LANGUAGE.EN,
      icon: Icons.earth,
    },
  ],
};

export const defaultOptions: Record<SettingKeys, string> = {
  STATUS: STATUS.OPEN,
  THEME: THEME.LIGHT,
  TO: TO.ENGLISH,
  FONT_DISPLAY: FONT_DISPLAY.DEFAULT,
  UNDERLINE_DISPLAY: UNDERLINE_DISPLAY.WAVY,
  SYSTEM_ROLE: "You are a professional, authentic machine translation engine.",
  USER_ROLE: `Translate the following text into {{to}}, If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes:
{{origin}}`,
  TRANSLATION_SERVICES: SERVICES.GOOGLE,
  SYSTEM_LANGUAGE: SYSTEM_LANGUAGE.EN,
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
