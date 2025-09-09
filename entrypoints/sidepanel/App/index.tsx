import React, { useEffect, useState } from "react";
import Sidebar from "@/entrypoints/sidebar.tsx";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/type";
import { Home } from "@/entrypoints/sidepanel/Home/index";
import { SettingsPage } from "@/entrypoints/sidepanel/Setting/index";
import { Account } from "@/entrypoints/sidepanel/Account/index";
import { useTranslation } from "react-i18next";
import { SidebarType } from "@/entrypoints/type";
import DotMatrix from "@/components/dotMatrix";
import Header from "@/entrypoints/sidepanel/Header/index";
import { useAppInconContext } from "@/state/hooks";
import { AppInfoState } from "@/state/type";
import "@/assets/main.css";

export default () => {
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.HOME);
  const [headTitle, setHeadTitle] = useState("home");
  const { i18n } = useTranslation();
  const theme = useAppInconContext((state: AppInfoState) => state.theme);
  const isLoaded = useAppInconContext((state: AppInfoState) => state.isLoaded);
  const lang = useAppInconContext((state: AppInfoState) => state.i18n);
  async function initI18n() {
    await i18n.changeLanguage(lang);
  }
  useEffect(() => {
    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        const { messageType, content } = message;
        if (messageType == MessageType.changeLocale) {
          i18n.changeLanguage(content);
        }
      }
    );
    initI18n();
  }, [isLoaded]);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="fixed top-0 right-0 h-screen w-full bg-background z-[100] rounded-l-xl shadow-2xl flex flex-col">
        <Header headTitle={headTitle} />
        <div className="flex h-screen relative">
          <Sidebar
            sideNav={(sidebarType: SidebarType) => {
              console.log("sidebarType", sidebarType);
              setSidebarType(sidebarType);
              setHeadTitle(sidebarType);
            }}
          />
          <main className="flex-1 overflow-auto mr-14 p-4 relative">
            <DotMatrix />
            <div className="p-4 h-full">
              {sidebarType === SidebarType.HOME && <Home />}
              {sidebarType === SidebarType.SETTINGS && <SettingsPage />}
              {sidebarType === SidebarType.ACCOUNT && <Account />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
