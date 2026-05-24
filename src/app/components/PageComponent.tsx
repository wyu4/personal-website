"use client";

import { useEffect, useRef } from "react";
import Bio from "./bio/bio";
import Banner from "./title/banner";
import TopBar from "./top/top-bar";
import { useTypingSecret } from "../hooks/misc";
import { getCookie, setCookie } from "cookies-next/client";
import TechStack from "./stack/tech-stack";
import Projects from "./projects/projects";
import Footer from "./footer/footer";
import Stats from "./stats/github-stats";

type PageComponentProps = {
  repositories?: Repository[];
  languages?: LanguageMetadata[];
  projectsMaintenance: boolean;
};

const THEME_INDEX = ["None", "Pink", "Pretty", "Dark"] as const;
type ThemeType = (typeof THEME_INDEX)[number];

/**
 * The main component that is fed to the client.
 */
export default function PageComponent({
  repositories,
  languages,
  projectsMaintenance,
}: PageComponentProps) {
  const theme = useRef<ThemeType>("None");
  const setTheme = (newTheme: ThemeType) => {
    setCookie("user_theme", newTheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
    theme.current = newTheme;
  };
  const getTheme = (): ThemeType => {
    const value = getCookie("user_theme") as ThemeType | undefined;
    if (!value || !THEME_INDEX.includes(value)) {
      return "None";
    }
    return value;
  };

  const toggleTheme = (desiredTheme: ThemeType) => {
    const currentCssClass = `${theme.current.toLowerCase()}-mode`;
    const cssClass = `${desiredTheme.toLowerCase()}-mode`;
    if (theme.current !== "None" || desiredTheme === "None") {
      document.documentElement.classList.remove(currentCssClass);
      if (desiredTheme === theme.current) {
        setTheme("None");
        return;
      }
    }
    document.documentElement.classList.add(cssClass);
    setTheme(desiredTheme);
  };
  for (const secret of THEME_INDEX) {
    if (secret === "None") continue;
    useTypingSecret(secret, () => toggleTheme(secret));
  }

  useEffect(() => toggleTheme(getTheme()), []);

  return (
    <>
      <TopBar />
      <Banner repositories={repositories} />
      <Bio />
      <Stats languages={languages} />
      <TechStack />
      <Projects maintenance={projectsMaintenance} />
      <Footer />
    </>
  );
}
