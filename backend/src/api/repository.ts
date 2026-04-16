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

type SyncType = "None" | "All";

const syncData = async (databaseExists: boolean, presync?: () => void, syncType: SyncType = "None") => {
    const now = sec(); // Store current time in seconds

    // Get the last time anything was updated
    if (syncType === "All") {
        await getTable<LastUpdate>("github_last_update", (data) => {
            if (!data) return;
            lastUpdate = data;
        });
    }

    let lastRepositoriesUpdate = lastUpdate.find((row) => row.scope === "repositories") || { scope: "repositories", epoch: 0 };
    let lastLanguagesUpdate = lastUpdate.find((row) => row.scope === "languages") || { scope: "languages", epoch: 0 };
    let repositoriesUpdated = false;
    let languagesUpdated = false;

    // Download repository data from GitHub if database doesn't exist OR stored data is stale
    if (!databaseExists || (syncType === "All" && now - lastRepositoriesUpdate.epoch >= REPOSITORY_REFRESH)) {
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
        // Download language data from GitHub if database doesn't exist OR stored data is stale
        if (!databaseExists || (syncType === "All" && now - lastLanguagesUpdate.epoch >= LANGUAGE_REFRESH)) {
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

        publicRepositories = allRepositories.filter((repo) => repo.visibility === "public");
        console.log(`📃 Updated repositories. ${publicRepositories.length}/${allRepositories.length} repositories will be exposed.`);
    }

    // Anything to run before updating the contents of the database
    presync?.();

    // Updating the database
    if (repositoriesUpdated && allRepositories && syncType === "All") {
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

    if (languagesUpdated && allLanguages && syncType === "All") {
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

    return [publicRepositories, allLanguages];
};

export const repositoriesFunction = async (callback?: (data: Repository[] | null) => void, prerun?: () => void) => {
    const supabase = createSupabase();
    prerun?.();

    await syncData(supabase !== undefined, () => {
        if (!publicRepositories) {
            return callback?.(null);
        }

        callback?.(publicRepositories);
    });

    return publicRepositories;
};

export const languageFunction = async (callback?: (data: Record<string, number> | null) => void, prerun?: () => void) => {
    const supabase = createSupabase();
    prerun?.();

    await syncData(supabase !== undefined, () => {
        if (!allLanguages) {
            return callback?.(null);
        }
        callback?.(allLanguages);
    });

    return allLanguages;
};

export const syncFunction = async () => {
    console.log("Syncing data...");
    const supabase = createSupabase();
    await syncData(supabase !== undefined, undefined, "All");
    return supabase !== undefined && allLanguages !== undefined && allRepositories !== undefined;
};

let syncInterval: NodeJS.Timeout | undefined = undefined;
export const createRepositoriesAPI = (app: Express) => {
    app.get("/api/repositories", async (req, res) => {
        console.log(`<<< Received [/api/repositories] ping from ${req.ip}.`);
        res.setHeader("Content-Type", "application/json");
        await repositoriesFunction((data) => {
            if (!data) {
                return res.sendStatus(403);
            }

            res.send(JSON.stringify(data));
        });
    });

    app.get("/api/repositories/languages", async (req, res) => {
        console.log(`<<< Received [/api/repositories/languages] ping from ${req.ip}.`);
        res.setHeader("Content-Type", "application/json");
        await languageFunction((data) => {
            if (!data) {
                return res.send(403);
            }
            res.send(JSON.stringify(allLanguages));
        });
    });

    clearInterval(syncInterval);
    syncInterval = setInterval(syncFunction, 60 * 60 * 1000);
    syncFunction();
};
