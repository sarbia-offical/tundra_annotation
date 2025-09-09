import { HighlightTagName } from "@/lib/Marks/Marker.type";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

export const useScrollToAnnotation = () => {
  const scrollToAnnotation = (id?: string) => {
    let annotationId: string = id || "";
    if (!id) {
      const searchParams = new URLSearchParams(window.location.search);
      annotationId = searchParams.get("annotateId") || "";
      if (!annotationId) {
        return;
      }
    }

    const element = Array.from(
      document.getElementsByTagName(HighlightTagName)
    ).find((ele) => ele.getAttribute("highlight-id") === annotationId);

    if (!element) {
      return;
    }
    // 延迟滚动，确保页面已经渲染完成
    setTimeout(() => {
      // 获取元素的位置信息，并计算出平滑滚动的目标位置
      const rect = element.getBoundingClientRect();
      if (rect.top === 0) {
        console.warn("Element is not visible in the viewport.");
        return;
      }
      // 滚动到该元素的位置，减去偏移量 100px
      const targetY = rect.top + window.scrollY - 100;
      gsap.to(window, {
        duration: 0.3,
        scrollTo: { y: targetY },
        ease: "none",
      });
    }, 0); // 立即执行，但确保 DOM 完成渲染
  };

  return { scrollToAnnotation };
};
