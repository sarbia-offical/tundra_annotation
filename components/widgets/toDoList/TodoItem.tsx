import { ActionType, Todo } from "./toDoListType";
import { useTodoDispatch } from "./useTodo";

export default function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useTodoDispatch();

  return (
    <li className="flex items-center justify-between bg-white px-3 py-2 rounded-lg shadow-sm mb-2">
      <span
        onClick={() => dispatch({ type: ActionType.REMOVE, id: todo.id })}
        className={`flex-1 cursor-pointer ${
          todo.completed ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => dispatch({ type: ActionType.REMOVE, id: todo.id })}
        className="ml-3 text-red-500 hover:text-red-700 transition"
      >
        ❌
      </button>
    </li>
  );
}
