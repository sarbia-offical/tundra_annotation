export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface ToDoListType {
  toDoList: Todo[];
}

export enum ActionType {
  ADD = "ADD",
  TOGGLE = "TOGGLE",
  REMOVE = "REMOVE",
}

export type Action =
  | {
      type: ActionType.ADD;
      text: string;
    }
  | {
      type: ActionType.TOGGLE;
      id: number;
    }
  | {
      type: ActionType.REMOVE;
      id: number;
    };
