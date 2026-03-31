import { Express } from "express";
import {
    clearTable,
    completeRepositories,
    createSupabase,
    getTable,
    LastUpdate,
    lookupRepositories,
    Owner,
    pushTable,
    Repository,
    SimplifiedRepository,
    simplifyRepositories,
} from "../helpers/external";
import { LANGUAGE_REFRESH, REPOSITORY_REFRESH } from "../helpers/environment";

/**
 * Returns the number of seconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
 */
const sec = () => Math.floor(Date.now() / 1000);

let allRepositories: Repository[] | undefined = undefined;
let publicRepositories: Repository[] | undefined = undefined;
let allLanguages: Record<string, number> | undefined = undefined;
let lastUpdate: LastUpdate[] = [];

const syncData = async (databaseExists: boolean, presync?: () => void) => {
    const now = sec();

    await getTable<LastUpdate>("github_last_update", (data) => {
        if (!data) return;
        lastUpdate = data;
    });

    let lastRepositoriesUpdate = lastUpdate.find((row) => row.scope === "repositories") || { scope: "repositories", epoch: 0 };
    let lastLanguagesUpdate = lastUpdate.find((row) => row.scope === "languages") || { scope: "languages", epoch: 0 };
    let repositoriesUpdated = false;

    if (!databaseExists || now - lastRepositoriesUpdate.epoch >= REPOSITORY_REFRESH) {
        await lookupRepositories((data) => {
            if (!data) return;
            allRepositories = data;
            repositoriesUpdated = true;
        });
    }

    if (!databaseExists || now - lastLanguagesUpdate.epoch >= LANGUAGE_REFRESH) {
    }

    if (!allRepositories && databaseExists) {
        let owners: Owner[] = [];

        await getTable<Owner>("github_repository_owners", (data) => {
            if (!data) return;
            owners = data;
        });

        await getTable<SimplifiedRepository>("github_repository", (data) => {
            if (!data) return;
            allRepositories = completeRepositories(data, owners);
        });
    }

    if (allRepositories) {
        publicRepositories = allRepositories.filter((repo) => repo.visibility === "public");
        console.log(`📃 Updated repositories. ${publicRepositories.length}/${allRepositories.length} repositories will be exposed.`);
    }

    presync?.();

    if (repositoriesUpdated && allRepositories) {
        const { simplified, owners } = simplifyRepositories(allRepositories);
        await pushTable("github_repository_owners", owners, async (pushed) => {
            if (!pushed) return;
            await clearTable("github_repository", async (cleared) => {
                if (!cleared) return;
                lastRepositoriesUpdate.epoch = now;
                await pushTable("github_repository", simplified);
                await pushTable("github_last_update", [lastRepositoriesUpdate]);
            });
        });
    }
};

export const createRepositoriesAPI = (app: Express) => {
    const supabase = createSupabase();

    app.get("/api/repositories", async (req, res) => {
        console.log(`<<< Received [/api/repositories] ping from ${req.ip}.`);

        res.setHeader("Content-Type", "application/json");

        await syncData(supabase !== undefined, () => {
            if (!publicRepositories) {
                return res.sendStatus(403);
            }

            res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
            res.send(JSON.stringify(publicRepositories));
        });
    });
};
