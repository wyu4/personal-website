import { JSX, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FadeInHeading } from "../reusable/heading-presets";
import { InsetDiv, PopupDiv } from "../reusable/div-presets";
import { PushAnchor } from "../reusable/push-button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { BeamBackground, GlowBackground } from "../reusable/backgrounds";

gsap.registerPlugin(ScrollTrigger);

export default function TechStack() {
  const serviceContainer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".service",
        { opacity: 0, scale: 0 },
        {
          delay: 0.5,
          scrollTrigger: serviceContainer.current,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.25,
          ease: "back.out",
        },
      );
    },
    {
      dependencies: [],
      scope: serviceContainer,
    },
  );

  return (
    <section
      id="stack"
      className="relative page-section flex flex-col justify-center items-center bg-(--gray-150)"
    >
      <BeamBackground
        className="absolute w-full h-full left-0 top-0 z-5"
        pathColor="var(--gray-200)"
        pathAmount={10}
      />
      <FadeInHeading className="z-10 text-4xl md:text-5xl text-center lg:text-start mb-5 ">
        I Like Using:
      </FadeInHeading>
      <div className="flex flex-col justify-center items-center z-20">
        <div
          ref={serviceContainer}
          className="relative flex flex-row flex-wrap justify-center items-start gap-5 sm:gap-10 px-10 md:px-20"
        >
          <Service name="TypeScript" src="/typescript.png" href="https://www.typescriptlang.org/" />

          <Service name="Java" src="/java.png" href="https://www.java.com/" />
          <Service name="Python" src="/python.webp" href="https://www.python.org/" />
          <Service name="React" src="/react.webp" href="https://react.dev/" />
          <Service name="GSAP" src="/gsap.webp" href="https://gsap.com/" />
          <Service name="NextJS" src="/next.webp" href="https://nextjs.org/" />
          <Service name="Vite" src="/vite.webp" href="https://vite.dev/" />
        </div>
      </div>
    </section>
  );
}

type ServiceProps = {
  src: string;
  name: string;
  href: string;
  rootClass?: string;
};
function Service({ src, name, href }: ServiceProps) {
  const [hue, setHue] = useState("var(--gray-100)");
  const [loaded, setLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const timeline = useRef<gsap.core.Timeline | undefined>(undefined);
  const idleTimeline = useRef<gsap.core.Timeline | undefined>(undefined);

  const container = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLAnchorElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (!timeline.current) {
      timeline.current = gsap.timeline();
      const tl = timeline.current;
      tl.pause();
      tl.fromTo(
        background.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.1, ease: "power2.inOut" },
      )
        .fromTo(
          anchor.current,
          { padding: 0, width: "100%", height: "100%", margin: 0 },
          {
            padding: `2rem`,
            width: "300%",
            height: "200%",
            duration: 0.3,
            ease: "power2.out",
          },
          "<",
        )
        .fromTo(
          heading.current,
          { marginTop: 0, marginBottom: "-1.875rem" },
          {
            marginTop: "0.625rem",
            marginBottom: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "<",
        )
        .fromTo(
          heading.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.inOut" },
        );
    }

    if (!idleTimeline.current) {
      const INTENSITY = 0.5;
      const DURATION = 5;
      const inverse = Math.random() < 0.5 ? -1 : 1;
      idleTimeline.current = gsap.timeline();
      const idle = idleTimeline.current;
      idle.pause();
      idle.fromTo(
        container.current,
        {
          y: `${inverse * INTENSITY}rem`,
        },
        {
          y: `${-inverse * INTENSITY}rem`,
          duration: DURATION,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );

      idle.seek(Math.random() * DURATION);
    }

    gsap.set(container.current, { zIndex: hovering ? 40 : 10 });

    if (hovering) {
      timeline.current.play();
      idleTimeline.current.pause();
    } else {
      timeline.current.reverse();
      idleTimeline.current.play();
    }
  }, [hovering]);

  useEffect(() => {
    if (!image.current || !loaded) return;
    console.log("Loading!");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 50;
    canvas.height = 50;
    ctx.drawImage(image.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0;
    let g = 0;
    let b = 0;
    const totalPixels = imageData.length / 4;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }

    const averageR = r / totalPixels;
    const averageG = g / totalPixels;
    const averageB = b / totalPixels;

    const factor = 0.75;
    const paleR = averageR + (255 - averageR) * factor;
    const paleG = averageG + (255 - averageG) * factor;
    const paleB = averageB + (255 - averageB) * factor;

    setHue(`rgb(${paleR}, ${paleG}, ${paleB})`);
  }, [loaded]);

  useEffect(() => {
    if (image.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      ref={container}
      className="service relative grid place-items-center w-10 sm:w-20 aspect-square"
    >
      <PushAnchor
        ref={anchor}
        href={href}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="absolute w-full h-full rounded-2xl flex flex-col justify-center items-center"
      >
        <PopupDiv
          ref={background}
          hoverEffectEnabled={false}
          className="absolute w-full h-full rounded-xl sm:rounded-2xl opacity-0 z-10"
          style={{
            backgroundColor: hue,
          }}
        />
        <img
          ref={image}
          crossOrigin="anonymous"
          onLoad={() => setLoaded(true)}
          src={src === "" ? undefined : src}
          alt={name}
          className="max-h-10 sm:max-h-20 z-20 rounded-xl sm:rounded-2xl"
        />
        <h2
          ref={heading}
          className="text-sm sm:text-xl text-center -mb-7.5 opacity-0 pointer-events-none z-20"
        >
          {name}
        </h2>
      </PushAnchor>
    </div>
  );
}
