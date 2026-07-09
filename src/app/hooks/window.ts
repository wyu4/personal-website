import { DependencyList, useEffect } from "react";

/**
 * Dynamically receive the window's inner dimensions and scroll position
 * @param callback Callback to receive window width height, and scroll position, that can return a cleanup function
 * @param deps If present, effect will also activate if the values in the list change.
 * @param mode Optional parameter to limit the callback running only when the window scrolls or resizes. Leave empty for both.
 */
export function useInnerWindowEffect(
  callback: (w: number, h: number, x: number, y: number) => CleanupFunction,
  deps: DependencyList = [],
  mode: "SCREEN" | "SCROLL" | "BOTH" = "BOTH",
) {
  useEffect(
    () => {
      const runCallback = () => {
        return callback(
          window.innerWidth,
          window.innerHeight,
          window.scrollX,
          window.scrollY,
        );
      };

      if (mode === "SCREEN" || mode === "BOTH") {
        window.addEventListener("resize", runCallback);
      }
      if (mode === "SCROLL" || mode === "BOTH") {
        window.addEventListener("scroll", runCallback);
      }

      window.addEventListener("load", runCallback);
      const cleanup = runCallback();

      return () => {
        window.removeEventListener("resize", runCallback);
        window.removeEventListener("scroll", runCallback);
        window.removeEventListener("load", runCallback);
        cleanup?.();
      };
    },
    deps.concat([mode]),
  );
}
