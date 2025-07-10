import Button from "./Button";

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
                    <img src="./src/assets/gmail.png"></img>
                </Button>
            </span>

            <span className="fade-in-on-load" style={createAnimationDelay(1.7)}>
                <Button
                    className="transparent"
                    onClick={() => openLink("mailto:wilsonyu657@gmail.com")}
                >
                    <img src="./src/assets/mail.png"></img>
                </Button>
            </span>

            <span className="fade-in-on-load" style={createAnimationDelay(1.9)}>
                <Button
                    className="transparent"
                    onClick={() => openLink("https://github.com/wyu4")}
                >
                    <img src="./src/assets/github.png"></img>
                </Button>
            </span>
        </span>
    );
}

export default ContactSpan;
