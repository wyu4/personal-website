import { createClient } from "@supabase/supabase-js";
import {
  createGithubHeader,
  DATABASE_KEY,
  DATABASE_URL,
  GITHUB_API_KEY,
  GITHUB_LOGIN,
  LANGUAGE_REFRESH,
  REPOSITORY_REFRESH,
  THREAD_CAP,
} from "./environment";

type SupabaseType = ReturnType<typeof createClient>;

/**
 * Convert an array of simplified repositories into completed repositories
 * @param simplified Simplified repositories
 * @param owners Owners index
 * @returns Completed repositories
 */
export const completeRepositories = (
  simplified: SimplifiedRepository[],
  owners: Owner[],
) => {
  return simplified.map((repo) => {
    const { order, ...orderlessRepo } = repo;
    const login = orderlessRepo.owner;
    const owner = owners.find((owner) => owner.login === login) || {
      avatar_url: "https://avatars.githubusercontent.com/u/9919?s=200",
      html_url: "https://github.com/",
      login: "???",
      type: "User",
    };
    return { ...orderlessRepo, owner: owner } as Repository;
  });
};

/**
 * Convert an array of completed repositories into simplified repositories and owners
 * @param completed Completed repositories
 * @returns Simplified repositories and owners
 */
export const simplifyRepositories = (
  completed: Repository[],
): RepositorySimplificationResult => {
  let owners: Owner[] = [];

  const simplified = completed.map((repo, i) => {
    const owner = repo.owner;
    owners.push(owner);
    return { ...repo, owner: owner.login, order: i } as SimplifiedRepository;
  });

  owners = owners.filter(
    (item, index, self) => index === self.findIndex((t) => t.login === item.login),
  );

  return { simplified, owners };
};

/**
 * Creates a Supabase instance, if not already created.
 * @returns New Supabase instance, the previously created one, or `undefined`.
 */
export const createSupabase = (): SupabaseType | null => {
  try {
    console.log(`⛃ Creating Supabase instance...`);
    const client: SupabaseType = createClient(DATABASE_URL!, DATABASE_KEY!);
    console.log(`⛃✅ Supabase instance created!`);
    return client;
  } catch (error) {
    console.error(`⛃❌ Could not create Supabase instance:`, error);
    return null;
  }
};

/**
 * Get all rows from a table
 * @param client Supabase instance
 * @param name Name of the table
 * @return `data` in the form of `never` type, otherwise `undefined`
 */
export const getTable = async <T>(client: SupabaseType, name: Table) => {
  console.log(`⛃ Querying table [${name}]...`);
  try {
    const { data, error } = await client.from(name).select("*");
    if (error) {
      throw Error(error.message);
    }
    return data as unknown;
  } catch (error) {
    console.error(`⛃❌ Could not create query to table [${name}]:`, error);
  }
};

/**
 * Clear a table
 * @param client Supabase instance
 * @param name Name of table
 * @returns `true` if table cleared, `false` if an error occurred.
 */
export const clearTable = async (client: SupabaseType, name: Table) => {
  console.log(`⛃ Clearing table [${name}]...`);
  try {
    const { error } = await client.from(name).delete().neq("ctid", "(0,0)");
    if (error) {
      throw Error(error.message);
    }
    console.log(`⛃✅ Cleared table [${name}]...`);
    return true;
  } catch (error) {
    console.error(`⛃❌ Could not clear table [${name}]:`, error);
    return false;
  }
};

/**
 * Push data to a table. Will fail if there is repeating data trying to be pushed.
 * @param client Supabase instance
 * @param name Name of the table
 * @param data Non-repeating data
 * @returns `true` if table updated, `false` if an error occurred.
 */
export const pushTable = async <T>(client: SupabaseType, name: Table, data: T[]) => {
  console.log(`⛃ Pushing to table [${name}]...`);
  try {
    const { error } = await client.from(name).upsert(data as never);
    console.log(`⛃✅ Pushed to table [${name}] and ran callback.`);
    if (error) {
      throw Error(error.message);
    }
    return true;
  } catch (error) {
    console.error(`⛃❌ Could not push to table [${name}]:`, error);
    return false;
  }
};

/**
 * Clear and push data to a table. Will fail if repeating data is being pushed.
 * @param client Supabase instance
 * @param name Name of the table
 * @param data Non-repeating data
 * @returns `true` if table updated, `false` if an error occurred.
 */
export const overwriteTable = async <T>(client: SupabaseType, name: Table, data: T[]) => {
  const cleared = await clearTable(client, name);
  if (!cleared) return false;

  const pushed = await pushTable(client, name, data);
  return pushed;
};

/**
 * Method that searches a user's GitHub repositories using provided credentials
 * @returns Promise for GitHub query
 */
