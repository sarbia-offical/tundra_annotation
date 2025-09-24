import React from "react";
import { useTodoDispatch } from "./useTodo";
import { ActionType } from "./toDoListType";

const TodoInput: React.FC = () => {
  const [text, setText] = useState("");
  const dispatch = useTodoDispatch();
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            const text = event.currentTarget.value;
            dispatch({
              type: ActionType.ADD,
              text: text,
            });
            setText("");
          }
        }}
        placeholder="Add a todo"
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
TodoInput.displayName = "TodoInput";
export { TodoInput };
