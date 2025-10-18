import { Container } from "./Container";
import { StoreProvider } from "@/store/store.context";
import initTranslations from "@/lib/i18n.ts";
import { i18nConfig } from "@/lib/i18nType.ts";
import ReactDOM from "react-dom/client";
import { MarkStoreProvider } from "./store/store.context";
import globalStyle from "./globalStyle.css?raw";
import "./style.css";
import { NotificationProvider } from "@/components/ui/notification/notification.context";
import { NotificationContainer } from "@/components/ui/notification/notification";

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
    initTranslations(i18nConfig.defaultLocale, ["common", "popup"]);
    const ui = await createShadowRootUi(ctx, {
      name: "tundra-annotation",
      position: "inline",
      inheritStyles: true,
      onMount: (container) => {
        injectGlobalStyles();
        const root = ReactDOM.createRoot(container);
        root.render(
          <StoreProvider>
            <MarkStoreProvider>
              <NotificationProvider config={{ maxCount: 3, duration: 3000 }}>
                <Container />
                <NotificationContainer />
              </NotificationProvider>
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
