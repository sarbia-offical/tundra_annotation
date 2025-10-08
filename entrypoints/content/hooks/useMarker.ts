import { EventHandler, HighlightPainter } from "@/lib/Marks/Mark.type";
import { Marker } from "@/lib/Marks/Marker";

type MarkerType = [
  Marker | undefined,
  (highlightPainter: HighlightPainter, eventHandler: EventHandler) => Marker
];

export function useMarker(): MarkerType {
  const [markerInstance, setMarkerInstance] = useState<Marker | undefined>();
  const buildMarker = (
    highlightPainter: HighlightPainter,
    eventHandler: EventHandler
  ) => {
    const marker = new Marker({
      rootElement: document.body,
      highlightPainter,
      eventHandler,
    });
    setMarkerInstance(marker);
    return marker;
  };
  return [markerInstance, buildMarker];
}
