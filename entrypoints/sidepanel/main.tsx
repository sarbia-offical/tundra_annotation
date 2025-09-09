import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App/index";
import "./style.css";
import { i18nConfig } from "@/components/i18Config.ts";
import initTranslations from "@/components/i18n.ts";
import { AppInfoStore } from "@/state/index.tsx";

initTranslations(i18nConfig.defaultLocale, ["common", "sidepanel"]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppInfoStore>
      <App />
    </AppInfoStore>
  </React.StrictMode>
);
