"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import AnimatedName from "./animated-name";
import { RepositoryCard } from "./gallery";
import { getFromServer, getRepositories } from "@/utils/http-helpers";

const NO_ZOOM = true;
const RETRY_TIME = 1000; // Milliseconds

export default function Banner() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const timeline = gsap.timeline();

  const [repositories, setRepositories] = useState<Repository[]>([]);

  // Get repositories, if it fails auto-try again later
  useCallback(async () => {
    let id: NodeJS.Timeout | undefined = undefined;
    const update = async () => {
      const data = await getRepositories();
      if (!data) {
        id = setTimeout(async () => {
          await update();
        }, RETRY_TIME);
      }
    };

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, []);

  useGSAP(() => {
    timeline
      .set(containerRef.current, {
        scale: 6,
      })
      .fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(
        containerRef.current,
        { x: "40rem", y: "0" },
        { x: "70rem", y: "0", duration: 0.75 },
        "<",
      )
      .fromTo(
        containerRef.current,
        { x: "-60rem", y: "-10rem" },
        { x: "-70rem", y: "-10rem", duration: 0.75 },
      )
      .to(containerRef.current, {
        x: 0,
        y: 0,
        duration: 0.75,
        scale: 1,
        ease: "power2.inOut",
      });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-dvh overflow-clip grid place-items-center opacity-0"
    >
      <div
        ref={containerRef}
        className="absolute w-[200%] h-[200%] grid place-items-center bg-radial-[at_50%_50%] from-gray-100 from-10% to-gray-200 to-90%"
      >
        <div
          ref={textContainerRef}
          className="grid place-items-center pointer-events-none"
        >
          {/* <RepositoryCard className="absolute" /> */}
          <AnimatedName />
        </div>
      </div>
    </section>
  );
}
