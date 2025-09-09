import { NotesProps } from "@/services/api.type";

export interface PopoverType {
  x: number;
  y: number;
}

export type AnnotationType = Record<string, Record<string, any>>;

export interface Mark {
  popoverPos: PopoverType;
  popoverVisible: boolean;
  color: string;
  annotations: Record<string, any>;
  currentAnnotation: string;
}

export interface MarkActions {
  changePopoverPos: (value: PopoverType) => void;
  changePopoverVisible: (value: boolean) => void;
  changeColor: (value: string) => void;
  changeAnnotations: (
    id: string,
    value?: Record<string, any> | null | undefined
  ) => void;
  initAllAnnotations: (annotations: Record<string, any>) => void;
  changeCurrentAnnotation: (id: string) => void;
}

export type MarkState = Mark & MarkActions;
