"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AnimatedName from "./animated-name";
import Gallery, { RepositoryCard } from "./gallery";
import { getRepositories } from "@/utils/http-helpers";
import { GITHUB_GALLERY_SIZE } from "@/utils/environment";
import { useInnerWindow } from "@/app/hooks/window";

const RETRY_TIME = 1000; // Milliseconds

export default function Banner() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [backgroundVisible, setBackgroundVisible] = useState(false);

  // Get repositories, if it fails auto-try again later
  const reloadRepositories = useCallback(async () => {
    let id: NodeJS.Timeout | undefined = undefined;
    const update = async () => {
      const data = await getRepositories();
      if (data) {
        id = undefined;
        setRepositories((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
        return;
      }
      id = setTimeout(async () => {
        await update();
      }, RETRY_TIME);
    };
    update();

    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, []);

  useEffect(() => {
    reloadRepositories();
  }, []);

  useGSAP(() => {
    const timeline = gsap.timeline();
    timeline
      // Setup
      .set(containerRef.current, {
        scale: 6,
      })
      // Name animation
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
      .to(
        containerRef.current,
        {
          x: 0,
          y: 0,
          duration: 0.75,
          scale: 1,
          ease: "power2.inOut",
        },
        // Make repositories appear
      );
    const id = setTimeout(() => setBackgroundVisible(true), timeline.duration() * 1000 - 400);
    return () => clearTimeout(id);
  }, []);

  console.log("hello");

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-dvh overflow-clip grid place-items-center opacity-0"
    >
      <div
        ref={containerRef}
        className="absolute w-[200%] h-[200%] grid place-items-center bg-radial-[at_50%_50%] from-gray-100 from-10% to-gray-200 to-90%"
      >
        <Background repositories={repositories} visible={backgroundVisible} />
        <div
          ref={textContainerRef}
          className="relative grid place-items-center pointer-events-none w-full"
        >
          {/* {repositories.length >= 0 && <Gallery repositories={repositories} secondsPerCard={4} />} */}

          <AnimatedName />
        </div>
      </div>
    </section>
  );
}

type BackgroundProps = {
  repositories: Repository[];
  visible: boolean;
};

function Background({ repositories, visible }: BackgroundProps) {
  const container = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const chunks = useMemo(() => {
    const result: Repository[][] = [];
    for (let i = 0; i < repositories.length; i += GITHUB_GALLERY_SIZE) {
      const chunk = repositories.slice(i, i + GITHUB_GALLERY_SIZE);
      if (chunk.length < GITHUB_GALLERY_SIZE && result.length > 0) {
        result[result.length - 1] = result[result.length - 1].concat(chunk);
        break;
      }
      result.push(chunk);
    }
    return result;
  }, [repositories]);
  const [verticalPadding, setVerticalPadding] = useState(0);

  useInnerWindow(
    (_, h) => {
      if (chunks.length <= 0) return;
      setVerticalPadding(Math.max(h / chunks.length / 8, 0));
    },
    [chunks.length],
  );

  useGSAP(() => {
    gsap.set(container.current, { opacity: 0 });
    gsap.set(plane.current, { scale: 50, filter: "blur(20px)" });
    if (!visible) return;

    const timeline = gsap.timeline();
    timeline
      .to(container.current, {
        opacity: 1,
        duration: 0.25,
      })
      .to(plane.current, { scale: 1, filter: "blur(0px)", duration: 2, ease: "sine.out" }, "<")
      .to(plane.current, { rotateX: 20, duration: 3, ease: "sine.inOut" }, "<");
  }, [visible]);

  return (
    <div
      ref={container}
      className="absolute w-full h-full grid place-items-center overflow-clip pointer-events-none perspective-distant"
    >
      <div
        ref={plane}
        className="relative flex flex-col-reverse justify-center items-center"
        style={{
          gap: verticalPadding,
        }}
      >
        {chunks.map((chunk, i) => (
          <Gallery
            key={chunk.map((repo) => repo.html_url).join(".")}
            repositories={chunk}
            inverted={i % 2 === 1}
            loopEnabled={visible}
          />
        ))}
      </div>
    </div>
  );
}
