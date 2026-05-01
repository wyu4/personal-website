import { DependencyList, useEffect } from "react";

/**
 * Dynamically receive the window's inner dimensions
 * @param callback Callback to receive window width and height, that can return a cleanup function
 * @param deps If present, effect will also activate if the values in the list change.
 */
export function useInnerWindowEffect(
  callback: (w: number, h: number) => CleanupFunction,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const runCallback = () => {
      return callback(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", runCallback);
    window.addEventListener("load", runCallback);
    const cleanup = runCallback();

    return () => {
      window.removeEventListener("resize", runCallback);
      window.removeEventListener("load", runCallback);
      cleanup?.();
    };
  }, deps);
}
