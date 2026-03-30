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
            authentication: `Bearer ${GITHUB_API_KEY}`,
            "content-type": "application/json",
        };
    }
    return {
        "content-type": "application/json",
    };
};
