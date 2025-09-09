import React, { useEffect, useRef } from "react";
import { NoteItem } from "@/services/api.type";
import { AnnotationItem } from "./AnnotationItem";
import { useTranslation } from "react-i18next";
import { useEditAnnotateContextValue } from "./EditAnnotationContext";
import { isEmpty } from "lodash";

interface AnnotateListProps {
  notes: NoteItem[];
}

export const AnnotateList: React.FC<AnnotateListProps> = ({ notes }) => {
  const { jumpToCurrentNote, changeJumpToCurrentNote } =
    useEditAnnotateContextValue();
  const listRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (jumpToCurrentNote && listRef.current) {
      const container = listRef.current;
      container.scrollTop = container.scrollHeight;
      changeJumpToCurrentNote(false);
    }
  }, [jumpToCurrentNote]);

  return (
    <div
      ref={listRef}
      className="relative max-h-[450px] overflow-y-scroll scrollbar-hide"
    >
      {!isEmpty(notes) ? (
        notes.map((ele, index) => <AnnotationItem key={index} note={ele} />)
      ) : (
        <div className="text-muted-foreground text-center italic">
          {t("noMoreNotes")}
        </div>
      )}
    </div>
  );
};
