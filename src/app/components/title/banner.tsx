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
  const nameRef = useRef<HTMLDivElement>(null);

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
    const width = nameRef.current?.offsetWidth ?? 0;
    const timeline = gsap.timeline();
    timeline
      // Setup
      .set(containerRef.current, {
        scale: 6,
        filter: "blur(0.1rem)",
      })
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
      .to(
        containerRef.current,
        {
          x: 0,
          y: 0,
          duration: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power2.inOut",
        },
        // Make repositories appear
      );
    const id = setTimeout(() => setBackgroundVisible(true), timeline.duration() * 1000 - 400);
    return () => clearTimeout(id);
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
        <Background repositories={repositories} visible={backgroundVisible} />
        <div
          ref={textContainerRef}
          className="relative grid place-items-center pointer-events-none w-full"
        >
          <AnimatedName ref={nameRef} />
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
      .to(plane.current, { scale: 1, filter: "blur(0px)", duration: 4, ease: "power4.out" }, "<")
      .to(
        plane.current,
        { rotateX: 20, translateY: -verticalPadding, duration: 4, ease: "power4.out" },
        "<",
      );
  }, [visible]);

  return (
    <div
      ref={container}
      className="absolute w-full h-full grid place-items-center overflow-clip pointer-events-none perspective-distant"
    >
      <div
        ref={plane}
        className="relative flex flex-col-reverse justify-start items-center"
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
