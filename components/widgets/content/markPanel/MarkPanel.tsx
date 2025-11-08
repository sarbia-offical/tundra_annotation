import React from "react";
import {
  Sidebar,
  SidebarBackdrop,
  SidebarContent,
  SidebarHeader,
  SidebarBody,
} from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { MarkListItem } from "./MarkListItem";
import { MarkPanelProvider } from "./MarkPanel.context";
import { useMarkPanelData } from "./MarkPanel.hook";
import { MarkPanelProps } from "./MarkPanel.type";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import { useTranslation } from "react-i18next";

const MarkPanelContent: React.FC = () => {
  const { t } = useTranslation();
  const { isOpen, onClose, allMarks, handleMarkClick, handleMarkRemove } =
    useMarkPanelData();

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      closeOnOverlayClick={true}
      showCloseButton={true}
    >
      <SidebarBackdrop />
      <SidebarContent className="w-96">
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("myMarks")}</h2>
            <span className="text-sm text-muted-foreground">
              {t("totalMarks", { count: allMarks.length })}
            </span>
          </div>
        </SidebarHeader>

        <SidebarBody className="overflow-y-auto">
          {allMarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <List className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-sm">{t("noMarks")}</p>
              <p className="text-xs mt-2">{t("createMarkHint")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {allMarks.map((mark) => (
                  <MarkListItem
                    key={mark.uid}
                    mark={mark}
                    onClick={handleMarkClick}
                    onRemove={handleMarkRemove}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </SidebarBody>
      </SidebarContent>
    </Sidebar>
  );
};

export const MarkPanel: React.FC<MarkPanelProps> = ({
  isOpen,
  onClose,
  markRef,
  className,
}) => {
  return (
    <MarkPanelProvider isOpen={isOpen} onClose={onClose} markRef={markRef}>
      <div className={cn(className)}>
        <MarkPanelContent />
      </div>
    </MarkPanelProvider>
  );
};

MarkPanel.displayName = "MarkPanel";
