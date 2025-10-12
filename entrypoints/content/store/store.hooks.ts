import { useStore } from "./store.context";
import { PopoverPositionType } from "./store.type";

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
