"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { GlowBackground } from "../reusable/backgrounds";
import { RailDiv } from "../reusable/div-presets";

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
      className="relative w-full flex flex-row justify-center items-start gap-10 p-10 min-h-screen z-20"
      id="about"
    >
      <GlowBackground
        cssVariable="--gray-300"
        count={2}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      <div className="relative self-stretch flex-1">
        <RailDiv className="flex flex-col justify-center items-center z-10" offset="-10%">
          <h2 className="title text-7xl text-center">Who Am I?</h2>
        </RailDiv>
      </div>
    </section>
  );
}
