import {
    DATABASE_URL,
    DATABASE_KEY,
    canConnectToDatabase,
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
    description?: string;
    fork: boolean;
    archived: boolean;
    languages_url: string;
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
 * @param callback Callback to pass the data once received
 * @return Promise for database query, or resolved promise if an error occurs before the query starts
 */
export const getTable = <T>(
    name: Table,
    callback: (data: T[] | null) => void,
) => {
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
        return Promise.resolve();
    }
};
