import React, { createContext, Dispatch } from "react";
import {
  SwitchState,
  Action,
  ActionType,
  SwitchProps,
  SwitchType,
} from "./SwitchTypes";

const switchreducer = (state: SwitchState, action: Action): SwitchState => {
  const { type } = action;
  switch (type) {
    case ActionType.SWITCH:
      return {
        ...state,
        activeValue: action.text,
      };

    default:
      return state;
  }
};
export const SwitchStateContext = createContext<SwitchState | null>(null);

export const useSwitchContext = () => {
  const context = React.useContext(SwitchStateContext);
  if (!context) {
    throw new Error("useSwitchContext must be used within a SwitchProvider");
  }
  return context;
};

export const SwitchDispatchContext = createContext<Dispatch<Action> | null>(
  null
);

export function useSwitchDispatch(): React.Dispatch<Action> {
  const dispatch = useContext(SwitchDispatchContext);
  if (!dispatch)
    throw new Error("useSwitchDispatch must be used within SwitchProvider");
  return dispatch;
}

export const SwitchProvider: React.FC<{
  value: SwitchProps;
  children: React.ReactNode;
}> = ({ value, children }) => {
  const [state, dispatch] = useReducer(switchreducer, {
    ...value,
    activeValue: value.defaultValue,
    switchType: value?.switchType ? value.switchType : SwitchType.Horizontal,
  });

  return (
    <SwitchStateContext.Provider value={state}>
      <SwitchDispatchContext.Provider value={dispatch}>
        {children}
      </SwitchDispatchContext.Provider>
    </SwitchStateContext.Provider>
  );
};
