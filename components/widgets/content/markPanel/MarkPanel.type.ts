import React, { PropsWithChildren } from "react";
import { SerializedRange } from "@/lib/Marks/Mark.type";
import { Marker } from "@/lib/Marks/Marker";

/**
 * 组件的参数
 */
export interface MarkPanelProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  markRef: React.RefObject<Marker | null>;
  className?: string;
}

export interface MarkPanelState {
  isOpen: boolean;
}

export interface MarkPanelContextType {
  state: MarkPanelState;
  onClose: () => void;
  markRef: React.RefObject<Marker | null>;
}
