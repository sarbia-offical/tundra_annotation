import { createContext, Dispatch } from "react";
import { Action, ActionType, Todo, ToDoListType } from "./toDoListType";

const todoReducer = (state: ToDoListType, action: Action): ToDoListType => {
  const { type } = action;
  switch (type) {
    case ActionType.ADD:
      return {
        toDoList: [
          ...state.toDoList,
          {
            id: Date.now(),
            text: action.text,
            completed: false,
          },
        ],
      };
    case ActionType.TOGGLE:
      return {
        toDoList: state.toDoList.map((ele: Todo) =>
          ele.id === action.id ? { ...ele, completed: !ele.completed } : ele
        ),
      };
    case ActionType.REMOVE:
      return {
        toDoList: state.toDoList.filter((ele: Todo) => ele.id !== action.id),
      };
    default:
      return state;
  }
};

export const TodoStateContext = createContext<ToDoListType | null>(null);
export const TodoDispatchContext = createContext<Dispatch<Action> | null>(null);

export const TodoProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, {
    toDoList: [],
  });
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
};
