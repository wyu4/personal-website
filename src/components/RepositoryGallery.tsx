import React from "react";
import RepositoryCard, { type RepositoryCardProps } from "./RepositoryCard";

type RepositoryGalleryProps = React.HTMLAttributes<HTMLDivElement> & {
    username?: string;
    autoScroll?: boolean;
    autoScrollSpeed?: number;
    gap?: number;
};

export default function RepositoryGallery({
    username = "wyu4",
    className = "",
    autoScroll = false,
    autoScrollSpeed = 100,
    gap = 0,
    ...args
}: RepositoryGalleryProps) {
    const [repoData, setRepoData] = React.useState<RepositoryCardProps[]>([]);
    const galleryRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const animationHandle = React.useRef<number>(null);
    const lastTimestamp = React.useRef<number>(null);
    const scrollPosition = React.useRef<number>(0);

    const reloadRepositories = React.useCallback(() => {
        fetch(
            `https://api.github.com/users/${username}/repos?type=all&sort=updated`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((response) => response.json())
            .then((result: RepositoryCardProps[]) => {
                setRepoData(result);
                cardRefs.current = new Array(result.length).fill(null);
                scrollPosition.current = 0;
            })
            .catch((reason) =>
                console.error(
                    `Could not get all repositories for gallery: ${reason}`
                )
            );
    }, [username]);

    const step = React.useCallback(
        (currentTimestamp: number) => {
            if (!autoScroll) return;
            if (lastTimestamp.current) {
                const delta = currentTimestamp - lastTimestamp.current;
                lastTimestamp.current = currentTimestamp;

                const scrollAmount = autoScrollSpeed * (delta / 1000);

                scrollPosition.current += scrollAmount;

                const gallery = galleryRef.current;
                if (gallery) {
                    const galleryBounds = gallery.getBoundingClientRect();

                    const offscreenCardIndex = cardRefs.current.findIndex(
                        (card) => {
                            if (!card) return;

                            const bounds = card.getBoundingClientRect();
                            const offsetX = bounds.left - galleryBounds.left;
                            const newLeft = offsetX - scrollAmount;

                            return newLeft + bounds.width < 0;
                        }
                    );

                    

                    if (offscreenCardIndex >= 0) {
                        setRepoData((previousData) => {
                            const copy = [...previousData];
                            const [offscreenData] = copy.splice(
                                offscreenCardIndex,
                                1
                            );

                            return [...copy, offscreenData];
                        });
                        const [offscreenCard] = cardRefs.current.splice(
                            offscreenCardIndex,
                            1
                        );
                        scrollPosition.current -=
                            (offscreenCard?.offsetWidth || 0) + gap;
                    }

                    cardRefs.current.forEach((card, index) => {
                        if (!card) return;
                        card.style.transform = `translateX(${
                            -scrollPosition.current + index * gap
                        }px)`;
                    });
                }
            } else {
                lastTimestamp.current = currentTimestamp;
            }
            animationHandle.current = requestAnimationFrame(step);
        },
        [autoScroll, autoScrollSpeed, gap]
    );

    React.useEffect(() => {
        reloadRepositories();
        animationHandle.current = requestAnimationFrame(step);

        return () => {
            if (animationHandle.current) {
                cancelAnimationFrame(animationHandle.current);
            }
        };
    }, [reloadRepositories, step]);

    return (
        <div
            className={"repository-gallery " + className}
            {...args}
            ref={galleryRef}
        >
            {repoData.map((data, index) => (
                <RepositoryCard
                    key={data.html_url}
                    ref={(card) => {
                        if (card) {
                            cardRefs.current[index] = card;
                        }
                    }}
                    {...data}
                ></RepositoryCard>
            ))}
        </div>
    );
}
