"use client";

import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { limitText } from "@/utils/text-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useEffect, useRef } from "react";

declare type RepositoryCarouselProps = DivAttributes & {
  repositories: Repository[] | undefined;
  secondsPerCard?: number;
  inverted?: boolean;
  loopEnabled?: boolean;
};

const Gallery = forwardRef<HTMLDivElement, RepositoryCarouselProps>(
  (
    {
      repositories,
      secondsPerCard,
      inverted = false,
      loopEnabled = true,
      className = "",
      ...props
    },
    carouselContainerRef,
  ) => {
    const randomSecondsPerCard = useRef(gsap.utils.random(2, 4)).current;
    const carouselRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
      if (carouselRef.current === null) return;

      let carouselTween: GSAPTween | null = null;

      const carouselObserver = new ResizeObserver(() => {
        if (!repositories || repositories.length <= 0) return;
        const fullWidth = carouselRef.current!.scrollWidth;
        const loopWidth = fullWidth / 2;

        carouselTween?.kill();

        if (!loopEnabled) {
          carouselTween = gsap.set(carouselRef.current, { x: inverted ? -loopWidth : 0 });
          return;
        }

        carouselTween = gsap.fromTo(
          carouselRef.current,
          { x: inverted ? -loopWidth : 0 },
          {
            x: inverted ? 0 : -loopWidth,
            ease: "none",
            duration: repositories.length * (secondsPerCard ?? randomSecondsPerCard),
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => Math.round(parseFloat(x))), // 👈 key fix
            },
          },
        );
      });
      carouselObserver.observe(carouselRef.current);

      return () => {
        carouselObserver.disconnect();
        carouselTween?.kill();
      };
    }, [repositories, inverted, loopEnabled]);
    return (
      <div
        ref={carouselContainerRef}
        className={`w-screen shrink-0 overflow-visible h-auto will-change-transform bg-[#00000000] opacity-75 z-5 ${className}`}
        {...props}
      >
        <div className="overflow-visible p-0">
          <div
            ref={carouselRef}
            className="top-0 min-w-full flex w-max gap-5 py-3"
            style={
              inverted
                ? {
                    flexDirection: "row-reverse",
                  }
                : {
                    flexDirection: "row",
                  }
            }
          >
            {repositories && (
              <>
                {[...repositories, ...repositories].map((repository, i) => (
                  <RepositoryCard
                    key={`repo#${i}`}
                    className="shrink-0"
                    repository={repository}
                    characterLimit={50}
                    shineTowardsCenter={true}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default Gallery;

const DEMO_REPOSITORY: Repository = {
  name: "personal-website",
  html_url: "https://github.com/wyu4/personal-website",
  visibility: "public",
  description: "New revised website",
  fork: true,
  archived: true,
  languages_url: "https://api.github.com/repos/wyu4/personal-website/languages",
  owner: {
    login: "wyu4",
    avatar_url: "https://avatars.githubusercontent.com/u/139521392?v=4",
    html_url: "https://github.com/wyu4",
    type: "User",
  },
};

export const RepositoryCard = forwardRef<HTMLDivElement, DivAttributes & RepositoryCardProps>(
  (
    {
      repository = DEMO_REPOSITORY,
      className = "",
      characterLimit = -1,
      shineTowardsCenter = false,
      ...props
    },
    forwardedRef,
  ) => {
    const container = useRef<HTMLDivElement>(null);

    const isTagged = () => {
      if (!repository) return false;
      return repository.archived || repository.fork;
    };

    useEffect(() => {
      if (!shineTowardsCenter) {
        gsap.set(container.current, {
          backgroundImage: `linear-gradient(-25deg, var(--gray-100), var(--gray-200))`,
        });
        return;
      }
      let frame: number | undefined = undefined;
      const update = () => {
        if (container.current) {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const currentBounds = container.current?.getBoundingClientRect();
          const currentX = currentBounds.x + currentBounds.width / 2;
          const currentY = currentBounds.y + currentBounds.height / 2;

          const y = 100 - gsap.utils.clamp(0, 1, currentY / h) * 100;
          const x = 100 - gsap.utils.clamp(0, 1, currentX / w) * 100;

          gsap.set(container.current, {
            backgroundImage: `radial-gradient(ellipse farthest-corner at ${x}% ${y}%, var(--gray-200), var(--gray-100))`,
          });
        }
        frame = requestAnimationFrame(update);
      };
      update();

      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    }, [shineTowardsCenter]);

    return (
      <div
        className={`rounded-3xl flex flex-col p-7 gap-5 shadow-md shrink-0 ${className}`}
        ref={(node) => bindRefAndForwardRef(node, forwardedRef, container)}
        {...props}
      >
        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-2 justify-start items-start">
            <h2 className="text-4xl text-gray-600 font-bold">{repository.name}</h2>
            {repository.description && (
              <p className="text-2xl text-gray-600 max-w-100">
                {`"${repository.description == "null" ? "No description" : limitText(repository.description, characterLimit)}"`}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-start items-center shrink-0 rounded-2xl">
            <img
              className="aspect-square h-32 opacity-70"
              src={`${repository.owner.avatar_url}&s=128`}
            />
          </div>
        </div>
        {isTagged() && (
          <div className="flex flex-row gap-2">
            {repository.archived && <Tag text="archive" />}
            {repository.fork && <Tag text="fork" />}
          </div>
        )}
      </div>
    );
  },
);

const Tag = forwardRef<HTMLDivElement, DivAttributes & RepositoryTagProps>(
  ({ text, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex justify-center items-center py-1 px-4 rounded-full bg-gray-100 shadow-inner inset-shadow-2xs ${className}`}
        {...props}
      >
        <p className="select-none text-gray-600">{text}</p>
      </div>
    );
  },
);
