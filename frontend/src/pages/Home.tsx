import { useCallback, useEffect, useState } from "react";
import { Introduction } from "../components/Introduction";

export default function Home() {
    const [repositories, setRepositories] = useState<Repository[] | undefined>(undefined);

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
        <>
            <Introduction repositories={repositories} />
        </>
    );
}
