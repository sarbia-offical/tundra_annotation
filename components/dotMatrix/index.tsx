import React, { useRef, useEffect } from "react";
import gsap from "gsap";

type Dot = {
  x: number;
  y: number;
  radius: number;
  scale: number;
  row: number;
};

export const DotGridCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  // 初始化点阵
  const initDots = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // 设置Canvas尺寸
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // 创建点阵
    const dots: Dot[] = [];
    const spacing = 20; // 点之间的间距
    const radius = 2; // 点的半径

    const cols = Math.floor(rect.width / spacing);
    const rows = Math.floor(rect.height / spacing);

    // 计算边距以居中
    const marginX = (rect.width - (cols - 1) * spacing) / 2;
    const marginY = (rect.height - (rows - 1) * spacing) / 2;

    // 按行组织点
    const rowsArray: Dot[][] = [];

    for (let row = 0; row < rows; row++) {
      const rowDots: Dot[] = [];
      for (let col = 0; col < cols; col++) {
        const dot = {
          x: marginX + col * spacing,
          y: marginY + row * spacing,
          radius,
          scale: 0,
          row,
        };
        dots.push(dot);
        rowDots.push(dot);
      }
      rowsArray.push(rowDots);
    }

    dotsRef.current = dots;
    drawDots(ctx);
    animateDotsAppear(rowsArray, ctx);
  };

  // 点阵逐行出现动画
  const animateDotsAppear = (
    rowsArray: Dot[][],
    ctx: CanvasRenderingContext2D
  ) => {
    // 创建时间线动画
    animationRef.current = gsap.timeline({
      onUpdate: () => drawDots(ctx), // 动画更新时重绘画布
    });

    // 为每一行添加动画
    rowsArray.forEach((rowDots, rowIndex) => {
      animationRef.current?.to(
        rowDots,
        {
          scale: 1, // 目标缩放值
          duration: 0.2, // 动画持续时间
          ease: "bounce.out", // 缓动函数
          stagger: 0.03, // 点与点之间的延迟
        },
        rowIndex * 0.08
      ); // 行与行之间的延迟
    });
  };

  // 绘制点阵
  const drawDots = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    dotsRef.current.forEach((dot) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius * dot.scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 100, 100, 0.3)`;
      ctx.fill();
    });
  };

  useEffect(() => {
    initDots();
    window.addEventListener("resize", initDots);

    return () => {
      window.removeEventListener("resize", initDots);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[-100]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default DotGridCanvas;
