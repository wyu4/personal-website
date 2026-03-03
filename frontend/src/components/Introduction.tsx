import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import RepositoryCard from "./reusable/RepositoryCard";

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
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.set(carouselContainerRef.current, {
            opacity: 0,
        });
    }, []);

    useGSAP(() => {
        if (!repositories || repositories.length <= 0) return;
        gsap.to(carouselContainerRef.current, {
            opacity: 0.75,
            delay: 1,
            duration: 2,
            stagger: 1,
        });
        gsap.to(carouselRef.current, {
            xPercent: -50,
            ease: "none",
            duration: repositories.length * 5,
            repeat: -1,
        });
    }, [repositories]);

    return (
        <div className="absolute bg-stone-900 w-full h-full pointer-events-none z-1 overflow-hidden">
            <div
                ref={carouselContainerRef}
                className="absolute h-auto -bottom-10 left-[-10vw] w-[150vw] skew-10 rotate-z-340 rotate-x-30 perspective-distant bg-amber-200"
            >
                <div className="overflow-x-hidden bg-neutral-800 border-y-2 border-neutral-700 z-5">
                    <div
                        ref={carouselRef}
                        className="top-0 left-0 min-w-full flex flex-row w-max gap-5 p-5 "
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
                <div className="w-full h-50 bg-linear-to-b from-neutral-800 to-stone-900" />
            </div>
        </div>
    );
}
