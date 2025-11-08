import React from "react";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";
import { useAllMarks } from "@/store/markStore";
import { useTranslation } from "react-i18next";

interface MarkPanelTriggerProps {
  onClick: () => void;
  className?: string;
}

export const MarkPanelTrigger: React.FC<MarkPanelTriggerProps> = ({
  onClick,
  className,
}) => {
  const { t } = useTranslation();
  const allMarks = useAllMarks();

  return (
    <Button
      onClick={onClick}
      className={className}
      size="icon"
      aria-label={t("openMarkList")}
    >
      <List className="h-5 w-5" />
      {allMarks.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {allMarks.length}
        </span>
      )}
    </Button>
  );
};

MarkPanelTrigger.displayName = "MarkPanelTrigger";
