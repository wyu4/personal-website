import { useCallback, useEffect, useState } from "react";
import { Introduction } from "../components/Introduction";
import Bio from "../components/Bio";

export default function Home() {
    const [repositories, setRepositories] = useState<Repository[] | undefined>(
        undefined,
    );

    const reloadRepositories = useCallback(() => {
        fetch(`https://api.github.com/users/wyu4/repos?type=all&sort=updated`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((result: Repository[]) => {
                setRepositories(result);
            })
            .catch((reason) =>
                console.error(`Could not get all repositories: ${reason}`),
            );
    }, []);

    useEffect(() => {
        reloadRepositories();
    }, []);

    return (
        <div className="flex flex-col gap-0 p-0">
            <Introduction repositories={repositories} />
            <Bio repositories={repositories} />
        </div>
    );
}
