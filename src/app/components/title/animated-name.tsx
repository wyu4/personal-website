"use client";

import { useRootClass } from "@/app/hooks/misc";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { forwardRef, useRef } from "react";

type AnimatedNameProps = DivAttributes & {
  ready: boolean;
};

const AnimatedName = forwardRef<HTMLDivElement, AnimatedNameProps>(({ ready }, ref) => {
  const preRef = useRef<HTMLHeadingElement>(null);
  const lastRef = useRef<HTMLHeadingElement>(null);
  const rootClasses = useRootClass();

  useGSAP(() => {
    if (!ready) return;
    const timeline = gsap.timeline();
    const preSplit = new SplitText(preRef.current, {
      type: "words, chars",
    });
    const lastSplit = new SplitText(lastRef.current, {
      type: "words, chars",
    });

    timeline.set([preSplit.chars, lastSplit.chars], { opacity: 0 });

    for (const char of preSplit.chars) {
      timeline.set(char, {
        y: `${gsap.utils.random(-5, 5)}rem`,
        rotate: gsap.utils.random(-5, 5),
      });
    }
    for (const char of lastSplit.chars) {
      timeline.set(char, {
        x: `5rem`,
        rotate: gsap.utils.random(-5, 5),
      });
    }
    timeline
      .to(preSplit.chars, {
        y: 0,
        rotate: 0,
        duration: 0.75,
        opacity: 1,
        stagger: {
          each: 0.1,
          from: "start",
        },
        ease: "power2.inOut",
        onComplete: () => {
          if (timeline.isActive()) preSplit.revert();
        },
      })
      .to(
        lastSplit.chars,
        {
          x: 0,
          rotate: 0,
          duration: 1,
          opacity: 1,
          delay: 0.6,
          stagger: {
            each: 0.1,
            from: "end",
          },
          ease: "power2.inOut",
          onComplete: () => {
            if (timeline.isActive()) lastSplit.revert();
          },
        },
        "<",
      );
    return () => {
      timeline.kill();
      preSplit.revert();
      lastSplit.revert();
    };
  }, [ready, rootClasses]);

  return (
    <div
      ref={ref}
      className="relative flex flex-row gap-10 flex-nowrap translate-z-0 z-10"
      style={{
        willChange: "transform, filter",
      }}
    >
      <h1
        ref={preRef}
        className="relative text-gray-900 select-none text-6xl sm:text-7xl md:text-9xl"
      >
        Wilson
      </h1>
      <h1
        ref={lastRef}
        className="relative text-gray-900 select-none text-6xl sm:text-7xl md:text-9xl"
      >
        Yu
      </h1>
    </div>
  );
});

export default AnimatedName;
