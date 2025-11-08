import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { SerializedRange } from "@/lib/Marks/Mark.type";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface MarkListItemProps {
  mark: SerializedRange;
  onRemove?: (uid: string) => void;
  onClick?: (mark: SerializedRange) => void;
}

export const MarkListItem: React.FC<MarkListItemProps> = ({
  mark,
  onRemove,
  onClick,
}) => {
  const { t } = useTranslation();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(mark.uid);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("justNow");
    if (minutes < 60) return t("minutesAgo", { minutes: minutes });
    if (hours < 24) return t("hoursAgo", { hours: hours });
    if (days < 7) return t("daysAgo", { days: days });
    return date.toLocaleDateString("zh-CN");
  };

  const animations = useMemo(
    () => ({
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
    }),
    []
  );
  return (
    <motion.div
      layout
      {...animations}
      transition={{ type: "spring", bounce: 0.15, duration: 0.2 }}
      className={cn(
        "group relative rounded-lg border p-3 cursor-pointer",
        "hover:bg-accent hover:shadow-md transition-all",
        "bg-card"
      )}
      onClick={() => onClick?.(mark)}
    >
      {/* 颜色指示条 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: mark.color }}
      />

      {/* 内容区域 */}
      <div className="pl-3 pr-8">
        {/* 文本内容 */}
        <div className="text-sm font-medium line-clamp-2 mb-1 text-foreground">
          {mark.text}
        </div>

        {/* 上下文预览 */}
        {(mark.textBefore || mark.textAfter) && (
          <div className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {mark.textBefore && (
              <span className="opacity-60">
                ...{mark.textBefore.slice(-20)}
              </span>
            )}
            <span className="font-medium mx-1">{mark.text}</span>
            {mark.textAfter && (
              <span className="opacity-60">
                {mark.textAfter.slice(0, 20)}...
              </span>
            )}
          </div>
        )}

        {/* 元信息 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(mark.createDate)}</span>
          {mark.pageData?.title && (
            <>
              <span>•</span>
              <span className="line-clamp-1 flex-1">{mark.pageData.title}</span>
            </>
          )}
        </div>
      </div>

      {/* 删除按钮 */}
      <Button
        onClick={handleRemove}
        size="iconMini"
        variant="icon"
        aria-label={t("deleteMarker")}
        className={cn("absolute right-2 top-2")}
      >
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  );
};

MarkListItem.displayName = "MarkListItem";
