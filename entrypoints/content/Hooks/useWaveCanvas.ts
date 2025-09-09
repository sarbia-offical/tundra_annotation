export const useWaveCanvas = () => {
  const drawWavyLine = (
    element: HTMLElement,
    color: string,
    uid: string,
    text: string
  ) => {
    const className = `.wave-canvas-${uid}`;
    const existingCanvas = element.querySelector(className);
    if (existingCanvas) {
      existingCanvas.remove();
    }
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = 6; // 波浪线高度

    const canvas = document.createElement("canvas");
    canvas.classList.add(`wave-canvas`);
    canvas.classList.add(`wave-canvas-${uid}`);
    canvas.style.width = `${width}px`;
    Object.assign(canvas.style, {
      position: "absolute",
      top: "95%",
      left: "0",
      width: `${width}px`,
      height: `${height}px`,
      pointerEvents: "none",
    });
    // 设置canvas尺寸
    canvas.width = width;
    canvas.height = height;
    // 计算波浪线段数
    let segments = Math.min(text.length, 20);
    if (segments < 4) segments = 3;

    // 绘制波浪线
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";

      ctx.beginPath();
      const amplitude = 3;
      const step = width / segments;
      const baseY = height / 2;

      ctx.moveTo(0, baseY);
      for (let i = 1; i <= segments; i++) {
        const x = step * i;
        const cpX = x - step / 2;
        const cpY = baseY + (i % 2 === 0 ? -amplitude : amplitude);
        ctx.quadraticCurveTo(cpX, cpY, x, baseY);
      }
      ctx.stroke();
    }
    element.appendChild(canvas);
  };
  return { drawWavyLine };
};
