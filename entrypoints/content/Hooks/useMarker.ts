import Marker from "@/lib/Marks/Marker";
import { HighlightPainter, EventHandler } from "@/lib/Marks/Marker.type";
import { Annotate } from "@/services/api.type";
import { useState } from "react";

type UseMarkerType = [
  Marker | undefined,
  (eventHandler: EventHandler, highlightPainter: HighlightPainter) => Marker
];

export function useMarker(): UseMarkerType {
  const [markerInstance, setMarkerInstance] = useState<Marker | undefined>();
  const startMarker = (
    eventHandler: EventHandler,
    highlightPainter: HighlightPainter
  ): Marker => {
    const marker = new Marker({
      rootElement: document.body,
      eventHandler,
      highlightPainter,
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
