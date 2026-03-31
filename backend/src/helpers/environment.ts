export const REPOSITORY_REFRESH: number = +(process.env.REPOSITORY_REFRESH || 1800);
export const LANGUAGE_REFRESH: number = +(process.env.LANGUAGE_REFRESH || 3600);
export const GITHUB_LOGIN: string = process.env.GITHUB_LOGIN || "wyu4";
export const GITHUB_API_KEY: string | undefined = process.env.GITHUB_API_KEY;
export const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
export const DATABASE_KEY: string | undefined = process.env.DATABASE_KEY;

/**
 * Method that checks if an instance of the database can be created.
 * @returns `true` if database can be connected to, else `false`.
 */
export const canConnectToDatabase = () => {
    return DATABASE_URL !== undefined && DATABASE_KEY !== undefined;
};

/**
 * Method that creates headers with the correct `content-type` tag and `authentication` tag if applicable
 * @returns API request headers
 */
export const createGithubHeader = (): HeadersInit => {
    if (GITHUB_API_KEY) {
        return {
            Authorization: `Bearer ${GITHUB_API_KEY}`,
            "X-GitHub-Api-Version": "2026-03-10",
            "content-type": "application/json",
        };
    }
    return {
        "X-GitHub-Api-Version": "2026-03-10",
        "content-type": "application/json",
    };
};
