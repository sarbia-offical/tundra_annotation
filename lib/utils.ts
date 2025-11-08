import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { cancelTruncation, HighlightClassName } from "./Marks/Mark.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonParse<T = any>(value?: string): T {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new Error(`Cannot safe json parse value of type ${typeof value}`);
  }
  try {
    return JSON.parse(value);
  } catch {
    return {} as T;
  }
}

export function safeJsonStringify(value: any): string {
  return typeof value === "string"
    ? value
    : JSON.stringify(value, (key: string, value: any) =>
        typeof value === "undefined" ? null : value
      );
}

export function makeid(length = 64): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = [];
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

export function generateUUID() {
  return uuidv4();
}

/**
 * 高亮样式，波浪线加背景色
 * @param element
 * @param bgc
 */
export function applyHighlightStyle(
  element: HTMLElement,
  bgc: string,
  bgImage: `url("${string}")`
) {
  element.parentElement?.classList.add(`${cancelTruncation}`);
  element.classList.add(`${HighlightClassName}`);
  element.style.setProperty("--underline-bg", bgImage);
  element.style.setProperty("--bg", bgc);
  Object.assign(element.style, {
    backgroundColor: `${bgc}55`,
  });
}

export function createWavyLines(color: string): `url("${string}")` {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 4'>
    <path fill='none' stroke='${color}' stroke-width='1.5'
      d='M0,3.5 c 5,0,5,-3,10,-3 s 5,3,10,3 c 5,0,5,-3,10,-3 s 5,3,10,3' />
  </svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `url("data:image/svg+xml,${encoded}")`;
}

export const isMobileOrTablet = (function () {
  let check = false;
  (function (a) {
    // 移动设备检测正则表达式
    const MOBILE_REGEX =
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (?:ce|phone)|xda|xiino|android|ipad|playbook|silk/i;
    // 设备前缀检测正则表达式
    const DEVICE_PREFIX_REGEX =
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

    if (typeof window === "undefined" || !navigator) {
      return false;
    }
    check = MOBILE_REGEX.test(a) || DEVICE_PREFIX_REGEX.test(a.substring(0, 4));
  })(navigator.userAgent || navigator.vendor);
  return check;
})();

/**
 * 防抖函数 - 延迟执行，只执行最后一次
 * @param func 要防抖的函数
 * @param wait 延迟时间（毫秒）
 * @param options 配置选项
 * @returns 防抖后的函数
 *
 * @example
 * const debouncedSearch = debounce((value: string) => {
 *   console.log('搜索:', value);
 * }, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  options?: {
    leading?: boolean; // 是否在延迟开始前调用
    trailing?: boolean; // 是否在延迟结束后调用
    maxWait?: number; // 最大等待时间
  }
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: any[] | undefined;
  let lastThis: any;
  let result: any;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;

  const leading = options?.leading ?? false;
  const trailing = options?.trailing ?? true;
  const maxWait = options?.maxWait;

  function invokeFunc(time: number) {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc: () => void, wait: number) {
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id: ReturnType<typeof setTimeout> | undefined) {
    if (id !== undefined) {
      clearTimeout(id);
    }
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeoutId = startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeoutId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timeoutId = undefined;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    cancelTimer(timeoutId);
    cancelTimer(maxTimeoutId);
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = undefined;
  }

  function flush() {
    return timeoutId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: any[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeoutId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeoutId === undefined) {
      timeoutId = startTimer(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as T & { cancel: () => void; flush: () => void };
}

/**
 * 节流函数 - 限制执行频率，固定时间间隔内只执行一次
 * @param func 要节流的函数
 * @param wait 时间间隔（毫秒）
 * @param options 配置选项
 * @returns 节流后的函数
 *
 * @example
 * const throttledScroll = throttle((event: Event) => {
 *   console.log('滚动事件:', event);
 * }, 200);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  options?: {
    leading?: boolean; // 是否在开始时立即执行
    trailing?: boolean; // 是否在结束时执行
  }
): T & { cancel: () => void; flush: () => void } {
  const leading = options?.leading ?? true;
  const trailing = options?.trailing ?? true;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}
