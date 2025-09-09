import { Annotate } from "@/services/api.type";
import { useScrollToAnnotation } from "../Hooks/useScrollToAnnotation";
import { Copy } from "lucide-react";
import React from "react";

interface AnnotationIconProps {
  value: Annotate;
  className?: string;
}
export const AnnotationId: React.FC<AnnotationIconProps> = ({
  value,
  className,
}) => {
  const { scrollToAnnotation } = useScrollToAnnotation();
  return (
    <div
      className={`flex items-center text-slate-600 dark:text-slate-200 font-bold hover:underline cursor-pointer ${
        className || ""
      }`}
      onClick={() => {
        scrollToAnnotation(value.uid);
      }}
    >
      <p className="mr-1 text-[12px]">UID: #{value.uid.substring(0, 6)}</p>
      <Copy className="w-3 h-3" />
    </div>
  );
};
