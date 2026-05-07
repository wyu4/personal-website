"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import { CiBank, CiCalendar, CiLocationOn } from "react-icons/ci";
import { InsetDiv, Sticker } from "../reusable/div-presets";
import Stats from "./github-stats";
import { FadeInHeading } from "../reusable/heading-presets";
import { GlowBackground } from "../reusable/backgrounds";

gsap.registerPlugin(ScrollTrigger);

export default function Bio() {
  const container = useRef<HTMLDivElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);

  const statContainer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const splitParagraph = new SplitText(paragraph.current, {
        type: "words, chars",
      });

      gsap.fromTo(
        splitParagraph.chars,
        { opacity: 0 },
        {
          delay: 0.5,
          scrollTrigger: paragraph.current,
          opacity: 1,
          stagger: 0.01,
          duration: 0.1,
          onComplete: () => splitParagraph.revert(),
        },
      );

      return () => {
        splitParagraph.revert();
      };
    },
    {
      scope: container,
      dependencies: [],
    },
  );

  return (
    <section
      ref={container}
      className="page-section relative flex flex-col lg:justify-start lg:items-center"
      id="about"
    >
      <GlowBackground
        cssVariable="--red-150"
        count={5}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      <div className="relative flex flex-col lg:flex-row lg:justify-center lg:items-start gap-5 z-20">
        <div className="flex flex-col justify-center items-center lg:items-start gap-5">
          <FadeInHeading className="text-4xl md:text-5xl text-center lg:text-start">
            About Me
          </FadeInHeading>
          <p
            ref={paragraph}
            className="text-lg md:text-xl text-center lg:text-start gap-5 min-w-1/2"
          >
            I'm a high school student with a serious interest in software development. I
            mostly lean toward React for web projects and Java for desktop applications.
          </p>
        </div>
        <InsetDiv
          ref={statContainer}
          className="p-10 xl:px-20 xl:py-10 rounded-2xl bg-(--gray-100)/50 flex flex-col justify-center items-start gap-2 lg:gap-4 overflow-clip"
        >
          <MiniStat text="17 years old">
            <CiCalendar />
          </MiniStat>
          <MiniStat text="Ottawa, Canada" order={1}>
            <CiLocationOn />
          </MiniStat>
          <MiniStat text="Earl of March" order={2}>
            <CiBank />
          </MiniStat>
        </InsetDiv>
      </div>
      <Stats />
    </section>
  );
}

function MiniStat({
  children,
  text,
  order = 0,
}: DivAttributes & {
  text: string;
  order?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.set(container.current, { opacity: 0 });

    const delay = order * 0.1 + 0.25;

    const split = new SplitText(textRef.current, {
      type: "words, chars",
    });

    gsap.fromTo(
      container.current,
      { opacity: 0 },
      {
        delay: delay,
        opacity: 1,
        duration: 1,
        scrollTrigger: container.current,
      },
    );

    gsap.fromTo(
      split.chars,
      { opacity: 0, x: "1rem" },
      {
        delay: delay * 2,
        opacity: 1,
        x: 0,
        stagger: 0.01,
        duration: 0.5,
        scrollTrigger: container.current,
        onComplete: split.revert,
      },
    );

    return () => {
      split.revert();
    };
  }, [order]);
  return (
    <div
      ref={container}
      className="flex flex-row flex-nowrap justify-center items-center shrink-0 gap-2 xl:gap-4"
    >
      <Sticker>{children}</Sticker>
      <p
        ref={textRef}
        className="code text-xs xl:text-xl text-nowrap code"
      >{`[${text}]`}</p>
    </div>
  );
}
