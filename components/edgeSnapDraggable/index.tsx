import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/all";
gsap.registerPlugin(Draggable);

interface EdgeSnapDraggableProps {
  children: React.ReactNode;
  snapThreshold?: number;
  dragHandle?: boolean;
  className?: string;
}

export const EdgeSnapDraggable: React.FC<EdgeSnapDraggableProps> = ({
  children,
  snapThreshold = 50,
  dragHandle = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggableInstance = useRef<Draggable | null>(null);
  useEffect(() => {
    draggableInstance.current = new Draggable(containerRef.current, {
      type: "x,y",
      bounds: window,
      edgeResistance: 0.2,
      inertia: true,
      onDragEnd: function () {
        snapToEdge();
      },
    });

    return () => {
      if (draggableInstance.current) {
        draggableInstance.current.kill();
        draggableInstance.current = null;
      }
    };
  }, []);

  /**
   * 判断是否需要吸附到侧边
   * @returns
   */
  const snapToEdge = () => {
    if (!containerRef.current || !draggableInstance.current) return;

    const box = containerRef.current.getBoundingClientRect();
    const x = draggableInstance.current.x;
    const boxWidth = box.width;
    const viewportWidth = window.innerWidth;

    // 根据元素宽度判断中心位置
    const boxCenterX = x + boxWidth / 2;
    const isLeftEdge = boxCenterX < viewportWidth / 2 ? true : false;
    const targetX =
      boxCenterX < viewportWidth / 2 ? 0 : viewportWidth - boxWidth;
    let sommths = {
      duration: 0.3,
      ease: "power2.out",
      x: isLeftEdge ? 0 : `${viewportWidth - (boxWidth + 15)}px`,
    };
    gsap.to(containerRef.current, sommths);
  };
  return (
    <div
      className={`fixed top-1/2 h-[500px] w-[300px] transform left-0 -translate-y-1/2 cursor-grab ${
        dragHandle ? "cursor-grabbing" : ""
      } transition-shadow duration-200 z-50 ${className}`}
      ref={containerRef}
      style={{ touchAction: "none" }}
    >
      {children}
    </div>
  );
};
