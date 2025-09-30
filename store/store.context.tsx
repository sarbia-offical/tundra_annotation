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

const storeReducer = produce((draft: Config, action: StoreAction) => {
  switch (action.type) {
    case "SET_STATUS":
      draft.status = action.payload;
      break;
    case "SET_THEME":
      draft.theme = action.payload;
      break;
    case "SET_SYSTEM_LANGUAGE":
      draft.system_language = action.payload;
      break;
    case "SET_TRANSLATION_SERVICE":
      draft.translation_services = action.payload;
      break;
    case "SET_TRANSLATION_TARGET":
      draft.to = action.payload;
      break;
    case "SET_FONT_DISPLAY":
      draft.font_display = action.payload;
      break;
    case "SET_UNDERLINE_DISPLAY":
      draft.underline_display = action.payload;
      break;
    case "INIT_FROM_STORAGE":
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
          if (value) {
            dispatch({
              type: "INIT_FROM_STORAGE",
              payload: value,
            });
          } else {
            await storage.setItem("local:Annotation_Config", initialConfig);
          }
          skipNextStorageSync.current = true;
          return Promise.resolve(true);
        };
        const initializeStatus = await initializeFromStorage();

        if (initializeStatus) {
          setIsInitialized(true);
          unWatchRef.current = storage.watch<Config>(
            "local:Annotation_Config",
            (newValue?: Config | null) => {
              if (newValue) {
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
    <StoreContext.Provider value={{ state, dispatch, isInitialized }}>
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
