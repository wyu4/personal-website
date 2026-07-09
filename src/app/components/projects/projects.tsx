import { useIsInView } from "@/app/hooks/view";
import { getCookie } from "cookies-next/client";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import {
  ConstructionDiv,
  InsetDiv,
  MarkdownDiv,
  PopupDiv,
} from "../reusable/div-presets";
import { GlowBackground } from "../reusable/backgrounds";
import { getProjects } from "@/utils/server-http-helpers";
import { IoIosExpand, IoIosLink, IoLogoGithub } from "react-icons/io";
import PushButton, { PushAnchor } from "../reusable/push-button";
import { convertDateToReadable } from "@/utils/time-helpers";

type ProjectsProps = {
  maintenance: boolean;
};

export default function Projects({ maintenance }: ProjectsProps) {
  const container = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [showSection, setShowSection] = useState(false);
  const [projects, setProjects] = useState<ProjectMetadata[] | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    getProjects().then((response) => {
      if (response.body) {
        setProjects(response.body);
      }
    });
  }, []);

  const viewTriggeredFlag = useRef(false);
  const [enableIsInView, cleanupIsInView] = useIsInView((is) => {
    if (!is || viewTriggeredFlag.current) return;
    viewTriggeredFlag.current = true;
    setTriggered(true);
  }, trigger);

  useEffect(() => {
    enableIsInView();
    return cleanupIsInView;
  }, []);

  useEffect(() => {
    if (triggered && !viewTriggeredFlag.current) cleanupIsInView();
  }, [triggered]);

  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col items-center justify-center p-5 overflow-clip bg-(--gray-100)"
      ref={container}
    >
      <div
        style={{
          opacity: showSection ? 1 : 0,
          pointerEvents: showSection ? "auto" : "none",
        }}
      >
        <div ref={trigger} className="absolute top-10 bottom-10" />
        <GlowBackground
          cssVariable="--gray-200"
          count={5}
          className="absolute top-0 left-0 w-full h-full z-10"
        />
        {maintenance ? <ConstructionDiv /> : null}
        {!maintenance && projects && (
          <div className="relative flex flex-row justify-center items-start flex-wrap z-15 gap-4 p-8">
            {projects.map((data) => (
              <ProjectDiv key={data.name} project={data} />
            ))}
          </div>
        )}
      </div>
      <Overlay triggered={triggered} setShowSection={setShowSection} />
    </section>
  );
}

