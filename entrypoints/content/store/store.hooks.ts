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
 * 控制弹窗显隐的hooks
 * @returns
 */
export const useColor = () => {
  const { color, dispatch } = useStore();

  const setColor = useCallback(
    (color: string) => {
      dispatch({
        type: "CHANGE_COLOR",
        payload: color,
      });
    },
    [dispatch]
  );

  return {
    color,
    setColor,
  };
};
