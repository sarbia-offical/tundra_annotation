import React from "react";

export interface VirtualListProps<T> {
  data: T[];
  height: number;
  overscan: number;
  estimatedItemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface VirtualListRef extends HTMLDivElement {}

export type offsets = number[];
export type totalHeight = number;
export interface computeOffsetsType {
  offsets: offsets;
  totalHeight: totalHeight;
}

export interface visibleRangeType {
  start: number;
  end: number;
}

export interface VirtualListContextValue<T> extends VirtualListProps<T> {
  totalHeight: number;
  offsets: number[];
  childHeightRef: React.RefObject<Map<number, number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  version: number;
  range: visibleRangeType;
  setRange: React.Dispatch<React.SetStateAction<visibleRangeType>>;
  attachRef: (index: number) => (node: HTMLDivElement | null) => void;
  computeOffsets: () => computeOffsetsType;
  findFirstStart: (scroll: number) => number;
  getVisibleRange: (scroll: number) => visibleRangeType;
}
