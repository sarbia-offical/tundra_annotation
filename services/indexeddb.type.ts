import { NoteItem, Annotate } from "./api.type";

// IndexedDB相关类型定义
export interface DBPageData {
  id?: number;
  url: string;
  title: string;
  host: string;
  createDate: number;
  updateDate?: number;
}

export interface DBNote extends NoteItem {
  id?: number;
  annotationId: string; // 关联的标注ID
  createDate: number;
  updateDate?: number;
}

export interface DBAnnotation {
  id?: number;
  uid: string; // 唯一标识符
  textBefore: string;
  text: string;
  textAfter: string;
  pageDataId: number; // 关联的页面数据ID
  startContainerPath: string[];
  endContainerPath: string[];
  startOffset: number;
  endOffset: number;
  color: string;
  createDate: number;
  updateDate?: number;
}

// 完整的标注信息（包含关联的笔记和页面数据）
export interface FullAnnotation extends Omit<DBAnnotation, "pageDataId"> {
  notes: DBNote[];
  pageData: DBPageData;
}

// IndexedDB配置
export interface DBConfig {
  name: string;
  version: number;
  stores: {
    [key: string]: {
      keyPath: string;
      indexes?: { [key: string]: string | string[] };
    };
  };
}

// 数据库操作结果
export interface DBResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
