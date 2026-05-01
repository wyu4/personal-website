"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { forwardRef, useRef } from "react";
import { CiBank, CiCalendar, CiLocationOn } from "react-icons/ci";
import Languages from "./languages";
import { InsetDiv, PopupDiv } from "../reusable/div-presets";

gsap.registerPlugin(ScrollTrigger);

export default function Bio() {
  const container = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);

  const statContainer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const splitHeading = new SplitText(heading.current, {
        type: "words, chars",
      });
      const splitParagraph = new SplitText(paragraph.current, {
        type: "words, chars",
      });

      gsap.fromTo(
        splitHeading.chars,
        { opacity: 0, y: "1rem" },
        {
          scrollTrigger: heading.current,
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.inOut",
        },
      );
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
        splitHeading.revert();
        splitParagraph.revert();
      };
    },
    {
      scope: container,
      dependencies: [],
    },
  );

  return (
    <div
      ref={container}
      className="relative flex flex-col lg:justify-start lg:items-center p-5 sm:p-10 md:p-20 gap-5"
    >
      <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start gap-5">
        <div className="flex flex-col justify-center items-center lg:items-start gap-5">
          <h2 ref={heading} className="text-4xl md:text-5xl text-center lg:text-start" id="about">
            About Me
          </h2>
          <p
            ref={paragraph}
            className="text-lg md:text-xl text-center lg:text-start gap-5 min-w-1/2"
          >
            I'm a high school student with a serious interest in software development. I mostly lean
            toward React for web projects and Java for desktop applications. I love the process of
            taking an idea from a rough concept to a working tool and I'm constantly looking for new
            projects to contribute to.
          </p>
        </div>
        <InsetDiv
          ref={statContainer}
          className="p-10 xl:px-20 xl:py-10 rounded-2xl flex flex-col justify-center items-start gap-2 lg:gap-4 overflow-clip"
        >
          <Stat text="17 years old">
            <CiCalendar />
          </Stat>
          <Stat text="Ottawa, Canada" order={1}>
            <CiLocationOn />
          </Stat>
          <Stat text="Earl of March" order={2}>
            <CiBank />
          </Stat>
        </InsetDiv>
      </div>
      <Languages />
    </div>
  );
}

function Stat({
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
      <p ref={textRef} className="code text-xs xl:text-xl text-nowrap code">{`[${text}]`}</p>
    </div>
  );
}

const Sticker = forwardRef<HTMLDivElement, DivAttributes>(({ children }, ref) => {
  return (
    <PopupDiv
      ref={ref}
      className="text-3xl aspect-square bg-gray-200 rounded-md p-1"
    >
      {children}
    </PopupDiv>
  );
});
