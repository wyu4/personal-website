import {
    DATABASE_URL,
    DATABASE_KEY,
    canConnectToDatabase,
} from "./environment";

import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | undefined = undefined;

/**
 * Creates a Supabase instance, if not already created.
 * @returns New Supabase instance, the previously created one, or `undefined`.
 */
export const createSupabase = () => {
    if (client) {
        return client;
    }

    if (canConnectToDatabase()) {
        client = createClient(DATABASE_URL!, DATABASE_KEY!);
    }

    return client;
};
