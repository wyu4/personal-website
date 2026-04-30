"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { forwardRef, useRef } from "react";
import { CiBank, CiCalendar, CiLocationOn } from "react-icons/ci";

gsap.registerPlugin(ScrollTrigger);

export default function Bio() {
  const container = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);

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
    <div ref={container} className="relative flex flex-col lg:flex-row gap-5 p-20">
      <div className="flex flex-col justify-center items-center lg:items-start gap-5">
        <h2 ref={heading} className="text-5xl text-center lg:text-start">
          About Me
        </h2>
        <p ref={paragraph} className="text-xl text-center lg:text-start gap-5 min-w-1/2">
          I'm a high school student with a serious interest in software development. I mostly lean
          toward React for web projects and Java for desktop applications. I love the process of
          taking an idea from a rough concept to a working tool and I'm constantly looking for new
          projects to contribute to.
        </p>
      </div>
      <div className="p-10 xl:p-20 inset-shadow-gray-300/50 inset-shadow-sm rounded-2xl flex flex-col justify-center items-start gap-2 lg:gap-4">
        <Stat text="17 years old">
          <CiCalendar />
        </Stat>
        <Stat text="Ottawa, Canada">
          <CiLocationOn />
        </Stat>
        <Stat text="Earl of March Secondary School">
          <CiBank />
        </Stat>
      </div>
    </div>
  );
}

function Stat({
  children,
  text,
}: DivAttributes & {
  text: string;
}) {
  return (
    <div className="flex flex-row flex-nowrap justify-center items-center shrink-0 gap-2 xl:gap-4">
      <Sticker>{children}</Sticker>
      <p className="code text-xs xl:text-xl text-nowrap code">{`[${text}]`}</p>
    </div>
  );
}

const Sticker = forwardRef<HTMLDivElement, DivAttributes>(({ children }, ref) => {
  return (
    <div
      ref={ref}
      className="text-3xl aspect-square shadow-md shadow-gray-300/50 bg-gray-200 rounded-md p-1"
    >
      {children}
    </div>
  );
});
