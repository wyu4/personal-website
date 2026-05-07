"use client";

import { RefObject, useRef } from "react";

/**
 * Continously check if an element is in view
 * @param callback Callback to run when element is in view
 * @param container Container to track
 * @param threshold Percent of container (in decimal form) required to be visible before triggerring callback (defaults to 0.1)
 * @returns Array of functions related to hook. The first function creates the observer, the second function clears the observer and can be used for cleanup
 */
export function useIsInView(
  callback: (isInView: boolean) => void,
  container: RefObject<HTMLElement | null>,
  threshold: number = 0.1,
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const create = () => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          callback(entry.isIntersecting);
        },
        { threshold: threshold },
      );
    }

    if (container.current) observer.current.observe(container.current);
  };
  const cleanup = () => {
    observer.current?.disconnect();
    observer.current = null;
  };
  return [create, cleanup];
}
