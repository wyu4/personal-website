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

  useGSAP(() => {
    
  }, {
    scope: container,
    dependencies: [],
  });

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
        <h2 className="text-4xl md:text-5xl text-center">Who Am I?</h2>
      </div>
    </section>
  );
}
