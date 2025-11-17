import { EventHandler, HighlightPainter } from "@/lib/Marks/Mark.type";
import { Marker } from "@/lib/Marks/Marker";

type MarkerType = [
  (highlightPainter: HighlightPainter, eventHandler: EventHandler) => Marker
];

export function useMarker(): MarkerType {
  const buildMarker = useCallback(
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
