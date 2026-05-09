import { useRef } from "react";

export default function Projects() {
  const container = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  return (
    <section id="projects" ref={container}>
      <div ref={trigger} />
    </section>
  );
}
