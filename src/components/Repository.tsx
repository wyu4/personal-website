import React from "react";
import Button from "./Button";

export type RepositoryData = {
    full_name: string;
    html_url: string;
    owner: {
        avatar_url: string;
        html_url: string;
    };
    description: string;
};

export default function Repository(args: RepositoryData) {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const animationHandle = React.useRef<number>(null);

    const setTilt = (element: HTMLElement, x: number, y: number) => {
        if (animationHandle.current) {
            cancelAnimationFrame(animationHandle.current);
        }

        animationHandle.current = requestAnimationFrame(() => element.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`);
    };

    const onMouseOver: React.MouseEventHandler<HTMLButtonElement> = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const card = cardRef.current;
        if (!card) return;

        const button = event.currentTarget;
        const bounds = button.getBoundingClientRect();

        const width = bounds.width;
        const height = bounds.height;

        const mouseX = event.clientX - bounds.left;
        const mouseY = event.clientY- bounds.top;

        const percentX = width != 0 ? (mouseX/width)-0.5 : 0;
        const percentY = height != 0 ? (mouseY/height)-0.5 : 0;

        setTilt(card, percentY*-20, percentX*20);
    };

    const onMouseLeave: React.MouseEventHandler<HTMLButtonElement> = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const button = event.currentTarget;
        const tiltElement = button.querySelector("#card") as HTMLElement;
        if (tiltElement) {
            setTilt(tiltElement, 0, 0);
        }
    };

    React.useEffect(() => {
        const handle = animationHandle.current;
        if (handle) {
            cancelAnimationFrame(handle);
        }
    })

    return (
        <Button
            className="repository transparent"
            href={args.html_url}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
        >
            <div id="card" ref={cardRef}>
                <h2 id="title">{args.full_name}</h2>
                <p id="desc">{args.description}</p>
                <a
                    className="transparent grow-on-hover"
                    id="icon"
                    href={args.owner.html_url}
                    target="_blank"
                >
                    <img src={args.owner.avatar_url} draggable="false"></img>
                </a>
            </div>
        </Button>
    );
}
