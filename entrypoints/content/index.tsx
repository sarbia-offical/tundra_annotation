import { Container } from "./Container";
import { StoreProvider } from "@/store/store.context";
import initTranslations from "@/lib/i18n.ts";
import { i18nConfig } from "@/lib/i18nType.ts";
import ReactDOM from "react-dom/client";
import "./style.css";
import { MarkStoreProvider } from "./store/store.context";

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    initTranslations(i18nConfig.defaultLocale, ["common", "popup"]);
    const ui = await createShadowRootUi(ctx, {
      name: "tundra-annotation",
      position: "inline",
      inheritStyles: true,
      onMount: (container) => {
        const root = ReactDOM.createRoot(container);
        root.render(
          <StoreProvider>
            <MarkStoreProvider>
              <Container />
            </MarkStoreProvider>
          </StoreProvider>
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
