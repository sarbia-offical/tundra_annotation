import { useState, useEffect, useCallback } from "react";
import { StorageType, Storage } from "./useStorage.type";

/**
 *
 * @param key
 * @param defaultValue
 * @param storage
 * @returns
 * @example
 * const [value, toggle] = useStorageSwitch<boolean>("DefaultEnabled", false);
 * toggle(true | false)
 */
export function useStorageSwitch<T>(
  key: string,
  defaultValue: T,
  storage: StorageType = Storage.LOCAL
) {
  const [value, setValue] = useState<T>(defaultValue);
  // 初始化时从 storage 获取值
  useEffect(() => {
    const fetchValue = async () => {
      try {
        const result = await browser.storage.local.get(key);
        const stored = result[key];
        if (stored !== undefined) {
          // 尝试解析 JSON 字符串
          let parsed: unknown;
          try {
            parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
          } catch {
            parsed = stored;
          }
          setValue(parsed as T);
        }
      } catch (error) {
        console.error(`Failed to get ${key} from storage`, error);
      }
    };
    fetchValue();
  }, [key]);

  // 切换并保存到 storage
  const toggle = useCallback(
    (checked: T) => {
      setValue(checked);
      browser.storage[storage].set({ [key]: checked });
    },
    [key]
  );

  return [value, toggle] as const;
}
