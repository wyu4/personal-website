import { useIsInView } from "@/app/hooks/view";
import { getCookie, setCookie } from "cookies-next/client";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export default function Projects() {
  const container = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  const viewTriggeredFlag = useRef(false);
  const [enableIsInView, cleanupIsInView] = useIsInView(
    (is) => {
      if (!is || viewTriggeredFlag.current) return;
      viewTriggeredFlag.current = true;
      setTriggered(true);
    },
    container,
    0.1,
  );

  useEffect(() => {
    enableIsInView();
    return cleanupIsInView;
  }, []);

  useEffect(() => {
    if (triggered && !viewTriggeredFlag.current) cleanupIsInView();
  }, [triggered]);

  return (
    <section id="projects" ref={container}>
      <Overlay triggered={triggered} />
    </section>
  );
}

function Overlay({
  className,
  triggered,
  ...props
}: DivAttributes & {
  triggered: boolean;
}) {
  const cutsceneDisabled = useRef(true);
  const container = useRef<HTMLDivElement>(null);
  const timeline = useRef(gsap.timeline());

  useEffect(() => {
    const savedFlag = getCookie("user_cutscene_disabled");
    cutsceneDisabled.current = savedFlag === "true";
  }, []);

  useEffect(() => {
    if (cutsceneDisabled.current || !triggered) return;
    const tl = timeline.current;
    tl.fromTo(
      container.current,
      { opacity: 0, pointerEvents: "none" },
      {
        opacity: 1,
        pointerEvents: "all",
        duration: 1,
      },
    );

    return () => {
      tl.kill();
    };
  }, [triggered]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black pointer-events-none opacity-0 z-1000 ${className}`}
      ref={container}
      {...props}
    ></div>
  );
}
