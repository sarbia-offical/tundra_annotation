import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/assets/tailwind.css";
import initTranslations from "@/lib/i18n.ts";
import { i18nConfig } from "@/lib/i18nType.ts";

initTranslations(i18nConfig.defaultLocale, ["common", "popup"]);
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
