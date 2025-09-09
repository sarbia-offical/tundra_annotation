export enum Storage {
  LOCAL = "local",
  SYNC = "sync",
  SESSION = "session",
}
export type StorageType = Storage;

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
export type ThemeType = Theme;
export const themeList = [Theme.LIGHT, Theme.DARK];
