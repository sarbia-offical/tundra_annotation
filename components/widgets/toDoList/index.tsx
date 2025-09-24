import React from "react";
import { TodoProvider } from "./toDoContext";
import { TodoInput } from "./TodoInput";
import { TodoListContainer } from "./TodoList";

const TodoList: React.FC = () => {
  return (
    <TodoProvider>
      <TodoInput />
      <TodoListContainer />
    </TodoProvider>
  );
};
TodoList.displayName = "TodoList";
export { TodoList };
