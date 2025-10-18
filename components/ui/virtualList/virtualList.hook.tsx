import React from "react";
import {
  visibleRangeType,
  VirtualListContextValue,
  VirtualListProps,
} from "./virtualList.type";

export const useVirtualList = <T,>(
  props: VirtualListProps<T>
): VirtualListContextValue<T> => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { data, estimatedItemHeight, height, overscan } = props;
  const resizeObserversRef = React.useRef<Map<number, ResizeObserver>>(
    new Map()
  );
  const [version, setVersion] = useState<number>(0);
  const tickingRef = React.useRef<boolean>(false);
  const childHeightRef = React.useRef<Map<number, number>>(new Map());
  const scrollTopRef = React.useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = React.useState<number>(0);

  /**
   * 获取总高度，每个元素的偏移值
   */
  const computeOffsets = React.useCallback(() => {
    const length = data.length;
    const offsets = new Array(length);
    let cur = 0;
    for (let i = 0; i < offsets.length; i++) {
      offsets[i] = cur;
      const h = childHeightRef.current.get(i);
      let itemHeight = !!!h ? estimatedItemHeight ?? 0 : h ?? 0;
      cur += itemHeight;
    }
    return {
      offsets,
      totalHeight: cur,
    };
  }, [data.length, estimatedItemHeight]);

  const { offsets, totalHeight } = computeOffsets();

  /**
   * 根据scroll高度寻找指定的偏移下标
   */
  const findFirstStart = React.useCallback(
    (scroll: number) => {
      let start = 0;
      let end = data.length - 1;
      while (start < end) {
        let mid = Math.floor((start + end) / 2);
        const h = childHeightRef.current.get(mid) ?? estimatedItemHeight;
        const currentHeight = offsets[mid];
        if (currentHeight <= scroll && currentHeight + h > scroll) {
          return mid;
        }
        if (currentHeight > scroll) {
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }
      return Math.max(0, Math.min(data.length - 1, start));
    },
    [data.length, offsets, estimatedItemHeight]
  );

  /**
   * 获取虚拟列表的开始和结束范围
   */
  const getVisibleRange = React.useCallback(
    (scroll: number) => {
      const startIndex = findFirstStart(scroll);
      let endIndex = startIndex;
      let currentHeight = offsets[startIndex] ?? 0;
      const endHeight = scroll + height;
      while (endIndex < data.length && currentHeight < endHeight) {
        const h = childHeightRef.current.get(endIndex) ?? estimatedItemHeight;
        currentHeight += h;
        endIndex++;
      }
      return {
        start: Math.max(0, startIndex - overscan),
        end: Math.min(data.length - 1, endIndex + overscan),
      };
    },
    [data.length, findFirstStart, height]
  );

  // 初始化虚拟列表范围
  const [range, setRange] = useState<visibleRangeType>(() =>
    getVisibleRange(0)
  );

  /**
   * 获取元素的真实高度，并且设置进childHeightRef中，触发重渲染，重新设置子元素的top偏移值
   * 开启动态高度监听
   */
  const attachRef = React.useCallback(
    (index: number) => (node: HTMLDivElement | null) => {
      if (!node) {
        resizeObserversRef.current.get(index)?.disconnect();
        resizeObserversRef.current.delete(index);
        return;
      }
      const calculateheight = () => {
        const rect = node.getBoundingClientRect();
        const height = Math.round(rect.height);
        const prev = childHeightRef.current.get(index);
        if (prev !== height) {
          childHeightRef.current.set(index, height);
          setVersion((v) => v + 1);
        }
      };
      calculateheight();
      if (typeof ResizeObserver !== "undefined") {
        let ro = resizeObserversRef.current.get(index);
        if (!ro) {
          const ro = new ResizeObserver(() => calculateheight());
          resizeObserversRef.current.set(index, ro);
          ro.observe(node);
        }
      }
    },
    []
  );

  /**
   * 监听高度变化，
   */
  useEffect(() => {
    const visibleRange = getVisibleRange(scrollTop);
    if (range.start !== visibleRange.start && range.end !== visibleRange.end) {
      setRange(visibleRange);
    }
  }, [scrollTop, range, setRange, getVisibleRange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const onScroll = () => {
      scrollTopRef.current = el.scrollTop;
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafRef.current = requestAnimationFrame(() => {
          tickingRef.current = false;
          setScrollTop(scrollTopRef.current);
        });
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef?.current || 0);
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      ...props,
      offsets,
      totalHeight,
      childHeightRef,
      containerRef,
      version,
      range,
      setRange,
      computeOffsets,
      findFirstStart,
      getVisibleRange,
      attachRef,
    }),
    [
      data,
      offsets,
      totalHeight,
      range,
      height,
      overscan,
      estimatedItemHeight,
      version,
    ]
  );

  return contextValue;
};
