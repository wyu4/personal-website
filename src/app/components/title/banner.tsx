"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { JSX, useCallback, useEffect, useRef, useState, useTransition } from "react";
import AnimatedName from "./animated-name";
import { getRepositories } from "@/utils/client-http-helpers";
import { GITHUB_GALLERY_SIZE } from "@/utils/environment";
import Gallery from "./gallery";
import { useInnerWindowEffect } from "@/app/hooks/window";
import { useRetryEffect } from "@/app/hooks/retry";
import { useFontsLoaded } from "@/app/hooks/load";

const RETRY_TIME = 1000; // Milliseconds

export default function Banner() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const fontsLoaded = useFontsLoaded();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [ready, setReady] = useState(false);

  // Load repos
  useRetryEffect(
    async () => {
      const data = await getRepositories();
      if (data) {
        setRepositories(data);
      }
      return data !== undefined;
    },
    RETRY_TIME,
    [],
    "banner-repos",
  );

  // Flag as ready when repos and fonts have loaded
  useEffect(() => {
    if (fontsLoaded && repositories.length > 0) {
      setReady(true);
    }
  }, [fontsLoaded, repositories]);

  useGSAP(() => {
    if (!ready || repositories.length === 0) return;

    const width = nameRef.current?.offsetWidth ?? 0;
    const timeline = gsap.timeline();
    timeline
      // Setup
      .set(containerRef.current, {
        scale: 6,
        filter: "blur(1px)",
      })
      .set(textContainerRef.current, { background: "hsl(210, 8%, 91%)" })
      // Name animation
      .fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(
        containerRef.current,
        { x: width, y: "0" },
        { x: width * 2, y: "0", duration: 0.75 },
        "<",
      )
      .fromTo(
        containerRef.current,
        { x: -width * 2, y: "-10rem" },
        { x: -width * 2.25, y: "-10rem", duration: 0.75 },
      )

      .to(containerRef.current, {
        x: 0,
        y: 0,
        duration: 1,
        scale: 1,
        filter: "blur(0px)",
        ease: "power2.inOut",
      })
      .to(textContainerRef.current, { background: "hsl(210, 8%, 91%, 0)", duration: 0.5 }, "<");
    return () => timeline.kill();
  }, [repositories, ready]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-dvh overflow-clip grid place-items-center opacity-0"
    >
      <div
        ref={containerRef}
        className="absolute w-[200%] h-[200%] grid place-items-center bg-radial-[at_50%_50%] from-gray-100 from-10% to-gray-200 to-90%"
      >
        <Background repositories={repositories} ready={ready} />
        <div
          ref={textContainerRef}
          className="relative h-full grid place-items-center pointer-events-none w-full"
        >
          <AnimatedName ref={nameRef} ready={ready} />
        </div>
      </div>
    </section>
  );
}

type BackgroundProps = {
  repositories: Repository[];
  ready: boolean;
};

function Background({ repositories, ready }: BackgroundProps) {
  const container = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const [chunks, setChunks] = useState<Repository[][]>([]);
  const [verticalPadding, setVerticalPadding] = useState(0);
  const [_, startTransition] = useTransition();

  useInnerWindowEffect(
    (_, h) => {
      if (chunks.length <= 0) return;
      setVerticalPadding(Math.max(h / chunks.length / 8, 0));
    },
    [chunks],
  );

  useEffect(() => {
    console.log(verticalPadding);
  }, [verticalPadding]);

  useEffect(() => {
    const fillChunksAction = () => {
      const linear: Repository[][] = [];
      for (let i = 0; i < repositories.length; i += GITHUB_GALLERY_SIZE) {
        const chunk = repositories.slice(i, i + GITHUB_GALLERY_SIZE);
        if (chunk.length < GITHUB_GALLERY_SIZE && linear.length > 0) {
          linear[linear.length - 1] = linear[linear.length - 1].concat(chunk);
          break;
        }
        linear.push(chunk);
      }

      const result = new Array<Repository[]>(linear.length);
      const center = Math.floor(result.length / 2);

      let left = center;
      let right = center + 1;

      for (let i = 0; i < linear.length; i++) {
        if (i % 2 === 0) {
          result[left--] = linear[i];
        } else {
          result[right++] = linear[i];
        }
      }

      setChunks(result);
    };
    startTransition(fillChunksAction);
  }, [repositories]);

  const visible = useRef(false);

  useGSAP(() => {
    if (!ready || repositories.length === 0 || verticalPadding === 0) return;

    const timeline = gsap.timeline();
    if (!visible.current) {
      timeline.fromTo(
        plane.current,
        { filter: "blur(20px)", scale: 50, x: "100%", y: "100%" },
        {
          delay: 0.5,
          x: 0,
          y: -verticalPadding,
          scale: 1,
          filter: "blur(0px)",
          duration: 4,
          ease: "power4.out",
          onStart: () => (visible.current = true),
        },
      );
    } else {
      timeline.set(plane.current, {
        y: -verticalPadding,
      });
    }

    return () => {
      timeline.kill();
    };
  }, [repositories, verticalPadding, ready]);

  return (
    <div
      ref={container}
      className="absolute w-full h-full grid place-items-center pointer-events-none perspective-distant"
    >
      <div
        ref={plane}
        className="relative flex flex-col-reverse justify-center items-center rotate-x-20"
        style={{
          gap: verticalPadding,
        }}
      >
        {chunks.map((chunk, i) => (
          <Gallery key={`banner-chunk-${i}`} repositories={chunk} inverted={i % 2 === 1} />
        ))}
      </div>
    </div>
  );
}
