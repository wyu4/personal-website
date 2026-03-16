import { useCallback, useEffect, useState } from "react";
import { Introduction } from "../components/Introduction";
import { getFromServer } from "../utils/HTTPUtils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function Home() {
    const [repositories, setRepositories] = useState<Repository[] | undefined>(
        undefined,
    );

    const [languages, setLanguages] = useState<Record<string, number> | undefined>(
        undefined,
    );

    const [scrollLandmark, setScrollLandmark] = useState<number | undefined>(
        undefined,
    );

    const reloadRepositories = useCallback(() => {
        getFromServer("/api/repositories")
            .then((response) => response.json())
            .then((result: Repository[]) => {
                setRepositories(result);
            })
            .catch((reason) =>
                console.error(`Could not get all repositories: ${reason}`),
            );
        getFromServer("/api/repositories/languages")
            .then((response) => response.json())
            .then((result: Record<string, number>) => {
                setLanguages(result);
            })
            .catch((reason) =>
                console.error(`Could not get all repositories: ${reason}`),
            );
    }, []);

    useEffect(() => {
        reloadRepositories();
    }, []);

    useGSAP(() => {
        if (scrollLandmark === undefined) return;
        const duration = Math.min(
            Math.abs(scrollLandmark - window.scrollY) / window.innerHeight,
            3,
        );
        gsap.to(window, {
            scrollTo: scrollLandmark,
            duration: duration,
            ease: "sine.inOut",
            onComplete: () => setScrollLandmark(undefined),
        });
    }, [scrollLandmark]);

    const onScrollTo = (y: number) => {
        setScrollLandmark(y);
    };

    return (
        <>
            <div className="fixed flex flex-col gap-0 p-0 w-full">
                <Introduction
                    repositories={repositories}
                    languages={languages}
                    scrollTo={onScrollTo}
                />
            </div>
            <div className="h-[200vh]"></div>
        </>
    );
}
