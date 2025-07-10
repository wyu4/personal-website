import React from "react";
import Repository, { type RepositoryData } from "./Repository";

type RepositoryGalleryProps = {
    username?: string;
};



export default function RepositoryGallery({
    username = "wyu4",
}: RepositoryGalleryProps) {
    const [data, setData] = React.useState<RepositoryData[]>([]);
    React.useEffect(() => {
        fetch(`https://api.github.com/users/${username}/repos?type=all&sort=updated`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((result: RepositoryData[]) => {
                setData(result);
            })
            .catch((reason) =>
                console.error(
                    `Could not get all repositories for gallery: ${reason}`
                )
            );
    }, [username]);
    return (
        <div className="repository-gallery transparent">
            {data.map((repo) => (
                <Repository
                    {...repo}
                    key={repo.html_url}
                ></Repository>
            ))}
        </div>
    );
}
