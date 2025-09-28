import { defaultOptions, services } from "./options";

interface Mapping {
  [key: string]: string;
}

export class Config {
  status: string;
  theme: string;
  to: string;
  font_display: string;
  underline_display: string;
  system_role: Mapping;
  user_role: Mapping;
  translation_services: string;
  constructor() {
    this.status = defaultOptions.STATUS;
    this.theme = defaultOptions.THEME;
    this.to = defaultOptions.TO;
    this.font_display = defaultOptions.FONT_DISPLAY;
    this.underline_display = defaultOptions.FONT_DISPLAY;
    this.system_role = contextFactory(defaultOptions.SYSTEM_ROLE);
    this.user_role = contextFactory(defaultOptions.USER_ROLE);
    this.translation_services = services.google;
  }
}

const contextFactory = (str: string): Mapping => {
  let systems_role: Mapping = {};
  Object.keys(services).forEach((key) => {
    systems_role[key] = str;
  });
  return systems_role;
};
