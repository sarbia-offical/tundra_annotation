export interface APIResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface APIRequest<T> {
  basicType: string;
  messageType: string;
  params?: T;
}

export interface NoteItem {
  userId: string;
  userName: string;
  text: string;
  date: number;
  isMe: boolean;
}

export interface NotesProps {
  notes?: NoteItem[];
}

export interface Annotate {
  uid: string;
  data: Record<string, any> & NotesProps;
  textBefore: string;
  text: string;
  textAfter: string;
  pageData: Record<string, any>;
  startContainerPath: string[];
  endContainerPath: string[];
  startOffset: number;
  endOffset: number;
  color: string;
  createDate: number;
  updateDate?: number;
}
