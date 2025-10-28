import Marker from "@/lib/Marks/Marker";
import { HighlightPainter, EventHandler } from "@/lib/Marks/Marker.type";
import { Annotate } from "@/services/api.type";
import { useState } from "react";

type UseMarkerType = [
  Marker | undefined,
  (highlightPainter: HighlightPainter, eventHandler: EventHandler) => Marker
];

export function useMarker(): UseMarkerType {
  const [markerInstance, setMarkerInstance] = useState<Marker | undefined>();
  const startMarker = (
    highlightPainter: HighlightPainter,
    eventHandler: EventHandler
  ): Marker => {
    const marker = new Marker({
      rootElement: document.body,
      highlightPainter,
      eventHandler,
    });
    setMarkerInstance(marker);
    return marker;
  };
  return [markerInstance, startMarker];
}

export function convertAnnotationToSerializedRange(
  annotation: Annotate
): Record<string, any> {
  return {
    uid: annotation.uid,
    text: annotation.text,
    textBefore: annotation.textBefore,
    textAfter: annotation.textAfter,
  };
}
