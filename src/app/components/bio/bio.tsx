"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useRef } from "react";
import { IoCalendarOutline, IoLocationOutline } from "react-icons/io5";
import { SpamBackground } from "../reusable/backgrounds";
import { PopupDiv, RailDiv } from "../reusable/div-presets";

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
  const bgRef = useRef<HTMLDivElement>(null);
  const titleContainer = useRef<HTMLDivElement>(null);
  const bioContainer = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleLineRef = useRef<HTMLDivElement>(null);
  const titleMetaRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useGSAP(
    () => {
      const titleChars = new SplitText(titleRef.current, {
        type: "words, chars",
      });

      const bioSplitVars: SplitText.Vars = {
        type: "words",
      };
      const bioWords: SplitText[] = [
        new SplitText(bioRef.current[0], bioSplitVars),
        new SplitText(bioRef.current[1], bioSplitVars),
        new SplitText(bioRef.current[2], bioSplitVars),
      ];

      gsap.to(bgRef.current, {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top center",
          scrub: false,
          pin: false,
        },
      });

      tl.addLabel("Hide Title")
        .from(titleChars.chars, {
          opacity: 0,
          y: "1rem",
          stagger: 0.1,
          duration: 0.5,
        })
        .addLabel("Hide BG")
        .from(bgRef.current, { opacity: 0, duration: 1 }, "<")
        .addLabel("Hide Title Metadata")
        .from(
          titleLineRef.current,
          {
            width: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.25",
        )
        .from(
          titleMetaRef.current,
          {
            opacity: 0,
            y: "1rem",
            duration: 1,
            ease: "power2.inOut",
          },
          "<+=0.5",
        )
        .addLabel("Hide Bio")
        .from(
          bioContainer.current,
          {
            opacity: 0,
            pointerEvents: "none",
            marginLeft: "-50%",
            duration: 1.5,
            ease: "power2.inOut",
          },
          "<+=0.1",
        )
        .from(
          bioWords[0].words,
          {
            opacity: 0,
            y: "1rem",
            rotate: 5,
            stagger: 0.05,
            duration: 0.25,
          },
          "-=0.25",
        )
        .from(
          bioWords[1].words,
          {
            opacity: 0,
            y: "1rem",
            rotate: 5,
            stagger: 0.05,
            duration: 0.25,
          },
          "+=0.1",
        )
        .from(
          bioWords[2].words,
          {
            opacity: 0,
            y: "1rem",
            rotate: 5,
            stagger: 0.05,
            duration: 0.25,
          },
          "+=0.1",
        );
    },
    {
      scope: container,
      dependencies: [],
    },
  );

  return (
    <section
      ref={container}
      className="relative w-full flex flex-col md:flex-row justify-start md:justify-center items-center md:items-start px-10 py-60 min-h-screen z-20 bg-bio overflow-clip"
      id="about"
    >
      <SpamBackground
        ref={bgRef}
        className="absolute -left-10 -top-1/2 -right-10 -bottom-10 z-10 blur-xs opacity-10"
        index="1234567890"
      />
      <div
        ref={titleContainer}
        className="relative self-stretch mb-50 md:mb-0 md:flex-1 z-20"
      >
        <RailDiv className="flex flex-col justify-center items-center gap-4">
          <h2
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl text-center leading-none tracking-tight"
          >
            Who Am I?
          </h2>
          <div ref={titleLineRef} className="h-px w-16 bg-(--gray-400)" />
          <div
            ref={titleMetaRef}
            className="flex flex-row flex-wrap justify-center items-center gap-x-3 gap-y-1 text-base md:text-lg font-light"
          >
            <p className="flex items-center gap-1.5 text-(--gray-600)">
              <IoLocationOutline aria-hidden className="text-(--gray-500)" />
              Ottawa, Ontario
            </p>
            <span aria-hidden className="text-(--gray-400)">
              •
            </span>
            <p className="flex items-center gap-1.5 text-(--gray-600)">
              <IoCalendarOutline aria-hidden className="text-(--gray-500)" />
              {age} years old
            </p>
          </div>
        </RailDiv>
      </div>
      <div
        ref={bioContainer}
        className="relative w-full md:w-1/2 flex flex-col self-stretch justify-center items-center gap-10 text-wrap text-xl md:text-3xl text-(--gray-900)/80 text-center md:font-light bg-radial z-20"
      >
        <p
          ref={(n) => {
            bioRef.current.push(n);
          }}
        >
          When I was young, I discovered the world of software development.
        </p>
        <p
          ref={(n) => {
            bioRef.current.push(n);
          }}
        >
          This led me to build many things, ranging from a web-game that
          integrates real-time traffic feeds in from my hometown, to a
          worlds-qualifying competition robot.
        </p>
        <p
          ref={(n) => {
            bioRef.current.push(n);
          }}
        >
          Now, I'm proud to be in my first year studying computer science at
          Carleton University, specializing in the AI stream.
        </p>

        {/* <div className="relative flex flex-1 flex-col">
          <SpecDiv text="Hi" />
        </div> */}
      </div>
    </section>
  );
}

function SpecDiv({
  className = "",
  children,
  text = "empty spec",
  ...props
}: DivAttributes & {
  text?: string;
}) {
  return (
    <PopupDiv
      className={
        "relative flex flex-row p-5 gap-2.5 bg-(--gray-100) rounded-xl border border-(--gray-400) text-xl" +
        className
      }
      {...props}
    >
      {children}
      <div className="self-stretch w-px bg-(--gray-400)" />
      <p>{text}</p>
    </PopupDiv>
  );
}
