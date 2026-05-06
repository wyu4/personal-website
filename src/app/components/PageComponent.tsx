"use client";

import { useEffect, useRef } from "react";
import Bio from "./bio/bio";
import Banner from "./title/banner";
import TopBar from "./top/top-bar";
import { useTypingSecret } from "../hooks/misc";

type PageComponentProps = {
  repositories?: Repository[];
};

type Theme = "None" | "Pink" | "Pretty";

/**
 * The main component that is fed to the client.
 */
export default function PageComponent({ repositories }: PageComponentProps) {
  const theme = useRef<Theme>("None");

  const toggleTheme = (desiredTheme: Theme) => {
    const currentCssClass = `${theme.current.toLowerCase()}-mode`;
    const cssClass = `${desiredTheme.toLowerCase()}-mode`;
    if (theme.current !== "None") {
      document.documentElement.classList.remove(currentCssClass);
      if (desiredTheme === theme.current) {
        theme.current = "None";
        return;
      }
    }
    document.documentElement.classList.add(cssClass);
    theme.current = desiredTheme;
  };
  useTypingSecret("pink", () => toggleTheme("Pink"));
  useTypingSecret("pretty", () => toggleTheme("Pretty"));

  return (
    <>
      <TopBar />
      <Banner repositories={repositories} />
      <Bio />
    </>
  );
}
