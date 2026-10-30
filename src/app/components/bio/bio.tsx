"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
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

  useGSAP(
    () => {
      const tl = gsap.timeline();
    },
    {
      scope: container,
      dependencies: [],
    },
  );

  return (
    <section
      ref={container}
      className="relative w-full flex flex-row justify-center items-start gap-10 px-10 pt-60 pb-30 min-h-screen z-20 bg-bio"
      id="about"
    >
      {/* <SpamBackground
        className="absolute top-0 left-0 right-0 bottom-0 blur-[5px] opacity-20 z-10"
        index="1234567890"
        intervalMs={50}
      /> */}
      <div className="relative self-stretch flex-1 z-20">
        <RailDiv className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-center leading-none tracking-tight">
            Who Am I?
          </h2>
          <div className="h-px w-16 bg-(--gray-400)" />
          <div className="flex flex-row flex-wrap justify-center items-center gap-x-3 gap-y-1 text-base md:text-lg font-light">
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
      <div className="relative w-1/2 flex flex-col self-stretch justify-center items-center gap-10 text-wrap text-3xl text-(--gray-900)/80 text-center font-light bg-radial z-20">
        <p>When I was young, I discovered the world of software development.</p>
        <p>
          This led me to build many things, ranging from a web-game that
          integrates real-time traffic feeds in from my hometown, to a
          worlds-qualifying competition robot.
        </p>
        <p>
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
