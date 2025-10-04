import { SelectionObserver } from "@/lib/SelectionObserver";

export function useSelection(): [() => void] {
  const startObserver = () => {
    new SelectionObserver((range: Range | null) => {
      console.log("range", range);
    });
  };
  return [startObserver];
}
