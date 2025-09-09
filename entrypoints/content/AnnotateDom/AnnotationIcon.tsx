import { Annotate } from "@/services/api.type";
import { MessageCircleMoreIcon } from "lucide-react";
import React from "react";

interface AnnotationIconProps {
  color: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  value: Annotate;
}

export const AnnotationIcon: React.FC<AnnotationIconProps> = ({
  color,
  onClick,
  value,
}) => {
  const { uid } = value;
  const handleHover = (enter: boolean) => {
    const elements = document.querySelectorAll(`[highlight-id="${uid}"]`);
    if (elements.length === 0) {
      return;
    }
    elements.forEach((ele) => {
      const el = ele as HTMLElement;
      if (enter) {
        const bgColor = getComputedStyle(el).getPropertyValue("--bg").trim();
        if (bgColor) {
          Object.assign(el.style, {
            color: bgColor,
          });
        }
      } else {
        Object.assign(el.style, {
          color: "",
          fontWeight: "",
        });
      }
    });
  };
  return (
    <div
      className="annotationIcon"
      onClick={onClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      style={{ "--icon-color": color } as React.CSSProperties}
    >
      <div className="icon">
        <MessageCircleMoreIcon size={16} className="icon" strokeWidth={1.5} />
        <div className="comments">{value?.data?.notes?.length || 0}</div>
      </div>
    </div>
  );
};
