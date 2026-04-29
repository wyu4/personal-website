import { limitText } from "@/utils/text-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef } from "react";

declare type RepositoryCarouselProps = DivAttributes & {
  repositories: Repository[] | undefined;
  secondsPerCard: number;
  inverted?: boolean;
};

const Gallery = forwardRef<HTMLDivElement, RepositoryCarouselProps>(
  (
    { repositories, secondsPerCard, inverted = false, className = "", ...props },
    carouselContainerRef,
  ) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (!repositories || repositories.length <= 0) return;
      if (carouselRef.current === null) return;

      let carouselTween: GSAPTween | null = null;

      const carouselObserver = new ResizeObserver(() => {
        const fullWidth = carouselRef.current!.scrollWidth;
        const loopWidth = fullWidth / 2;

        carouselTween?.kill();

        carouselTween = gsap.fromTo(
          carouselRef.current,
          { x: inverted ? -loopWidth : 0 },
          {
            x: inverted ? 0 : -loopWidth,
            ease: "none",
            duration: repositories.length * secondsPerCard,
            repeat: -1,
          },
        );
      });
      carouselObserver.observe(carouselRef.current);

      return () => {
        carouselTween?.kill();
        carouselObserver.disconnect();
      };
    }, [repositories, inverted]);
    return (
      <div
        ref={carouselContainerRef}
        className={`relative w-full overflow-visible h-auto will-change-transform bg-[#00000000] opacity-75 z-5 ${className}`}
        {...props}
      >
        <div className="overflow-x-hidden overflow-visible p-0">
          <div
            ref={carouselRef}
            className="top-0 min-w-full flex w-max gap-5 py-5"
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
  ({ repository = DEMO_REPOSITORY, className = "", characterLimit = -1, ...props }, ref) => {
    const isTagged = () => {
      if (!repository) return false;
      return repository.archived || repository.fork;
    };

    return (
      <div
        className={`rounded-3xl flex flex-col p-7 gap-5 -bg-linear-25 from-gray-100 to-gray-200 shadow-md shrink-0 ${className}`}
        ref={ref}
        {...props}
      >
        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-2 justify-start items-start">
            <h2 className="text-4xl text-gray-600 font-bold select-none">{repository.name}</h2>
            {repository.description && (
              <p className="text-2xl text-gray-600 max-w-100 select-none">
                {`"${repository.description == "null" ? "No description" : limitText(repository.description, characterLimit)}"`}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-start items-center shrink-0 rounded-2xl overflow-clip">
            <img
              className="aspect-square h-32 select-none opacity-70"
              src={repository.owner.avatar_url}
            />
          </div>
        </div>
        {isTagged() && (
          <div className="flex flex-row gap-2">
            {repository.archived && <Tag text="archived" />}
            {repository.fork && <Tag text="forked" />}
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
