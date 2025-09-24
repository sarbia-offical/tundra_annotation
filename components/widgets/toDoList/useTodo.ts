import React from "react";
import { TodoDispatchContext, TodoStateContext } from "./toDoContext";
import { Action, ToDoListType } from "./toDoListType";
export function useTodos(): ToDoListType {
  const state = useContext(TodoStateContext);
  if (!state) throw new Error("useTodos must be used within TodoProvider");
  return state;
}

export function useTodoDispatch(): React.Dispatch<Action> {
  const dispatch = useContext(TodoDispatchContext);
  if (!dispatch)
    throw new Error("useTodoDispatch must be used within TodoProvider");
  return dispatch;
}
