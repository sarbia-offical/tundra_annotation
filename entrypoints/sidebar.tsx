import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { RiDashboardFill } from "react-icons/ri";
import { IoMdLogIn } from "react-icons/io";
import { SidebarType } from "./type";
import { useTranslation } from "react-i18next";

const Sidebar = ({
  sideNav,
  closeContent,
}: {
  sideNav: (sidebarType: SidebarType) => void;
  closeContent?: () => void;
}) => {
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.HOME);
  const className = `flex flex-col items-start gap-4 px-2 py-5`;
  const selectedClassName = `bg-primary text-lg font-semibold text-primary-foreground`;
  const basicStyle = `flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors rounded-full`;
  const { t } = useTranslation();
  return (
    <aside className="absolute inset-y-0 right-0 z-10 flex w-14 flex-col border-r bg-background border-l-[1px]">
      {closeContent && (
        <a
          className="hover:cursor-pointer flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground ml-auto mr-auto"
          href="#"
          onClick={() => {
            closeContent();
          }}
        >
          <IoMdCloseCircle className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">{t("closeSidebar")}</span>
        </a>
      )}
      <nav className={`${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={`${basicStyle} ${
                  sidebarType == SidebarType.HOME
                    ? "bg-primary text-lg font-semibold text-primary-foreground"
                    : ""
                }`}
                href="#"
                onClick={() => {
                  setSidebarType(SidebarType.HOME);
                  sideNav(SidebarType.HOME);
                }}
              >
                <RiDashboardFill
                  className={`h-4 w-4 transition-all group-hover:scale-110`}
                />
                <span className="sr-only">{t("home")}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">{t("home")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className={`${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={`${basicStyle} ${
                  sidebarType == SidebarType.SETTINGS
                    ? `rounded-full ${selectedClassName}`
                    : ""
                } `}
                href="#"
                onClick={() => {
                  setSidebarType(SidebarType.SETTINGS);
                  sideNav(SidebarType.SETTINGS);
                }}
              >
                <IoIosSettings className={`h-5 w-5`} />
                <span className="sr-only">{t("settings")}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">{t("settings")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className={`${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={`${basicStyle} ${
                  sidebarType == SidebarType.ACCOUNT
                    ? `rounded-full ${selectedClassName}`
                    : ""
                } `}
                href="#"
                onClick={() => {
                  setSidebarType(SidebarType.ACCOUNT);
                  sideNav(SidebarType.ACCOUNT);
                }}
              >
                <IoMdLogIn className={`h-5 w-5`} />
                <span className="sr-only">{t("account")}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">{t("account")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;
