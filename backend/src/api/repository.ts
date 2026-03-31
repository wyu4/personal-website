import { Express } from "express";
import {
    clearTable,
    completeRepositories,
    createSupabase,
    getTable,
    Language,
    LastUpdate,
    lookupLanguages,
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

const syncData = async (databaseExists: boolean, presync?: () => void, loadLanguages: boolean = false) => {
    const now = sec(); // Store current time in seconds

    // Get the last time anything was updated
    await getTable<LastUpdate>("github_last_update", (data) => {
        if (!data) return;
        lastUpdate = data;
    });

    let lastRepositoriesUpdate = lastUpdate.find((row) => row.scope === "repositories") || { scope: "repositories", epoch: 0 };
    let lastLanguagesUpdate = lastUpdate.find((row) => row.scope === "languages") || { scope: "languages", epoch: 0 };
    let repositoriesUpdated = false;
    let languagesUpdated = false;

    // Download repository data from GitHub if database doesn't exist OR stored data is stale
    if (!databaseExists || now - lastRepositoriesUpdate.epoch >= REPOSITORY_REFRESH) {
        await lookupRepositories((data) => {
            if (!data) return;
            allRepositories = data;
            repositoriesUpdated = true;
        });
    }

    // Download repository data from database if still not downloaded AND database exists
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

    // Anything to run if the repositories were downloaded
    if (allRepositories) {
        if (loadLanguages) {
            // Download language data from GitHub if database doesn't exist OR stored data is stale
            if (!databaseExists || now - lastLanguagesUpdate.epoch >= LANGUAGE_REFRESH) {
                await lookupLanguages(allRepositories, (data) => {
                    if (!data) return;
                    allLanguages = data;
                    languagesUpdated = true;
                });
            }

            // Download language data from database if still not downloaded AND database exists
            if (!allLanguages && databaseExists) {
                await getTable<Language>("github_languages", (data) => {
                    if (!data) return;
                    allLanguages = {};
                    data.forEach((row) => {
                        allLanguages![row.language] = row.bytes;
                    });
                });
            }
        }

        publicRepositories = allRepositories.filter((repo) => repo.visibility === "public");
        console.log(`📃 Updated repositories. ${publicRepositories.length}/${allRepositories.length} repositories will be exposed.`);
    }

    // Anything to run before updating the contents of the database
    presync?.();

    // Updating the database
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

    if (languagesUpdated && allLanguages) {
        const converted: Language[] = [];
        for (const name in allLanguages) {
            converted.push({
                language: name,
                bytes: allLanguages[name] || 0,
            });
        }
        await clearTable("github_languages", async (cleared) => {
            if (!cleared) return;
            await pushTable<Language>("github_languages", converted, async (pushed) => {
                if (!pushed) return;
                lastLanguagesUpdate.epoch = now;
                await pushTable("github_last_update", [lastLanguagesUpdate]);
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

    app.get("/api/repositories/languages", async (req, res) => {
        console.log(`<<< Received [/api/repositories/languages] ping from ${req.ip}.`);

        res.setHeader("Content-Type", "application/json");

        await syncData(
            supabase !== undefined,
            () => {
                if (!allLanguages) {
                    return res.sendStatus(403);
                }

                res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
                res.send(JSON.stringify(allLanguages));
            },
            true,
        );
    });
};
