"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { SpamBackground } from "../reusable/backgrounds";

gsap.registerPlugin(ScrollTrigger);

type StatsProps = {
  languages?: LanguageMetadata[];
};

export default function Stats({ languages }: StatsProps) {
  const container = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(bgRef.current, {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".stat-card",
        {
          opacity: 0,
          y: "2rem",
        },
        {
          scrollTrigger: container.current,
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.5,
          ease: "power2.inOut",
        },
      );
    },
    {
      dependencies: [],
      scope: container,
    },
  );

  return (
    <section className="relative overflow-clip bg-stats min-h-[150vh] px-10 pt-[calc(7.5rem+50vh)] pb-30 md:py-60">
      <div className="absolute rotate-180 top-0 left-0 right-0 h-[50vh] bio-to-stats z-12" />
      <SpamBackground
        ref={bgRef}
        className="absolute -left-10 -top-1/2 -right-10 -bottom-10 z-10 blur-[0.3rem] opacity-7.5"
        index="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
      />
    </section>
  );
}
