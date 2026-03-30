import { Express } from "express";
import {
    createSupabase,
    getTable,
    Owner,
    SimplifiedRepository,
    Table,
} from "../helpers/external";

const { GITHUB_API_KEY } = require("./../helpers/environment");

type Repository = SimplifiedRepository & {
    owner: Owner;
};

let allRepositories: SimplifiedRepository[] | undefined = undefined;
let publicRepositories: SimplifiedRepository[] | undefined = undefined;
let owners: Owner[] = [];

export const createRepositoriesAPI = (app: Express) => {
    const supabase = createSupabase();

    const setRepositories = (data: SimplifiedRepository[] | null) => {
        if (!data) return;
        allRepositories = data;
        publicRepositories = data.filter(
            (repo) => repo.visibility === "public",
        );

        console.log(
            `📃 Updated repositories. ${publicRepositories.length}/${allRepositories.length} repositories will be exposed.`,
        );
    };

    app.get("/api/repositories", async (req, res) => {
        console.log(`<<< Received [/api/repositories] ping from ${req.ip}.`);

        if (supabase) {
            await getTable("github_repository", setRepositories);
            await getTable<Owner>("github_repository_owners", (data) => {
                if (!data) return;
                owners = data;
            });
        }

        if (!publicRepositories) {
            res.sendStatus(403);
        }

        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
        res.setHeader("Content-Type", "application/json");

        const completedRepositories = publicRepositories!.map((repo) => {
            const login = repo.owner;
            const owner = owners.find((owner) => owner.login === login) || {
                avatar_url:
                    "https://avatars.githubusercontent.com/u/9919?s=200",
                html_url: "https://github.com/",
                login: "???",
                type: "User",
            };
            return { ...repo, owner } as Repository;
        });

        res.send(JSON.stringify(completedRepositories));
    });
};
