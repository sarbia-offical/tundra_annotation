import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import { produce } from "immer";
import { Config, createConfig } from "@/constant/model";
import { ConfigStoreAction, ConfigStoreContextType } from "./configStore.type";
import { Unwatch } from "wxt/utils/storage";

interface ConfigStoreProviderProps {
  children: React.ReactNode;
  initialConfig?: Config;
}

const ConfigStoreContext = createContext<ConfigStoreContextType | null>(null);

/**
 * Storage 键名
 */
const STORAGE_KEY = "local:Annotation_Config";

/**
 * 设置主题样式
 */
const setTheme = (theme: string) => {
  const html = document.getElementsByTagName("html");
  if (html.length) {
    html[0].classList.remove("light", "dark");
    html[0].classList.add(theme === "dark" ? "dark" : "light");
  }
};

/**
 * 配置状态 Reducer
 */
const configStoreReducer = produce(
  (draft: Config, action: ConfigStoreAction) => {
    switch (action.type) {
      case "SET_STATUS":
        draft.status = action.payload;
        break;
      case "SET_THEME":
        draft.theme = action.payload;
        setTheme(action.payload);
        break;
      case "SET_TO":
        draft.to = action.payload;
        break;
      case "SET_FONT_DISPLAY":
        draft.fontDisplay = action.payload;
        break;
      case "SET_UNDERLINE_DISPLAY":
        draft.underlineDisplay = action.payload;
        break;
      case "SET_SYSTEM_ROLE":
        draft.systemRole = action.payload;
        break;
      case "SET_USER_ROLE":
        draft.userRole = action.payload;
        break;
      case "SET_TRANSLATION_SERVICES":
        draft.translationServices = action.payload;
        break;
      case "SET_SYSTEM_LANGUAGE":
        draft.systemLanguage = action.payload;
        break;
      case "SET_API_URL":
        draft.apiUrl = action.payload;
        break;
      case "UPDATE_CONFIG":
        // 更新部分配置，并保存到 storage
        Object.assign(draft, action.payload);
        storage.setItem(STORAGE_KEY, { ...draft });
        break;
      case "INIT_FROM_STORAGE":
        // 从 storage 初始化配置
        const { theme: _theme } = action.payload;
        if (_theme) {
          setTheme(_theme);
        }
        return {
          ...draft,
          ...action.payload,
        };
      default:
        break;
    }
  }
);

/**
 * ConfigStore Provider 组件
 * 负责初始化配置、监听 storage 变化、提供配置状态
 */
export const ConfigStoreProvider: React.FC<ConfigStoreProviderProps> = ({
  children,
  initialConfig = createConfig(),
}) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [state, dispatch] = useReducer(configStoreReducer, initialConfig);
  const unWatchRef = useRef<Unwatch | null>(null);

  useEffect(() => {
    const initializeConfigStore = async () => {
      try {
        // 从 storage 读取已保存的配置
        const storageConfig = await storage.getItem<Config>(STORAGE_KEY);

        // 获取默认配置
        const defaultConfig = createConfig();

        let finalConfig: Config;

        if (storageConfig) {
          // 合并配置：默认配置 + storage 配置（storage 优先级更高）
          // 这样可以确保新增的配置项能从默认值获取
          finalConfig = {
            ...defaultConfig,
            ...storageConfig,
          };

          // 初始化状态
          dispatch({
            type: "INIT_FROM_STORAGE",
            payload: finalConfig,
          });
        } else {
          // 如果 storage 中没有配置，使用默认配置并保存
          finalConfig = defaultConfig;
          await storage.setItem(STORAGE_KEY, finalConfig);

          dispatch({
            type: "INIT_FROM_STORAGE",
            payload: finalConfig,
          });
        }

        setIsInitialized(true);

        // 监听 storage 变化（其他页面的更新）
        unWatchRef.current = storage.watch<Config>(
          STORAGE_KEY,
          (newValue?: Config | null) => {
            if (newValue) {
              // 同样进行配置合并
              const mergedConfig = {
                ...defaultConfig,
                ...newValue,
              };

              dispatch({
                type: "INIT_FROM_STORAGE",
                payload: mergedConfig,
              });
            }
          }
        );
      } catch (error) {
        console.error("Failed to initialize ConfigStore:", error);
        setIsInitialized(true); // 即使失败也标记为已初始化
      }
    };

    initializeConfigStore();

    // 清理函数：取消 storage 监听
    return () => {
      if (unWatchRef.current) {
        unWatchRef.current();
      }
    };
  }, []);

  return (
    <ConfigStoreContext.Provider
      value={{
        state,
        dispatch,
        isInitialized,
      }}
    >
      {children}
    </ConfigStoreContext.Provider>
  );
};

/**
 * 使用 ConfigStore 的 Hook
 */
export const useConfigStore = (): ConfigStoreContextType => {
  const context = useContext(ConfigStoreContext);
  if (!context) {
    throw new Error("useConfigStore must be used within a ConfigStoreProvider");
  }
  return context;
};
