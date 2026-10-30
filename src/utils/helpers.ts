import type { ForwardedRef, RefObject } from "react";

/**
 * Get the value of a CSS variable
 * @param name Name of the variable (ie: --name-of-variable)
 * @returns Value set inside of the CSS
 */
export const getVar = (name: string) => {
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(name).trim();
};

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

/**
 * Limit text length by truncating excess and appending `'...'`
 * @param text Original text
 * @param characterLimit Character limit
 * @returns New truncated text
 */
export function limitText(text: string, characterLimit: number) {
  if (characterLimit < 0 || text.length <= characterLimit) return text;
  return text.substring(0, characterLimit) + "...";
}

/**
 * Formulate a time difference given the magnitude and the unit of the time elapsed
 * @param n Magnitude
 * @param unit Time unit
 * @returns Formulated string
 */
export const formulateTimeElapse = (n: number, unit: string) =>
  `${n} ${unit}${n > 1 ? "s" : ""} ago`;

/**
 * Calculate the time difference fiven the deltatime in milliseconds
 * @param deltaMillis Deltatime
 * @returns Formulated string
 */
export function calculateTimeElapse(deltaMillis: number) {
  const seconds = Math.floor(deltaMillis / 1000);
  if (seconds <= 0) {
    return "now";
  } else if (seconds < 60) {
    return formulateTimeElapse(seconds, "second");
  } else if (seconds < 60 * 60) {
    return formulateTimeElapse(Math.floor(seconds / 60), "minute");
  } else if (seconds < 60 * 60 * 24) {
    return formulateTimeElapse(Math.floor(seconds / 60 / 60), "hour");
  } else if (seconds < 60 * 60 * 24 * 7) {
    return formulateTimeElapse(Math.floor(seconds / 60 / 60 / 24), "day");
  } else if (seconds < 60 * 60 * 24 * 30) {
    return formulateTimeElapse(Math.floor(seconds / 60 / 60 / 24 / 7), "week");
  } else if (seconds < 60 * 60 * 24 * 365) {
    return formulateTimeElapse(Math.floor(seconds / 60 / 60 / 24 / 30), "month");
  } else {
    return formulateTimeElapse(Math.floor(seconds / 60 / 60 / 24 / 365), "year");
  }
}

/**
 * Convert a date to a human readable string
 * @param date Date object
 * @returns Readable date
 */
export function convertDateToReadable(date: Date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
