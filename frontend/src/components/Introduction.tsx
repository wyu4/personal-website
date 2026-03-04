import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { forwardRef, useEffect, useRef, useState } from "react";
import RepositoryCard from "./reusable/RepositoryCard";

const MAX_REPOS_DISPLAYED = 10;

export function Introduction({ ...props }: IntroductionProps) {
    const introRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const title = SplitText.create(".title", {
                type: "chars",
            });
            const subtitle = SplitText.create(".subtitle", {
                type: "chars",
            });

            gsap.set(title.chars, {
                opacity: 0,
                translateY: 20,
            });
            gsap.set(subtitle.chars, {
                opacity: 0,
            });

            gsap.timeline()
                .to(title.chars, {
                    opacity: 1,
                    translateY: 0,
                    duration: 1,
                    ease: "sine.out",
                    stagger: {
                        each: 0.1,
                        from: "random",
                    },
                })
                .to(subtitle.chars, {
                    opacity: 1,
                    duration: 0,
                    stagger: 0.05,
                });

            return () => {
                title.revert();
                subtitle.revert();
            };
        },
        {
            dependencies: [],
            scope: introRef,
        },
    );

    return (
        <div
            ref={introRef}
            className="bg-[#00000000] h-screen flex flex-row justify-center items-center"
        >
            <Background {...props} />
            <span className="flex flex-col gap-2 justify-center items-start z-10 text-center">
                <h1 className="title text-inherit text-7xl font-bold text-shadow-lg text-shadow-slate-600">
                    Wilson Yu
                </h1>
                <h2 className="subtitle text-inherit text-3xl mb-10 text-shadow-lg text-shadow-slate-600">
                    Building things online
                </h2>
            </span>
        </div>
    );
}

function Background({ repositories }: IntroductionProps) {
    const carouselRefs = useRef<HTMLDivElement[]>([]);
    const [chunkedRepositories, setChunkedRepositories] = useState<
        Repository[][] | undefined
    >(undefined);

    useEffect(() => {
        if (!repositories) {
            setChunkedRepositories(undefined);
            return;
        }
        for (
            let i = 0;
            i < Math.min(repositories.length, 2 * MAX_REPOS_DISPLAYED);
            i += MAX_REPOS_DISPLAYED
        ) {
            let chunk: Repository[] = [];
            if (repositories.length - i < 2 * MAX_REPOS_DISPLAYED) {
                chunk = repositories.slice(i, repositories.length);
            } else {
                chunk = repositories.slice(i, i + MAX_REPOS_DISPLAYED);
            }
            setChunkedRepositories((prev) => {
                if (!prev) return [chunk];
                return [...prev, chunk];
            });
        }
    }, [repositories]);

    useGSAP(() => {
        gsap.set(carouselRefs.current, {
            opacity: 0,
        });
        gsap.to(carouselRefs.current, {
            opacity: 1,
            delay: 1,
            duration: 1,
            stagger: 0.5,
        });
    }, [chunkedRepositories]);

    return (
        <div className="absolute bg-stone-900 w-full h-full pointer-events-none z-1 overflow-hidden">
            <div className="absolute flex flex-col-reverse justify-center items-center left-[-50vw] right-[-50vw] bottom-0 perspective-distant">
                {chunkedRepositories?.map((chunk, i) => {
                    if (i === 0) carouselRefs.current = [];
                    return (
                        <RepositoryCarousel
                            ref={(node) => {
                                if (node) carouselRefs.current.push(node);
                            }}
                            key={`carousel-${i}`}
                            repositories={chunk}
                            secondsPerPixel={0.005 * (i + 1)}
                            className="shrink-0 rotate-x-80 -rotate-z-20 scale-200 -translate-z-20 origin-bottom-right shadow-2xl/60"
                        />
                    );
                })}
            </div>
        </div>
    );
}

const RepositoryCarousel = forwardRef<HTMLDivElement, RepositoryCarouselProps>(
    (
        { repositories, secondsPerPixel, className = "" },
        carouselContainerRef,
    ) => {
        const carouselRef = useRef<HTMLDivElement>(null);
        useGSAP(() => {
            if (!repositories || repositories.length <= 0) return;
            if (carouselRef.current === null) return;

            let carouselTween: GSAPTween | null = null;

            const carouselObserver = new ResizeObserver(() => {
                const loopWidth = carouselRef.current!.scrollWidth / 2;

                carouselTween?.kill();

                carouselTween = gsap.to(carouselRef.current, {
                    x: -loopWidth,
                    ease: "none",
                    duration: loopWidth * secondsPerPixel,
                    repeat: -1,
                });
            });
            carouselObserver.observe(carouselRef.current);

            return () => {
                carouselTween?.kill();
                carouselObserver.disconnect();
            };
        }, [repositories]);
        return (
            <div
                ref={carouselContainerRef}
                className={`w-full overflow-visible h-auto will-change-transform ${className}`}
            >
                <div className="overflow-x-hidden overflow-visible bg-neutral-800 border-y-2 border-neutral-700 z-5 p-0">
                    <div
                        ref={carouselRef}
                        className="top-0 left-0 min-w-full flex flex-row w-max gap-5 p-5 opacity-50"
                    >
                        {repositories && (
                            <>
                                {repositories.map((repository, i) => (
                                    <RepositoryCard
                                        key={`repo#${i}`}
                                        repository={repository}
                                        characterLimit={50}
                                    />
                                ))}
                                {repositories.map((repository, i) => (
                                    <RepositoryCard
                                        key={`repo2#${i}`}
                                        repository={repository}
                                        characterLimit={50}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full h-50 bg-linear-to-b from-neutral-800 to-stone-900 border-b-2 border-neutral-700 -mb-50" />
            </div>
        );
    },
);
