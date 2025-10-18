import { SerializedRange } from "@/lib/Marks/Mark.type";
import { useStore } from "./store.context";
import { PopoverPositionType, TriggeringExistingMarkType } from "./store.type";

/**
 * 控制弹窗位置的hooks
 * @returns
 */
export const usePopoverPosition = () => {
  const { popoverPosition, dispatch } = useStore();
  const setPosition = useCallback(
    (position: PopoverPositionType) => {
      dispatch({
        type: "SET_POPOVER_POSITION",
        payload: position,
      });
    },
    [dispatch]
  );

  const setPositionByCoordinates = useCallback(
    (x: number, y: number) => {
      dispatch({
        type: "SET_POPOVER_POSITION",
        payload: {
          x,
          y,
        },
      });
    },
    [dispatch]
  );

  return {
    popoverPosition,
    setPosition,
    setPositionByCoordinates,
  };
};

/**
 * 控制弹窗显隐的hooks
 * @returns
 */
export const usePopoverVisibility = () => {
  const { popoverVisible, dispatch } = useStore();

  const showPopover = useCallback(() => {
    dispatch({
      type: "POPOVER_VISIBLE",
      payload: true,
    });
  }, [dispatch]);

  const hidePopover = useCallback(() => {
    dispatch({
      type: "POPOVER_VISIBLE",
      payload: false,
    });
  }, [dispatch]);

  const togglePopover = useCallback(() => {
    dispatch({
      type: "POPOVER_VISIBLE",
      payload: !popoverVisible,
    });
  }, [dispatch, popoverVisible]);

  return {
    isVisible: popoverVisible,
    showPopover,
    hidePopover,
    togglePopover,
  };
};

/**
 * 设置翻译文本
 */
export const useTranslationText = () => {
  const { translationText, dispatch } = useStore();
  // const text = useMemo(() => translationText, [translationText]);
  const setTranslationText = useCallback(
    (value: string) => {
      dispatch({
        type: "SET_TRANSLATION_TEXT",
        payload: value,
      });
    },
    [dispatch]
  );

  return {
    translationText,
    setTranslationText,
  };
};

/**
 * 设置当前选中的Mark
 */
export const useCurrentmark = () => {
  const { currentMark, dispatch } = useStore();
  const setCurrentMark = useCallback(
    (value: SerializedRange) => {
      dispatch({
        type: "SET_CURRENT_MARK",
        payload: value,
      });
    },
    [dispatch]
  );
  return {
    currentMark,
    setCurrentMark,
  };
};

/**
 * 设置弹窗的位置、翻译文本、是否显隐、当前的标记
 */
export const useSetTriggeringExistingMark = () => {
  const { dispatch } = useStore();
  const setTriggeringExistingMark = useCallback(
    (value: TriggeringExistingMarkType) => {
      dispatch({
        type: "TRIGGERING_EXISTING_MARK",
        payload: value,
      });
    },
    [dispatch]
  );
  return {
    setTriggeringExistingMark,
  };
};
