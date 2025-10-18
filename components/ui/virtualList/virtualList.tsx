import React from "react";
import { VirtualListProps, VirtualListRef } from "./virtualList.type";
import { useVirtualList } from "./virtualList.hook";
import { VirtualListProvider } from "./virtualList.context";
import { VirtualInner } from "./virtualInner";

function VirtualListInnner<T>(
  props: VirtualListProps<T>,
  ref: React.Ref<VirtualListRef>
) {
  const value = useVirtualList(props);
  const { height, containerRef, style } = value;
  return (
    <VirtualListProvider value={value}>
      <div
        ref={containerRef}
        className="relative overflow-auto will-change-transform"
        style={{
          ...style,
          height: height,
        }}
      >
        <VirtualInner />
      </div>
    </VirtualListProvider>
  );
}

const ForwardComponent = React.forwardRef(VirtualListInnner);
ForwardComponent.displayName = "VirtualList";

const VirtualList = ForwardComponent as <T>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListRef> }
) => React.ReactElement | null;

export { VirtualList };
