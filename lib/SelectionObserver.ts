export class SelectionObserver {
  private _callback: (range: Range | null) => void;
  private _document: Document;
  private _pendingCallback: number | null = null;
  private _eventHandler: (event: Event) => void;
  private _cancelPendingCallback() {
    if (this._pendingCallback !== null) {
      clearTimeout(this._pendingCallback);
      this._pendingCallback = null;
    }
  }
  /**
   * 获取文档选区
   * @param document
   * @returns
   */
  private _selectedRangeCallback(document: Document): Range | null {
    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return null;
    }
    return range;
  }
  constructor(
    callback: (range: Range | null) => void,
    observedNode?: Document
  ) {
    this._callback = callback;
    this._document = observedNode || document;
    let isMouseDown = false;
    let events = ["mousedown", "mouseup", "selectionchange"];
    const scheduleCallback = (delay = 10) => {
      this._cancelPendingCallback();
      this._pendingCallback = window.setTimeout(() => {
        this._callback(this._selectedRangeCallback(this._document));
      }, delay);
    };
    this._eventHandler = (event: Event) => {
      if (event.type === "mousedown") {
        isMouseDown = true;
      }
      if (event.type === "mouseup") {
        isMouseDown = false;
      }
      if (isMouseDown) return;
      this._cancelPendingCallback();
      const delay = event.type === "mouseup" ? 10 : 100;
      scheduleCallback(delay);
    };
    for (const event of events) {
      this._document.addEventListener(event, this._eventHandler);
    }
  }
}
