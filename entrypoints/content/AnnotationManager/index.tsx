import React, { useState } from "react";
import { Pin, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { MentionItem } from "./MentionItem";
import { useMarkContext } from "../state/hooks";
import { MarkState } from "../state/type";
import { useCollapsePanel } from "@/components/collapsePanel/CollapseContext";
import { isEmpty } from "lodash";
import Empty from "@/assets/empty.webp";
import UnderConstruction from "@/assets/underConstruction.webp";

interface AnnotationManagerProps {
  children?: React.ReactNode;
  className?: string;
}

const AnnotationManager: React.FC<AnnotationManagerProps> = ({ className }) => {
  const markState = useMarkContext((state: MarkState) => ({
    annotations: state.annotations,
  }));
  const { togglePin, fixedPin } = useCollapsePanel();
  const { t } = useTranslation();

  return (
    <div className={`p-4 relative ${className}`}>
      <Tabs defaultValue="all" className="rounded-md w-full h-full">
        <TabsList>
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="mentions">{t("mentions")}</TabsTrigger>
        </TabsList>
        <TabsContent
          value="all"
          className="max-h-[450px] overflow-y-scroll scrollbar-hide pb-2 annotationItem"
        >
          {!isEmpty(markState.annotations) ? (
            Object.keys(markState.annotations).map(
              (key: string, index: number) => (
                <MentionItem key={index} value={markState.annotations[key]}>
                  {key}
                </MentionItem>
              )
            )
          ) : (
            <div className="flex flex-col items-center justify-center mt-10">
              <picture className="inline-block rounded-full active:scale-90 duration-75 w-[250px] h-[250px]">
                <source srcSet={Empty} type="image/avif"></source>
                <img src={Empty} className="w-full h-full" />
              </picture>
              <div className="mt-5 text-muted-foreground text-center italic">
                {t("noMoreNotes")}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="mentions"
          className="max-h-[450px] overflow-y-scroll scrollbar-hide"
        >
          <div className="flex flex-col items-center justify-center mt-10">
            <picture className="inline-block rounded-full active:scale-90 duration-75 ">
              <source srcSet={UnderConstruction} type="image/avif"></source>
              <img src={UnderConstruction} className="w-full h-full" />
            </picture>
            <div className="mt-5 text-muted-foreground text-center italic">
              {t("underConstruction")}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="absolute right-6 top-7 cursor-pointer hover:animate-wobble origin-bottom"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                togglePin(!fixedPin);
              }}
            >
              <Pin
                className={`w-4 h-4 transition-transform active:translate-y-1 duration-75 ${
                  fixedPin
                    ? "text-[#f34f1d]"
                    : "text-[#9ca3af] dark:text-[#ffffff]"
                }`}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>{t("pinMessage")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AnnotationManager;
