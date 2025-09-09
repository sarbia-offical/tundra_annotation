import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  DialogWrapper,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AnnotateForm,
  AnnotateFormRef,
  AnnotateFormValue,
} from "./AnnotateForm";
import { AnnotateList } from "./AnnotateList";
import { ColorPicker } from "./ColorPicker";
import { JumpToCurrentNote } from "./JumpToCurrentNote";
import { useTranslation } from "react-i18next";
import { useMarkContext } from "../state/hooks";
import { MarkState } from "../state/type";
import { NoteItem } from "@/services/api.type";
import { useEditAnnotateContextValue } from "../AnnotateDom/EditAnnotationContext";

interface EditAnnotationType {
  open: boolean;
  annotateUid: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  close?: () => void;
  // 删除注释
  handleDelete: () => Promise<boolean> | void;
  // 添加表单数据回调
  onFormSubmit?: (values: AnnotateFormValue) => void;
}

export const EditAnnotation: React.FC<EditAnnotationType> = ({
  open,
  annotateUid,
  setOpen,
  close,
  handleDelete,
  onFormSubmit,
}) => {
  const annotateFormRef = useRef<AnnotateFormRef>(null);
  const [annotationList, setAnnotationList] = useState<NoteItem[]>([]);
  const { t } = useTranslation();
  const markState = useMarkContext((state: MarkState) => ({
    annotations: state.annotations,
    color: state.color,
    changeColor: state.changeColor,
  }));
  const { changeJumpToCurrentNote } = useEditAnnotateContextValue();
  const annotateData = markState.annotations[annotateUid];

  const handleSaveClick = () => {
    if (annotateFormRef.current) {
      annotateFormRef.current.submitForm();
    }
  };

  const handleFormSubmitSuccess = (values: AnnotateFormValue) => {
    if (onFormSubmit) {
      onFormSubmit(values);
      setTimeout(() => {
        changeJumpToCurrentNote(true);
      });
    }
  };

  useEffect(() => {
    if (open && annotateData) {
      const notes = annotateData.data?.notes || [];
      setAnnotationList(notes);
    } else {
      setAnnotationList([]);
      close && close();
    }
  }, [open, annotateData]);

  return (
    <>
      <DialogWrapper open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-labelledby="custom-title-id"
          aria-describedby="custom-description-id"
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle id="custom-title-id">{t("notes")}</DialogTitle>
            <DialogDescription id="custom-description-id">
              {t("editAnnotateTips")}
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <JumpToCurrentNote
              changeVisible={(visible: boolean) => {
                changeJumpToCurrentNote(visible);
              }}
            />
            <AnnotateList notes={annotationList} />
          </div>
          <ColorPicker
            value={markState.color}
            className="p-2"
            onChange={(c) => {
              markState.changeColor(c);
            }}
          />
          <AnnotateForm
            ref={annotateFormRef}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
          <DialogFooter className="justify-between">
            <DialogClose asChild>
              <div className="mt-2 sm:mt-0">
                <Button type="button" className="w-full">
                  {t("cancel")}
                </Button>
              </div>
            </DialogClose>
            <div className="flex flex-col-reverse sm:flex-row">
              <Button
                type="button"
                variant="destructive"
                className="w-full mt-2 sm:mt-0"
                onClick={() => {
                  handleDelete();
                }}
              >
                {t("deleteAnnotate")}
              </Button>
              <Button
                type="button"
                variant="success"
                className="w-full sm:ml-2"
                onClick={handleSaveClick}
              >
                {t("save")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogWrapper>
    </>
  );
};
