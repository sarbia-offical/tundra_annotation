import { Devices } from "@/constant/options";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

/**
 * 检测屏幕尺寸
 * @returns "mobile" | "tablet" | "desktop"
 */
export function useGetScreenSize(
  defaultDevice?: Devices
): [Devices, Dispatch<SetStateAction<Devices>>] {
  const [screenSize, setScreenSize] = useState<Devices>(
    defaultDevice || "desktop"
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize(); // 初始化时执行一次
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [screenSize, setScreenSize];
}
