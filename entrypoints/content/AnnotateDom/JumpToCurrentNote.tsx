import React from "react";
import { Crosshair } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface JumpToCurrentNoteProps {
  changeVisible: (visible: boolean) => void;
}

export const JumpToCurrentNote: React.FC<JumpToCurrentNoteProps> = ({
  changeVisible,
}) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={() => {
        changeVisible(true);
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute right-0 top-[-40px] hover:animate-wobble w-7 h-7">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1] w-full h-full gradient-border-box"></div>
              <Crosshair className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-white dark:text-black rounded-full w-[80%] h-[80%] active:scale-90 duration-75 inline-block cursor-pointer" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" sticky="always" className="z-[9999]">
            <div>{t("latestComments")}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
