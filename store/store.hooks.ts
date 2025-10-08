import {
  FONT_DISPLAY,
  SERVICES,
  STATUS,
  SYSTEM_LANGUAGE,
  THEME,
  TO,
  UNDERLINE_DISPLAY,
} from "@/constant/options";
import { useStore } from "./store.context";
import { Config } from "@/constant/model";

export const useDisplaySettings = () => {
  const { state, dispatch, isInitialized, initialConfiguration } = useStore();

  const setStatus = useCallback(
    (status: STATUS) => {
      dispatch({ type: "SET_STATUS", payload: status });
    },
    [dispatch]
  );

  const setTheme = useCallback(
    (status?: THEME | null) => {
      dispatch({ type: "SET_THEME", payload: status || "" });
    },
    [dispatch]
  );

  const setTranslationService = useCallback(
    (status: SERVICES) => {
      dispatch({ type: "SET_TRANSLATION_SERVICE", payload: status });
    },
    [dispatch]
  );

  const setTargetLanguage = useCallback(
    (status: TO) => {
      dispatch({ type: "SET_TRANSLATION_TARGET", payload: status });
    },
    [dispatch]
  );

  const setSystemLanguage = useCallback(
    (status?: SYSTEM_LANGUAGE | null) => {
      dispatch({ type: "SET_SYSTEM_LANGUAGE", payload: status || "" });
    },
    [dispatch]
  );

  const setFontDisplay = useCallback(
    (fontDisplay?: FONT_DISPLAY | null) => {
      dispatch({ type: "SET_FONT_DISPLAY", payload: fontDisplay || "" });
    },
    [dispatch]
  );

  const setUnderlineDisplay = useCallback(
    (underlineDisplay: UNDERLINE_DISPLAY[]) => {
      dispatch({ type: "SET_UNDERLINE_DISPLAY", payload: underlineDisplay });
    },
    [dispatch]
  );

  const resetStorage = useCallback(
    (config: Partial<Config>) => {
      dispatch({ type: "INIT_FROM_STORAGE", payload: config });
    },
    [dispatch]
  );

  const updateStorage = useCallback(
    (config: Partial<Config>) => {
      dispatch({ type: "UPDATE_STORAGE", payload: config });
    },
    [dispatch]
  );

  const toggleStatus = useCallback(() => {
    const newStatus = state.status === STATUS.OPEN ? STATUS.CLOSE : STATUS.OPEN;
    setStatus(newStatus);
  }, [state.status, setStatus]);

  const defaultConfiguration = useMemo(
    () => ({
      status: state.status,
      theme: state.theme,
      systemLanguage: state.systemLanguage,
      fontDisplay: state.fontDisplay,
      underlineDisplay: state.underlineDisplay,
    }),
    [
      state.status,
      state.theme,
      state.systemLanguage,
      state.fontDisplay,
      state.underlineDisplay,
    ]
  );
  return {
    defaultConfiguration,
    isInitialized,
    initialConfiguration,
    setStatus,
    setTheme,
    setSystemLanguage,
    setTranslationService,
    setTargetLanguage,
    setFontDisplay,
    setUnderlineDisplay,
    resetStorage,
    updateStorage,
    toggleStatus,
    isEnabled: state.status === STATUS.OPEN,
  };
};
