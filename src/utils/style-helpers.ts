"use client";

/**
 * Get the value of a CSS variable
 * @param name Name of the variable (ie: --name-of-variable)
 * @returns Value set inside of the CSS
 */
export const getVar = (name: string) => {
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(name).trim();
};
