export enum I18n {
  ZH_CN = "zh_CN",
  EN = "en",
}

export interface LanguageType {
  locale: I18n;
  name: string;
}

export interface i18nConfigType {
  locales: string[];
  defaultLocale: string;
}

export const i18nConfig: i18nConfigType = {
  locales: ["en", "zh_CN"],
  defaultLocale: "en",
};

const languages: LanguageType[] = [
  { locale: I18n.EN, name: "English" },
  { locale: I18n.ZH_CN, name: "中文简体" },
];
export default languages;
