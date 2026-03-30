import {
    GITHUB_LOGIN,
    GITHUB_API_KEY,
    DATABASE_URL,
    DATABASE_KEY,
    canConnectToDatabase,
    createGithubHeader,
} from "./environment";

import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | undefined = undefined;

/**
 * Names of different tables
 */
export type Table =
    | "github_last_update"
    | "github_repository"
    | "github_repository_owners";

/**
 * Properties of the owners table
 */
export type Owner = {
    login: string;
    avatar_url: string;
    html_url: string;
    type: "User" | "Organization" | "Bot" | "Mannequin";
};

/**
 * Types of repository visiblity
 */
export type Visibility = "public" | "private";

/**
 * Properties of the repository table
 */
export type SimplifiedRepository = {
    name: string;
    html_url: string;
    owner: string;
    visibility: Visibility;
    description: string | null;
    fork: boolean;
    archived: boolean;
    languages_url: string;
};

/**
 * Properties of GitHub repositories
 */
export type Repository = SimplifiedRepository & {
    owner: Owner;
};

/**
 * Properties of the last update metadata table
 */
export type LastUpdate = {
    scope: "production";
    repositories: number;
    languages: number;
};

/**
 * Method that throws a `ReferenceError` if the client wasn't initialized yet
 */
const checkClient = () => {
    if (!client) {
        throw new ReferenceError("Client has not been initialized.");
    }
};

/**
 * Creates a Supabase instance, if not already created.
 * @returns New Supabase instance, the previously created one, or `undefined`.
 */
export const createSupabase = () => {
    if (client) {
        return client;
    }

    if (canConnectToDatabase()) {
        try {
            console.log(`⛃ Creating Supabase instance...`);
            client = createClient(DATABASE_URL!, DATABASE_KEY!);
            console.log(`⛃✅ Supabase instance created!`);
        } catch (error) {
            console.error(`⛃❌ Could not create Supabase instance:`, error);
        }
    } else {
        console.warn(
            `⛃⚠️ Could not create Supabase instance due to connection flag.`,
        );
    }

    return client;
};

/**
 * Get all rows from a table
 * @param name Name of the table
 * @param callback Callback to pass the data once received. Passes `null` if an error occurs
 * @return Promise for database query
 */
export const getTable = <T>(
    name: Table,
    callback: (data: T[] | null) => void,
): Promise<any> | PromiseLike<any> => {
    console.log(`⛃ Querying table [${name}]...`);
    try {
        checkClient();

        return client!
            .from(name)
            .select("*")
            .then(({ data, error }) => {
                if (error) {
                    console.error(
                        `⛃❌ Query to table [${name}] failed:`,
                        error,
                    );
                    return callback(null);
                }
                callback(data as T[] | null);
                console.log(`⛃✅ Queried table [${name}] and ran callback.`);
            });
    } catch (error) {
        console.error(`⛃❌ Could not create query to table [${name}]:`, error);
        return new Promise(() => callback(null));
    }
};

/**
 * Method that searches a user's GitHub repositories using provided credentials
 * @param callback Callback to pass the data once received. Passes `null` if an error occurs
 * @returns Promise for GitHub query
 */
export const lookupRepositories = (
    callback: (repos: Repository[] | null) => void,
): Promise<any> => {
    console.log(`⌨️ Querying GitHub ['${GITHUB_LOGIN}' => repositories]...`);
    try {
        return fetch(
            GITHUB_API_KEY
                ? "https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator"
                : `https://api.github.com/users/${GITHUB_LOGIN}/repos?type=all&sort=updated&per_page=100`,
            {
                method: "GET",
                headers: createGithubHeader(),
            },
        )
            .then((raw) => raw.json())
            .then((data: Repository[]) => {
                callback(data);
                console.log(
                    `⛃✅ Queried GitHub ['${GITHUB_LOGIN}' => repositories] and ran callback.`,
                );
            })
            .catch((error) => {
                console.error(
                    `⛃❌ Could not query GitHub ['${GITHUB_LOGIN}' => repositories]:`,
                    error,
                );
                callback(null);
            });
    } catch (error) {
        console.error(
            `⛃❌ Could not create query to GitHub ['${GITHUB_LOGIN}' => repositories]:`,
            error,
        );
        return new Promise(() => callback(null));
    }
};
