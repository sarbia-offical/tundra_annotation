import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App/index.tsx";
import { i18nConfig } from "@/components/i18Config.ts";
import initTranslations from "@/components/i18n.ts";
import { AppInfoStore } from "@/state/index.tsx";
import { MarkStore } from "./state/index.tsx";
import globalCssStyles from "./globalStyles.css?raw";

const injectGlobalStyles = () => {
  if (document.getElementById("global-annotate-styles")) return;
  const style = document.createElement("style");
  style.id = "global-annotate-styles";
  style.textContent = globalCssStyles;
  document.head.appendChild(style);
};

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    initTranslations(i18nConfig.defaultLocale, ["common", "content"]);
    const ui = await createShadowRootUi(ctx, {
      name: "dolphin-memory",
      position: "inline",
      inheritStyles: true,
      onMount: (container) => {
        injectGlobalStyles();
        const root = ReactDOM.createRoot(container);
        root.render(
          <AppInfoStore>
            <MarkStore>
              <App />
            </MarkStore>
          </AppInfoStore>
        );
        return root;
      },
      onRemove: (container) => {
        container?.unmount();
      },
    });
    ui.mount();
  },
});
