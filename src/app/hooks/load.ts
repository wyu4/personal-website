import { useEffect, useState } from "react";

/**
 * Return a stateful boolean representing whether or not the fonts have been loaded.
 * @returns `true` if loaded, else `false`
 */
export function useFontsLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setLoaded(true));
  }, []);

  return loaded;
}
