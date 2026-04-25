import type { ForwardedRef, RefObject } from "react";

/**
 * Bind a ref object and a forwarded ref object ot the same node.
 * @param node Node to bind to
 * @param forwardedRef Forwarded ref object to bind
 * @param ref Ref object to bind
 */
export function bindRefAndForwardRef<T>(
  node: T | null,
  forwardedRef: ForwardedRef<T>,
  ref: RefObject<T | null> | RefObject<T>,
) {
  ref.current = node;
  if (forwardedRef) {
    if (typeof forwardedRef === "function") forwardedRef(node);
    else forwardedRef.current = node;
  }
}
