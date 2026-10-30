"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import { InsetDiv, Sticker } from "../reusable/div-presets";
import { FadeInHeading } from "../reusable/heading-presets";
import Contacts from "../reusable/contacts";
import { GlowBackground } from "../reusable/backgrounds";

gsap.registerPlugin(ScrollTrigger);

const BIRTHDATE = new Date("2008-11-11T00:00:00-05:00");

function getAge(birthdate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthdate.getFullYear();
  const m = now.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

export default function Bio() {
  const age = useRef(getAge(BIRTHDATE)).current;

  const container = useRef<HTMLDivElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);

  const statContainer = useRef<HTMLDivElement>(null);
  const contactContainer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const splitParagraph = new SplitText(paragraph.current, {
        type: "words",
      });

      gsap.fromTo(
        splitParagraph.words,
        { opacity: 0 },
        {
          delay: 1,
          scrollTrigger: paragraph.current,
          opacity: 1,
          stagger: 0.05,
          duration: 0.5,
          onComplete: () => splitParagraph.revert(),
        },
      );

      gsap.fromTo(
        contactContainer.current,
        { opacity: 0 },
        {
          delay: 0.5,
          scrollTrigger: contactContainer.current,
          opacity: 1,
          duration: 0.5,
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
      className="page-section relative w-full flex flex-col justify-start items-center gap-10 z-20"
      id="about"
    >
      <GlowBackground
        cssVariable="--gray-300"
        count={2}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      <div className="flex flex-col justify-center items-center gap-5 z-10">
        <FadeInHeading className="text-4xl md:text-5xl text-center">
          Who Am I?
        </FadeInHeading>
        <div
          ref={contactContainer}
          className="flex flex-row w-full justify-center items-center gap-5"
        >
          <Contacts />
        </div>
        <p
          ref={paragraph}
          className="text-lg md:text-xl text-center lg:text-start gap-5 md:w-2/3"
        >
          When I was young, I developed a strong interest in application and
          game development. I'm now {age} years old, proud to be studying
          computer science in Carleton University's class of 31, and am delving
          into the field of AI algorithms.
        </p>
      </div>
      <InsetDiv
        ref={statContainer}
        className="relative p-5 xl:px-20 lg:py-5 rounded-2xl bg-(--gray-100)/50 grid grid-cols-[0.75rem_minmax(0,1fr)] md:grid-cols-[max-content_0.75rem_minmax(0,1fr)] gap-x-4 md:gap-x-5 overflow-clip z-10 w-full md:w-3/4"
      >
        <EventState
          date="Sept 2020 - Jun 2022"
          text="Intermediate schooling"
          order={1}
        />
        <EventState
          date="Sept 2022 - Jun 2026"
          text="Ontario Secondary School Diploma (OSSD)"
          order={2}
        />
        <EventState
          date="Sept 2026 - now"
          text="Honours Bachelor of Computer Science (B.C.Sc Hons)"
          order={3}
        />
      </InsetDiv>
    </section>
  );
}

function EventState({
  date,
  text,
  order,
  className = "",
  ...props
}: Omit<DivAttributes, "children"> & {
  date: string;
  text: string;
  order: number;
}) {
  return (
    <div
      className={
        "relative col-span-full grid grid-cols-subgrid grid-rows-[auto_auto] md:grid-rows-1 " +
        className
      }
      {...props}
    >
      <h2 className="col-start-2 row-start-1 md:col-start-1 self-end md:self-center pt-2 md:py-2.5 text-xs sm:text-sm md:text-xl text-start md:text-end text-nowrap opacity-70 md:opacity-100">
        {date}
      </h2>
      <div className="relative col-start-1 row-start-1 row-span-2 md:col-start-2 md:row-span-1 flex flex-col justify-center items-center">
        <span className="w-0.5 h-full bg-(--gray-900)" />
        <span className="absolute w-full h-full flex justify-center items-center">
          <span className="aspect-square rounded-full w-full bg-(--gray-900) flex justify-center items-center p-0.5">
            <span className="aspect-square rounded-full w-full bg-(--gray-100)" />
          </span>
        </span>
      </div>
      <p className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 self-start md:self-center pb-2 md:py-2.5 text-sm md:text-xl text-start text-wrap">
        {text}
      </p>
    </div>
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
