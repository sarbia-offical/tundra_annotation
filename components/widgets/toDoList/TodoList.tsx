import React from "react";
import { useTodos } from "./useTodo";
import TodoItem from "./TodoItem";
const TodoListContainer: React.FC = () => {
  const { toDoList } = useTodos();
  return (
    <ul className="mt-2">
      {toDoList.length === 0 ? (
        <p className="text-gray-500 text-center">No todos yet, add one!</p>
      ) : (
        toDoList.map((todo) => <TodoItem key={todo.id} todo={todo} />)
      )}
    </ul>
  );
};
TodoListContainer.displayName = "TodoListContainer";
export { TodoListContainer };