function Overlay({
  className,
  triggered,
  setShowSection,
  ...props
}: DivAttributes & {
  triggered: boolean;
  setShowSection: Dispatch<SetStateAction<boolean>>;
}) {
  const cutsceneDisabled = useRef(true);
  const parent = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const translationContainer = useRef<HTMLDivElement>(null);
  const textContainer = useRef<HTMLDivElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const timeline = useRef(gsap.timeline());
  const [animationFinised, setAnimationFinished] = useState(false);

  useEffect(() => {
    const savedFlag = getCookie("user_cutscene_disabled");
    cutsceneDisabled.current = savedFlag === "true";
  }, []);

  useEffect(() => {
    if (!triggered || animationFinised) return;

    let id: number | undefined = undefined;
    const update = () => {
      if (animationFinised || !parent.current || !translationContainer.current) return;
      const parentRect = parent.current.getBoundingClientRect();
      const child = translationContainer.current;

      const currentY = (gsap.getProperty(child, "y") as number) || 0;
      const childRect = child.getBoundingClientRect();
      const currentTop = childRect.top - currentY;

      const desiredY = window.innerHeight / 2 - childRect.height / 2;
      const clampedDesiredY = gsap.utils.clamp(
        parentRect.top,
        parentRect.height - childRect.height,
        desiredY,
      );

      gsap.set(translationContainer.current, {
        y: clampedDesiredY - currentTop,
      });

      id = requestAnimationFrame(update);
    };

    id = requestAnimationFrame(update);
    return () => {
      if (id) {
        cancelAnimationFrame(id);
      }
    };
  }, [animationFinised, triggered]);

  useEffect(() => {
    if (cutsceneDisabled.current || !triggered || headings.current.length < 3) return;
    const split1 = new SplitText(headings.current[0], {
      type: "lines, words",
    });
    const split2 = new SplitText(headings.current[1], {
      type: "words, chars",
    });

    const tl = timeline.current;
    tl.set(container.current, { opacity: 1, y: "100vh", pointerEvents: "none" })
      .set(textContainer.current, { y: "-100vh" })
      .set(split1.lines, { scale: 1.5 })
      .set(split1.words, { y: "-100%", opacity: 0 })
      .set(split2.words, { y: "100%" })
      .to([container.current, textContainer.current], {
        y: 0,
        pointerEvents: "all",
        duration: 2,
        ease: "power4.out",
      })
      .to(
        split1.words,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: {
            each: 0.2,
            from: "center",
          },
          ease: "power1.out",
        },
        "<",
      )
      .to(
        split1.lines,
        {
          scale: 1,
          duration: 1,
          ease: "power3.inOut",
        },
        "-=1",
      )
      .to(
        headings.current[2],
        {
          height: "auto",
          duration: 1,
          ease: "power3.inOut",
        },
        "<",
      )
      .to(headings.current[1], {
        height: "auto",
        duration: 1,
        ease: "power2.inOut",
      })
      .to(
        split2.words,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.25,
          ease: "power2.out",
        },
        "<",
      )
      .set([headings.current[1], headings.current[2]], {
        overflow: "visible",
      })
      .call(() => setShowSection(true))
      .to([split1.words, split2.chars, headings.current[2]], {
        y: "100vh",
        duration: 0.75,
        rotate: () => gsap.utils.random(-90, 90),
        stagger: {
          each: 0.01,
          from: "random",
        },
        ease: "power2.in",
      })
      .to(
        container.current,
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.5,
          ease: "sine.inOut",
        },
        "-=0.5",
      )
      .set(container.current, { visibility: "hidden" })
      .call(() => {
        setAnimationFinished(true);
        split1.revert();
        split2.revert();
      });

    return () => {
      tl.kill();
      split1.revert();
      split2.revert();
    };
  }, [triggered]);

  return (
    <div ref={parent} className="absolute top-0 left-0 right-0 bottom-0">
      <div
        className={`relative w-full h-full bg-(--gray-950) flex flex-col justify-start items-center pointer-events-none opacity-0 overflow-clip z-100 ${className}`}
        ref={container}
        {...props}
      >
        <div ref={translationContainer} className="relative grid place-items-center">
          <div
            ref={textContainer}
            className="relative flex flex-col justify-start items-center gap-2 md:gap-10 py-10 pointer-none:"
          >
            <h1
              ref={(node) => {
                headings.current[0] = node;
              }}
              className="text-3xl md:text-5xl lg:text-8xl text-(--gray-100)! select-none"
              aria-hidden={true}
            >
              Talk, is talk.
            </h1>
            <h1
              ref={(node) => {
                headings.current[1] = node;
              }}
              className="text-3xl md:text-5xl lg:text-8xl text-(--gray-100)! h-0 select-none overflow-clip"
              aria-hidden={true}
            >
              Show me the code.
            </h1>
            <h2
              ref={(node) => {
                headings.current[2] = node;
              }}
              className="text-sm md:text-2xl text-(--gray-100)! select-none h-0 overflow-clip"
              aria-hidden={true}
            >
              - Linus Torvalds
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDiv({ project }: { project: ProjectMetadata }) {
  const createDate = convertDateToReadable(new Date(project.created));

  const scopeDiv = useRef<HTMLDivElement>(null);
  const interactionDiv = useRef<HTMLDivElement>(null);

  return (
    <PopupDiv
      ref={scopeDiv}
      className="relative bg-(--gray-100) rounded-2xl flex flex-col max-w-100 p-8 gap-8 justify-center items-center"
      hoverEffectEnabled={false}
    >
      <div className="relative flex flex-col justify-center items-center gap-1">
        <p className="text-sm">
          <i>{createDate}</i>
        </p>
        <h2 className="text-3xl md:text-4xl text-center">{project.name}</h2>
      </div>
      <div className="relative max-h-50 overflow-clip">
        <MarkdownDiv className="relative z-10" text={project.description} />
        <div className="absolute z-15 top-0 bottom-0 left-0 right-0 flex flex-col justify-end items-center p-2 bg-linear-to-t from-(--gray-100) to-(--gray-100)/0" />
      </div>
      <InsetDiv
        ref={interactionDiv}
        className="relative flex flex-col items-center justify-center gap-3 p-3 rounded-sm"
      >
        <PushButton className="bg-(--gray-100) grid place-items-center w-full p-1 text-2xl rounded-sm shadow-md shadow-div">
          <IoIosExpand />
        </PushButton>
        <div className="relative flex flex-row gap-3 justify-center items-center">
          <ProjectLink href={project.demo}>
            <IoIosLink />
          </ProjectLink>
          <ProjectLink href={project.repo}>
            <IoLogoGithub />
          </ProjectLink>
        </div>
      </InsetDiv>
    </PopupDiv>
  );
}

function ProjectLink({ href, children }: { href?: string | null; children?: ReactNode }) {
  return (
    <>
      {href && (
        <PushAnchor
          className="aspect-square grid place-items-center p-1 text-2xl rounded-sm shadow-md shadow-div"
          href={href}
        >
          {children}
        </PushAnchor>
      )}
    </>
  );
}
