import { MdOutlineEmail } from "react-icons/md";
import { BiLogoGithub } from "react-icons/bi";
import PushButton from "./reusable/PushButton";

export default function NavBar() {
    return (
        <div className="fixed top-0 left-0 right-0 flex justify-between items-center z-40 p-5">
            <h2 className="pointer-events-none select-none">Wilson Yu</h2>
            <div className="flex flex-row justify-center items-center gap-5 text-4xl sm:text-5xl">
                <PushButton
                    className="text-inherit"
                    onClick={() => {
                        window.open("mailto:wilsonyu657@gmail.com", "_blank");
                    }}
                >
                    <MdOutlineEmail />
                </PushButton>
                <PushButton
                    className="text-inherit"
                    onClick={() => {
                        window.open(
                            "https://mail.google.com/mail/?view=cm&fs=1&to=wilsonyu657@gmail.com&su=Subject",
                            "_blank",
                        );
                    }}
                >
                    <img
                        className="w-(--text-4xl) sm:w-(--text-5xl)"
                        src="/gmail.webp"
                    />
                </PushButton>
                <PushButton
                    className="text-inherit"
                    onClick={() => {
                        window.open("https://github.com/wyu4", "_blank");
                    }}
                >
                    <BiLogoGithub />
                </PushButton>
            </div>
        </div>
    );
}
