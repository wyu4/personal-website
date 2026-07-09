"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import { CiBank, CiCalendar, CiLocationOn } from "react-icons/ci";
import { InsetDiv, Sticker } from "../reusable/div-presets";
import { FadeInHeading } from "../reusable/heading-presets";
import PushButton from "../reusable/push-button";
import Contacts from "../reusable/contacts";
import { GlowBackground, LaserBackground } from "../reusable/backgrounds";

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
  const container = useRef<HTMLDivElement>(null);
  const paragraph = useRef<HTMLParagraphElement>(null);

  const statContainer = useRef<HTMLDivElement>(null);
  const contactContainer = useRef<HTMLDivElement>(null);

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
      className="page-section relative w-full flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 z-20"
      id="about"
    >
      {/* <LaserBackground className="absolute top-0 left-0 w-full h-full z-1" /> */}
      <GlowBackground
        cssVariable="--gray-200"
        count={2}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      <div className="flex flex-col justify-center items-center lg:items-start gap-5 z-10">
        <FadeInHeading className="text-4xl md:text-5xl text-center lg:text-start">
          Who Am I?
        </FadeInHeading>
        <div
          ref={contactContainer}
          className="flex flex-row w-full justify-center lg:justify-start items-center gap-5"
        >
          <Contacts />
        </div>
        <p
          ref={paragraph}
          className="text-lg md:text-xl text-center lg:text-start gap-5 min-w-1/2"
        >
          Hi, <b>I'm Wilson!</b> I am a 17 year computer science student, and I've been
          making stuff for almost six years now. What I always found the coolest to make
          is apps that connect to the real world in some way, creating projects ranging
          from an app that tracks in-game events via articles online, to a live web-game
          that utilizes a real city's live traffic cameras. Right now,{" "}
          <b>
            I am building my web development skills, and delving into the AI / Machine
            Learning industry.
          </b>
        </p>
      </div>
      <InsetDiv
        ref={statContainer}
        className="p-10 xl:px-20 xl:py-10 rounded-2xl bg-(--gray-100)/50 flex flex-col justify-center items-start gap-2 lg:gap-4 overflow-clip z-10"
      >
        <MiniStat text={`${getAge(BIRTHDATE)} years old`}>
          <CiCalendar />
        </MiniStat>
        <MiniStat text="Ottawa, Canada" order={1}>
          <CiLocationOn />
        </MiniStat>
        <MiniStat text="Carleton University" order={2}>
          <CiBank />
        </MiniStat>
      </InsetDiv>
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
