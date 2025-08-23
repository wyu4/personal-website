import React from "react";
import RepositoryCard from "./RepositoryCard";

type BioProps = React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
};

const Bio = ({ className = "", ...args }: BioProps) => {
    const birthDate = 1226379600000;

    return (
        <div className={"bio " + className} {...args}>
            <RepositoryCard
                name="About Me"
                html_url=""
                description={
                    "I am a " +
                    Math.floor(
                        (Date.now() - birthDate) / 365.25 / 24 / 60 / 60 / 1000
                    ) +
                    " year old who enjoys coding things every now and then."
                }
                owner={{
                    login: "wyu4",
                    avatar_url: "https://avatars.githubusercontent.com/u/139521392",
                    html_url: "https://github.com/wyu4",
                    type: "authro",
                }}
                fork={false}
                interactable={false}
            ></RepositoryCard>
            <div></div>
        </div>
    );
};

export default Bio;
