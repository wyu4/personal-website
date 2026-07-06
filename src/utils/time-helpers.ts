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