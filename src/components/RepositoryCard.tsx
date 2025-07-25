import React from "react";
import Button from "./Button";

export type RepositoryCardProps = {
    name: string;
    html_url: string;
    owner: {
        login: string;
        avatar_url: string;
        html_url: string;
        type: string;
    };
    description: string;
    fork: boolean;
    onFocus?: () => void;
    onFocusLost?: () => void;
    style?: React.CSSProperties;
};

const RepositoryCard = React.forwardRef<HTMLSpanElement, RepositoryCardProps>(
    (
        {
            onFocus = () => {},
            onFocusLost = () => {},
            ...args
        }: RepositoryCardProps,
        ref
    ) => {
        const cardRef = React.useRef<HTMLDivElement>(null);
        const animationHandle = React.useRef<number>(null);

        const setTilt = (element: HTMLElement, x: number, y: number) => {
            if (animationHandle.current) {
                cancelAnimationFrame(animationHandle.current);
            }
            animationHandle.current = requestAnimationFrame(
                () =>
                    (element.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`)
            );
        };

        const onMouseMove: React.MouseEventHandler<HTMLButtonElement> = (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
            const card = cardRef.current;
            if (!card) return;

            const button = event.currentTarget;
            const bounds = button.getBoundingClientRect();

            const width = bounds.width;
            const height = bounds.height;

            const mouseX = event.clientX - bounds.left;
            const mouseY = event.clientY - bounds.top;

            const percentX = width != 0 ? mouseX / width - 0.5 : 0;
            const percentY = height != 0 ? mouseY / height - 0.5 : 0;

            setTilt(card, percentY * -40, percentX * 40);
        };

        const onMouseEnter = onFocus;

        const onMouseLeave = () => {
            if (cardRef.current) {
                setTilt(cardRef.current, 0, 0);
            }
            onFocusLost();
        };

        React.useEffect(() => {
            const handle = animationHandle.current;
            if (handle) {
                cancelAnimationFrame(handle);
            }
        });

        return (
            <span className="repository-cell" ref={ref}>
                <Button
                    className="repository transparent"
                    href={args.html_url}
                    onMouseEnter={onMouseEnter}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    grow={false}
                >
                    <div id="card" ref={cardRef}>
                        <h2 id="title">
                            {args.name + (args.fork ? " (forked)" : "")}
                        </h2>
                        <p id="desc">{args.description}</p>
                        <span id="right">
                            <a
                                className="transparent"
                                id="icon"
                                href={args.owner.html_url}
                                target="_blank"
                            >
                                <img
                                    src={args.owner.avatar_url}
                                    draggable="false"
                                ></img>
                            </a>
                            <p>
                                <b>{args.owner.login}</b>
                            </p>
                        </span>
                    </div>
                </Button>
            </span>
        );
    }
);

RepositoryCard.displayName = "Github-Repository-Card";

export default RepositoryCard;
