import { Annotate } from "@/services/api.type";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CircleEllipsisIcon, Delete, Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useScrollToAnnotation } from "../Hooks/useScrollToAnnotation";
import { useAnnotateContext } from "../App/AppContext";

interface AnnotationSettingProps {
  value: Annotate;
  className?: string;
}

export const AnnotationSetting: React.FC<AnnotationSettingProps> = ({
  value,
  className,
}) => {
  const { t } = useTranslation();
  const { scrollToAnnotation } = useScrollToAnnotation();
  const { openEditor } = useAnnotateContext();
  const shadowRoot = document.querySelector("dolphin-memory")?.shadowRoot;
  const handleEditAnnotation = () => {
    scrollToAnnotation(value.uid);
    openEditor(value.uid);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={`absolute right-0 top-0 ${className || ""}`}>
          <CircleEllipsisIcon className="w-4 h-4 text-gray-400 cursor-pointer transition-all active:scale-90 duration-75" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        sticky="always"
        collisionBoundary={
          shadowRoot ? shadowRoot.querySelector(".annotationItem") : null
        }
      >
        <div className="flex items-center justify-around w-44">
          <Button
            variant="outline"
            size={"mini"}
            onClick={() => {
              handleEditAnnotation();
            }}
          >
            {t("edit")}
            <Edit className="w-3 h-3 ml-1" />
          </Button>
          <Button
            variant="destructive"
            size={"mini"}
            onClick={() => {
              console.log("delete");
            }}
          >
            {t("delete")}
            <Delete className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
