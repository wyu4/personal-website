import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { forwardRef, useEffect, useRef, useState } from "react";
import RepositoryCard from "./reusable/RepositoryCard";
import Bio from "./Bio";
import PushButton from "./reusable/PushButton";
import { CiCircleChevDown } from "react-icons/ci";
import { useGSAPScrollEffect, useScrollEffect } from "../hooks/WindowHooks";

const MAX_REPOS_DISPLAYED = 7;

export function Introduction({ ...props }: IntroductionProps) {
    const introRef = useRef<HTMLDivElement>(null);
    const [showTitle, setShowTitle] = useState(true);
    const [showBio, setShowBio] = useState(false);
    const [bioMounted, setBioMounted] = useState(false);

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

            gsap.fromTo(
                ".background",
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1,
                },
            );

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

            if (showTitle) {
                gsap.set(".title-card", { opacity: 0 });
            }

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

    useScrollEffect((y, h) => {
        setShowTitle(y <= h / 2);
        setShowBio(y >= 0.8 * h);
    }, []);

    useGSAP(
        () => {
            if (showTitle) {
                gsap.to(".title-card, .down-button", {
                    opacity: 1,
                    translateY: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                });
                return;
            }
            gsap.to(".title-card, .down-button", {
                opacity: 0,
                translateY: -40,
                duration: 0.5,
                ease: "power2.inOut",
            });
        },
        { scope: introRef, dependencies: [showTitle] },
    );

    useGSAP(
        () => {
            if (showBio) {
                setBioMounted(true);
                gsap.to(".bio", {
                    opacity: 1,
                    duration: 1,
                    pointerEvents: "all",
                    overwrite: "auto",
                    ease: "sine.inOut",
                });
                return;
            }
            gsap.to(".bio", {
                opacity: 0,
                duration: 1,
                ease: "sine.inOut",
                pointerEvents: "none",
                overwrite: "auto",
                onComplete: () => setBioMounted(false),
            });
        },
        { scope: introRef, dependencies: [showBio] },
    );

    return (
        <div
            ref={introRef}
            className="bg-[#00000000] h-screen w-full shrink-0 flex flex-row justify-center items-center"
        >
            <div className="background absolute bg-radial from-neutral-950 to-slate-950 w-full h-screen pointer-events-none overflow-x-clip z-1 perspective-distant">
                <Background {...props} />
            </div>
            <div className="title-card flex flex-col gap-2 justify-center items-start z-10 text-center">
                <h1 className="title text-inherit text-7xl font-bold text-shadow-lg text-shadow-slate-600">
                    Wilson Yu
                </h1>
                <h2 className="subtitle text-inherit text-3xl mb-10 text-shadow-lg text-shadow-slate-600">
                    Building things online
                </h2>
            </div>
            <Bio
                className="bio absolute top-1/2 -translate-y-1/2 opacity-0 z-10
                m-10"
                bioMounted={bioMounted}
                languages={props.languages}
            />
            <div className="absolute bottom-10 left-0 w-full z-10 flex flex-row justify-around items-center">
                <PushButton
                    className="down-button text-5xl"
                    onClick={() => {
                        props.scrollTo(window.innerHeight);
                    }}
                    disabled={showBio}
                >
                    <CiCircleChevDown />
                </PushButton>
            </div>
        </div>
    );
}

function Background({ repositories }: IntroductionProps) {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const carouselRefs = useRef<HTMLDivElement[]>([]);
    const [chunkedRepositories, setChunkedRepositories] = useState<
        Repository[][] | undefined
    >(undefined);

    useEffect(() => {
        if (!repositories) {
            setChunkedRepositories(undefined);
            return;
        }
        const chunks: Repository[][] = [];
        for (let i = 0; i < repositories.length; i += MAX_REPOS_DISPLAYED) {
            let chunk: Repository[] = [];
            if (repositories.length - i < 2 * MAX_REPOS_DISPLAYED) {
                chunk = repositories.slice(i, repositories.length);
                chunks.push(chunk);
                break;
            } else {
                chunk = repositories.slice(i, i + MAX_REPOS_DISPLAYED);
                chunks.push(chunk);
            }
        }
        setChunkedRepositories(chunks);
    }, [repositories]);

    useGSAP(() => {
        if (carouselRefs.current.length <= 0) return;
        gsap.fromTo(
            carouselRefs.current,
            {
                opacity: 0,
                translateY: "-25vh",
            },
            {
                opacity: 1,
                translateY: 0,
                delay: 1,
                duration: 1,
                ease: "sine.out",
                stagger: {
                    each: 0.25,
                    from: "start",
                },
            },
        );
    }, [chunkedRepositories]);

    useGSAPScrollEffect(
        (y, h) => {
            const scrollRatio = y / h;
            gsap.set(backgroundRef.current, {
                rotateX: 60 + 27 * scrollRatio,
                rotateY: 10 - 10 * scrollRatio,
                rotateZ: -10 + 10 * scrollRatio,
                transformOrigin: "bottom center",
            });
        },
        {
            scope: backgroundRef,
        },
    );

    return (
        <div
            ref={backgroundRef}
            className="absolute flex flex-col-reverse justify-start items-center -left-[50%] -right-[50%] bottom-0 scale-400 gap-5"
        >
            {chunkedRepositories?.map((chunk, i) => {
                if (i === 0) carouselRefs.current = [];
                return (
                    <RepositoryCarousel
                        ref={(node) => {
                            if (node) carouselRefs.current.push(node);
                        }}
                        key={`carousel-${i}`}
                        repositories={chunk}
                        secondsPerCard={i + 3}
                        inverted={i % 2 == 1}
                        className="shrink-0"
                        style={{
                            zIndex: chunkedRepositories.length - i,
                        }}
                    />
                );
            })}
        </div>
    );
}

const RepositoryCarousel = forwardRef<HTMLDivElement, RepositoryCarouselProps>(
    (
        { repositories, secondsPerCard, inverted, className = "", ...props },
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
                className={`relative w-full overflow-visible h-auto will-change-transform ${className}`}
                {...props}
            >
                <div className="overflow-x-hidden overflow-visible bg-gray-900 border-y-2 border-gray-700 z-5 p-0">
                    <div
                        ref={carouselRef}
                        className="top-0 min-w-full flex w-max gap-5 py-5 opacity-50"
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
                                {[...repositories, ...repositories].map(
                                    (repository, i) => (
                                        <RepositoryCard
                                            key={`repo#${i}`}
                                            className="shrink-0"
                                            repository={repository}
                                            characterLimit={50}
                                        />
                                    ),
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    },
);
