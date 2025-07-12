import Button from "./Button";
import githubIcon from "../assets/github.png";
import gmailIcon from "../assets/gmail.png";
import mailIcon from "../assets/mail.png";
import type React from "react";

type ContactSpanProps = React.HTMLAttributes<HTMLSpanElement> & {
    fadeIn?: boolean;
    fadeInDelay?: number;
};

export default function ContactSpan({
    fadeIn = false,
    className,
    fadeInDelay = 0,
    ...args
}: ContactSpanProps) {
    const createAnimationDelay = (seconds: number) => {
        return {
            animationDuration: "0.7s",
            animationDelay: `${seconds}s`,
        };
    };

    return (
        <span className={"contacts " + className} {...args}>
            <span
                className={fadeIn ? "fade-in-on-load" : ""}
                style={createAnimationDelay(fadeInDelay + 0.5)}
            >
                <Button
                    className="transparent"
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=wilsonyu657@gmail.com&su=Subject"
                >
                    <img src={gmailIcon}></img>
                </Button>
            </span>

            <span
                className={fadeIn ? "fade-in-on-load" : ""}
                style={createAnimationDelay(fadeInDelay + 0.7)}
            >
                <Button
                    className="transparent"
                    href="mailto:wilsonyu657@gmail.com"
                >
                    <img src={mailIcon}></img>
                </Button>
            </span>

            <span
                className={fadeIn ? "fade-in-on-load" : ""}
                style={createAnimationDelay(fadeInDelay + 0.9)}
            >
                <Button className="transparent" href="https://github.com/wyu4">
                    <img src={githubIcon}></img>
                </Button>
            </span>
        </span>
    );
}
