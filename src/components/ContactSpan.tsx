import Button from "./Button";
import githubIcon from "../assets/github.png";
import gmailIcon from "../assets/gmail.png";
import mailIcon from "../assets/mail.png";

function ContactSpan() {
    const openLink = (url: string) => {
        const opened = window.open(url, "_blank");
        if (opened) opened.focus();
    };

    const createAnimationDelay = (seconds: number) => {
        return {
            animationDuration: "0.7s",
            animationDelay: `${seconds}s`
        };
    };

    return (
        <span className="contacts">
            <span className="fade-in-on-load" style={createAnimationDelay(1.5)}>
                <Button
                    className="transparent"
                    onClick={() =>
                        openLink(
                            "https://mail.google.com/mail/?view=cm&fs=1&to=wilsonyu657@gmail.com&su=Subject"
                        )
                    }
                >
                    <img src={gmailIcon}></img>
                </Button>
            </span>

            <span className="fade-in-on-load" style={createAnimationDelay(1.7)}>
                <Button
                    className="transparent"
                    onClick={() => openLink("mailto:wilsonyu657@gmail.com")}
                >
                    <img src={mailIcon}></img>
                </Button>
            </span>

            <span className="fade-in-on-load" style={createAnimationDelay(1.9)}>
                <Button
                    className="transparent"
                    onClick={() => openLink("https://github.com/wyu4")}
                >
                    <img src={githubIcon}></img>
                </Button>
            </span>
        </span>
    );
}

export default ContactSpan;
