import Button from "./Button";
import githubIcon from "../assets/github.png";
import gmailIcon from "../assets/gmail.png";
import mailIcon from "../assets/mail.png";

export default function ContactSpan() {
    const createAnimationDelay = (seconds: number) => {
        return {
            animationDuration: "0.7s",
            animationDelay: `${seconds}s`,
        };
    };

    return (
        <span className="contacts">
            <span className="fade-in-on-load" style={createAnimationDelay(1.5)}>
                <Button
                    className="transparent"
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=wilsonyu657@gmail.com&su=Subject"
                >
                    <img src={gmailIcon}></img>
                </Button>
            </span>

            <span className="fade-in-on-load" style={createAnimationDelay(1.7)}>
                <Button
                    className="transparent"
                    href="mailto:wilsonyu657@gmail.com"
                >
                    <img src={mailIcon}></img>
                </Button>
            </span>

            <span className="fade-in-on-load" style={createAnimationDelay(1.9)}>
                <Button
                    className="transparent"
                    href="https://github.com/wyu4"
                >
                    <img src={githubIcon}></img>
                </Button>
            </span>
        </span>
    );
}
