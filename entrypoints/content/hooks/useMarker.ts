import { EventHandler, HighlightPainter } from "@/lib/Marks/Mark.type";
import { Marker } from "@/lib/Marks/Marker";
import React from "react";

type MarkerType = [
  (highlightPainter: HighlightPainter, eventHandler: EventHandler) => Marker
];

export function useMarker(): MarkerType {
  const buildMarker = React.useCallback(
    (highlightPainter: HighlightPainter, eventHandler: EventHandler) => {
      const marker = new Marker({
        rootElement: document.body,
        highlightPainter,
        eventHandler,
      });
      return marker;
    },
    []
  );
  return [buildMarker];
}