export const lookupRepositories = async () => {
  console.log(`⌨️ Querying GitHub ['${GITHUB_LOGIN}' => repositories]...`);
  try {
    const response = await fetch(
      GITHUB_API_KEY
        ? "https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator"
        : `https://api.github.com/users/${GITHUB_LOGIN}/repos?type=all&sort=updated&per_page=100`,
      {
        method: "GET",
        headers: createGithubHeader(),
      },
    );
    if (!response.ok) {
      throw new Error(`Request code ${response.status} '${response.statusText}'`);
    }
    const parsedResponse = (await response.json()) as Repository[];
    const stripped = parsedResponse.map(
      (repo: Repository) =>
        ({
          archived: repo.archived,
          description: repo.description,
          fork: repo.fork,
          html_url: repo.html_url,
          languages_url: repo.languages_url,
          name: repo.name,
          visibility: repo.visibility,
          owner: {
            avatar_url: repo.owner.avatar_url,
            html_url: repo.owner.html_url,
            login: repo.owner.login,
            type: repo.owner.type,
          },
        }) as Repository,
    );

    console.log(`⌨️✅ Queried GitHub ['${GITHUB_LOGIN}' => repositories].`);

    return stripped;
  } catch (error) {
    console.error(
      `⌨️❌ Could not query to GitHub ['${GITHUB_LOGIN}' => repositories]:`,
      error,
    );
    return undefined;
  }
};

/**
 * Method that sums up bytes of languages used in a list of repositories using provided credentials.
 * @return `Record` with the language name as the key, and the total number of bytes
 */
export const lookupLanguages = async (
  repositories: Repository[] | SimplifiedRepository[],
) => {
  console.log(`🌐 Querying languages from ${repositories.length} repositories...`);
  const headers = createGithubHeader();
  let languages: Record<string, number> = {};
  let indexedRepositories = 0;
  let count = 0;
  let errored = false;

  // Querying all languages in parallel, but in chunks of size THREAD_CAP to not exhaust resources
  for (let i = 0; i < repositories.length; i += THREAD_CAP) {
    const chunk = repositories.slice(i, i + THREAD_CAP);
    await Promise.all(
      chunk.map(async (repository) => {
        try {
          if (errored || repository.name.endsWith("-excluded")) return;
          const response = await fetch(repository.languages_url, {
            method: "GET",
            headers: headers,
          });
          if (!response.ok) {
            throw new Error(`Request code ${response.status} '${response.statusText}'`);
          }
          const parsedJson = (await response.json()) as Record<string, number>;
          for (const name in parsedJson) {
            const value = parsedJson[name] || 0;
            if (!languages[name]) {
              count++;
              languages[name] = value;
            } else {
              languages[name] += value;
            }
          }
          indexedRepositories++;
        } catch (error) {
          errored = true;
          console.error(
            `🌐❌ Could not create query for languages of repository '${repository.name}':`,
            error,
          );
        }
      }),
    );
  }
  if (errored) {
    console.warn(
      `🌐⚠️ Queried & indexed ${count} languages from ${indexedRepositories}/${repositories.length} repositories.`,
    );
  } else {
    console.log(
      `🌐✅ Queried & indexed ${count} languages from ${repositories.length} repositories.`,
    );
  }
  return languages;
};

/**
 * Function that handles updating the cached data in the database
 * @param client Supabase instance
 * @param table Table name
 * @param requestData Function that handles getting real-time data
 * @returns Exposable `string` containing error message, or `undefined` when successful
 */
export const timedCache = async (
  client: SupabaseType,
  table: "github_repository" | "github_languages",
  syncJob: () => Promise<void>,
) => {
  const lastUpdateKey = table === "github_repository" ? "repositories" : "languages";

  console.log(`⌚ Checking time elapsed since caching ${lastUpdateKey}...`);

  // Checking the time since last cache
  const lastUpdates = (await getTable(client, "github_last_update")) as
    | LastUpdate[]
    | undefined;
  let selectedLastUpdate = lastUpdates?.find((row) => row.scope === lastUpdateKey) ?? {
    scope: lastUpdateKey,
    epoch: 0,
  };

  const now = Math.floor(Date.now() / 1000);
  const refreshRateSeconds =
    lastUpdateKey === "repositories" ? REPOSITORY_REFRESH : LANGUAGE_REFRESH;
  const timeElapsed = now - selectedLastUpdate.epoch;

  if (timeElapsed < refreshRateSeconds) {
    const message = `Wait (${new Date((refreshRateSeconds - timeElapsed) * 1000).toISOString().substring(11, 19)}) before updating cached ${lastUpdateKey}.`;
    console.warn(`⌚⚠️ ${message}`);
    return message;
  }
  console.log(`⌚ Verified elapsed time since last ${lastUpdateKey} cache.`);

  // Temporarily flagging as updated
  const cachedLastUpdated = selectedLastUpdate.epoch; // Store the previous last update, in case this current update fails
  selectedLastUpdate.epoch = now; // Update the epoch to flag as updated (for now, so that updates requested during this one block)
  await pushTable(client, "github_last_update", [selectedLastUpdate]);

  try {
    console.error(`⌚ Running cache job for ${lastUpdateKey}...`);
    await syncJob();
    console.error(`⌚✅ Cached new data for ${lastUpdateKey}.`);
  } catch (error) {
    selectedLastUpdate.epoch = cachedLastUpdated;
    await pushTable(client, "github_last_update", [selectedLastUpdate]);
    console.error(`⌚❌ Updating cached ${lastUpdateKey} failed: `, error);
    return "An internal error occurred while syncing cache.";
  }
  return undefined;
};
