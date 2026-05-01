import { DependencyList, useCallback, useEffect } from "react";

/**
 * Repeatedly run a callback until successful.
 * @param callback Callback to run. Returns `true` when successful, otherwise `false`.
 * @param retryIn Milliseconds to wait before retrying
 * @param deps If present, effect will only activate if the values in the list change.
 */
export function useRetryEffect(
  callback: () => Promise<boolean>,
  retryIn: number,
  deps: DependencyList = [],
  label?: string,
) {
  // Run hook
  useEffect(() => {
    let id: NodeJS.Timeout | undefined = undefined;
    const update = async () => {
      const data = await callback();
      if (data) {
        id = undefined;
        return;
      }
      if (label) console.warn(`⚠️ RetryEffect-"${label}" failed. Retrying in ${retryIn}ms...`);
      id = setTimeout(async () => {
        if (label) console.log(`🔄 Retrying RetryEffect-"${label}"...`);
        await update();
      }, retryIn);
    };
    update();

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, deps);
}
