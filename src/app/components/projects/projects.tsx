import { useIsInView } from "@/app/hooks/view";
import { getCookie } from "cookies-next/client";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { ConstructionDiv, MarkdownDiv, PopupDiv } from "../reusable/div-presets";
import { GlowBackground } from "../reusable/backgrounds";
import { getProjects } from "@/utils/server-http-helpers";
import { IoIosLink, IoLogoGithub, IoMdSkipForward } from "react-icons/io";
import { PushAnchor } from "../reusable/push-button";
import { convertDateToReadable } from "@/utils/time-helpers";

type ProjectsProps = {
  maintenance: boolean;
};

export default function Projects({ maintenance }: ProjectsProps) {
  const container = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [showSection, setShowSection] = useState(false);
  const [projects, setProjects] = useState<ProjectMetadata[] | null>(null);

  useEffect(() => {
    getProjects().then((response) => {
      if (response.body) {
        setProjects(response.body);
      }
    });
  }, []);

  const viewTriggeredFlag = useRef(false);
  const [enableIsInView, cleanupIsInView] = useIsInView(
    (is) => {
      if (!is || viewTriggeredFlag.current) return;
      viewTriggeredFlag.current = true;
      setTriggered(true);
    },
    container,
    0.9,
  );

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
      className="relative min-h-[80vh] flex flex-col items-center justify-center p-5 overflow-clip bg-(--gray-100)"
      ref={container}
    >
      <div
        style={{
          opacity: showSection ? 1 : 0,
          pointerEvents: showSection ? "auto" : "none",
        }}
      >
        <GlowBackground
          cssVariable="--gray-200"
          count={5}
          className="absolute top-0 left-0 w-full h-full z-10"
        />
        {maintenance ? <ConstructionDiv /> : null}
        {projects && <ProjectsPanel projects={projects} />}
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
  const container = useRef<HTMLDivElement>(null);
  const textContainer = useRef<HTMLDivElement>(null);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const timeline = useRef(gsap.timeline());

  useEffect(() => {
    const savedFlag = getCookie("user_cutscene_disabled");
    cutsceneDisabled.current = savedFlag === "true";
  }, []);

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
    <div
      className={`absolute top-0 left-0 w-full h-full bg-(--gray-950) pointer-events-none opacity-0 grid place-items-center overflow-clip z-100 ${className}`}
      ref={container}
      {...props}
    >
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
  );
}

function ProjectsPanel({ projects }: { projects: ProjectMetadata[] }) {
  return (
    <div className="relative flex flex-row justify-center items-start flex-wrap z-15 gap-4 p-8">
      {projects.map((data) => (
        <ProjectDiv key={data.name} project={data} />
      ))}
    </div>
  );
}

function ProjectDiv({ project }: { project: ProjectMetadata }) {
  const createDate = convertDateToReadable(new Date(project.created));

  return (
    <PopupDiv
      className="relative bg-(--gray-100) rounded-2xl flex flex-col max-w-100 p-8 gap-8 justify-center items-center"
      hoverEffectEnabled={false}
    >
      <div className="relative flex flex-col justify-center items-center gap-1">
        <p className="text-sm"><i>{createDate}</i></p>
        <h2 className="text-3xl md:text-4xl text-center">{project.name}</h2>
      </div>
      <div className="relative max-h-50 overflow-clip">
        <MarkdownDiv className="z-10" text={project.description} />
        <div className="absolute z-15 top-0 bottom-0 left-0 right-0 bg-linear-to-t from-(--gray-100) to-(--gray-100)/0"></div>
      </div>
      <div className="relative flex flex-row gap-3 justify-center items-center">
        <ProjectLink href={project.demo}>
          <IoIosLink />
        </ProjectLink>
        <ProjectLink href={project.repo}>
          <IoLogoGithub />
        </ProjectLink>
      </div>
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
