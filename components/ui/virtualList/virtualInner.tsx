import React from "react";
import { useVirtualListContext } from "./virtualList.context";

const VirtualInner: React.FC = () => {
  const { version, range, data, offsets, totalHeight, renderItem, attachRef } =
    useVirtualListContext();
  const childElementsRef = React.useRef<React.ReactNode[]>([]);
  const prevDeps = React.useRef({
    start: -1,
    end: -1,
    dataLength: -1,
    version: 0,
  });
  if (
    prevDeps.current.start !== range.start ||
    prevDeps.current.end !== range.end ||
    prevDeps.current.dataLength !== data.length ||
    prevDeps.current.version !== version
  ) {
    childElementsRef.current = [];
    for (let i = range.start; i <= range.end; i++) {
      if (i < 0 || i >= data.length) continue;
      const top = offsets[i] ?? 0;
      childElementsRef.current.push(
        <div
          key={i}
          style={{
            position: "absolute",
            top,
            width: "100%",
            boxSizing: "border-box",
          }}
          ref={attachRef(i)}
        >
          {renderItem(data[i], i)}
        </div>
      );
    }
    prevDeps.current = {
      start: range.start,
      end: range.end,
      dataLength: data.length,
      version,
    };
  }
  return (
    <div
      style={{
        height: totalHeight,
        position: "relative",
      }}
    >
      {childElementsRef.current}
    </div>
  );
};
VirtualInner.displayName = "VirtualInner";
export { VirtualInner };
