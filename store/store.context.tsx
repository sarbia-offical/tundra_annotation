import { Config, createConfig } from "@/constant/model";
import { StoreAction, StoreContextType } from "./store.type";
import { produce } from "immer";
import React, { createContext } from "react";
import { Unwatch } from "wxt/utils/storage";

interface StoreProviderProps {
  children: React.ReactNode;
  initialConfig?: Config;
}

const StoreContext = createContext<StoreContextType | null>(null);

const setTheme = (theme: string) => {
  const html = document.getElementsByTagName("html");
  if (html.length) {
    html[0].classList.remove("light");
    html[0].classList.remove("dark");
    html[0].classList.add(theme === "dark" ? "dark" : "light");
  }
};

const storeReducer = produce((draft: Config, action: StoreAction) => {
  switch (action.type) {
    case "SET_STATUS":
      draft.status = action.payload;
      break;
    case "SET_THEME":
      const theme = action.payload;
      draft.theme = theme;
      setTheme(theme);
      break;
    case "SET_SYSTEM_LANGUAGE":
      draft.systemLanguage = action.payload;
      break;
    case "SET_TRANSLATION_SERVICE":
      draft.translationServices = action.payload;
      break;
    case "SET_TRANSLATION_TARGET":
      draft.to = action.payload;
      break;
    case "SET_FONT_DISPLAY":
      draft.fontDisplay = action.payload;
      break;
    case "SET_UNDERLINE_DISPLAY":
      draft.underlineDisplay = action.payload;
      break;
    case "UPDATE_STORAGE":
      storage.setItem("local:Annotation_Config", action.payload);
      break;
    case "INIT_FROM_STORAGE":
      const { theme: _theme } = action.payload;
      setTheme(_theme || "light");
      return {
        ...draft,
        ...action.payload,
      };
    default:
      break;
  }
});

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  initialConfig = { ...createConfig() },
}) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [initialConfiguration, setInitialConfiguration] = useState<Config>();
  const [state, dispatch] = useReducer(storeReducer, initialConfig);
  const unWatchRef = useRef<Unwatch | null>(null);
  const skipNextStorageSync = useRef<boolean>(false);
  useEffect(() => {
    const monitorStorage = () => {
      (async () => {
        const initializeFromStorage: () => Promise<boolean> = async () => {
          const value = await storage.getItem<Config>(
            "local:Annotation_Config"
          );
          let initialConfiguration: Config | null = null;
          if (value) {
            dispatch({
              type: "INIT_FROM_STORAGE",
              payload: value,
            });
            initialConfiguration = value;
          } else {
            initialConfiguration = initialConfig;
            await storage.setItem("local:Annotation_Config", initialConfig);
          }
          skipNextStorageSync.current = true;
          setInitialConfiguration(initialConfiguration);
          return Promise.resolve(true);
        };
        const initialConfiguration = await initializeFromStorage();

        if (initialConfiguration) {
          setIsInitialized(true);
          unWatchRef.current = storage.watch<Config>(
            "local:Annotation_Config",
            (newValue?: Config | null) => {
              if (newValue) {
                setInitialConfiguration(newValue);
                dispatch({
                  type: "INIT_FROM_STORAGE",
                  payload: newValue,
                });
              }
            }
          );
        }
      })();
    };
    monitorStorage();
    return () => {
      unWatchRef.current && unWatchRef.current();
    };
  }, []);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        isInitialized,
        initialConfiguration,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
