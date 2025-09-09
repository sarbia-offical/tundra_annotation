import React from "react";
import { Annotate } from "@/services/api.type";
import { useScrollToAnnotation } from "../Hooks/useScrollToAnnotation";
import { ZoomInIcon } from "lucide-react";

interface AnnotationIconProps {
  value: Annotate;
  className?: string;
}

export const AnnotationIcon: React.FC<AnnotationIconProps> = ({
  value,
  className,
}) => {
  const { scrollToAnnotation } = useScrollToAnnotation();
  return (
    <div
      className={`w-10 h-10 flex justify-center items-center rounded-full shadow-lg cursor-pointer hover:animate-wobble origin-bottom ${className}`}
      style={{
        background: `${value.color}`,
      }}
      onClick={() => {
        scrollToAnnotation(value.uid);
      }}
    >
      <ZoomInIcon
        color={"#ffffff"}
        width={"60%"}
        height={"60%"}
        className="transition-all active:scale-90 duration-75"
      />
    </div>
  );
};
