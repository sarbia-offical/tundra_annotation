import { createContext } from "react";
import { MarkStoreType } from "./store";

export const MarkContext = createContext<MarkStoreType | null>(null);
