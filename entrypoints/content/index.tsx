import { Container } from "./Container";
import initTranslations from "@/lib/i18n.ts";
import { i18nConfig } from "@/lib/i18nType.ts";
import ReactDOM from "react-dom/client";
import { MarkStoreProvider } from "./store/store.context";
import { MarkStoreProvider as MarksStoreProvider } from "@/store/markStore";
import globalStyle from "./globalStyle.css?raw";
import "./style.css";
import { ConfigStoreProvider } from "@/store/configStore";

const injectGlobalStyles = () => {
  if (document.getElementById("global-annotate-styles")) return;
  const style = document.createElement("style");
  style.id = "global-annotate-styles";
  style.textContent = globalStyle;
  document.head.appendChild(style);
};

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    initTranslations(i18nConfig.defaultLocale, ["common", "popup", "content"]);
    const ui = await createShadowRootUi(ctx, {
      name: "tundra-annotation",
      position: "inline",
      inheritStyles: true,
      onMount: (container) => {
        injectGlobalStyles();
        const root = ReactDOM.createRoot(container);
        root.render(
          <ConfigStoreProvider>
            <MarksStoreProvider>
              <MarkStoreProvider>
                <Container />
              </MarkStoreProvider>
            </MarksStoreProvider>
          </ConfigStoreProvider>
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
