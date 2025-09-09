import { createContext } from "react";
import { AppStoreType } from "./store";

export const AppInfoContext = createContext<AppStoreType | null>(null);
