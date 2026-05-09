import { useEffect, useRef, useState } from "react";

/**
 * Miscellanious hook that runs a callback when a user types a secret keyword using a keyboard
 * @param secret Keyword to track
 * @param callback Callback to run
 */
export function useTypingSecret(secret: string, callback: () => void) {
  const loweredSecret = secret.toLowerCase();
  const keysPressed = useRef("");

  useEffect(() => {
    const onKeyPressed = (ev: KeyboardEvent) => {
      const target = ev.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      const character = ev.key.toLowerCase();
      if (character.length === 1) {
        keysPressed.current += character;
        keysPressed.current = keysPressed.current.slice(-loweredSecret.length);

        if (keysPressed.current === loweredSecret) callback();
      }
    };
    window.addEventListener("keydown", onKeyPressed);

    return () => window.removeEventListener("keydown", onKeyPressed);
  }, []);
}

/**
 * Returns a stateful value representing the classes of the `:root` element.
 */
export function useRootClass() {
  const [themeClass, setThemeClass] = useState("");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeClass(document.documentElement.className);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return themeClass;
}
