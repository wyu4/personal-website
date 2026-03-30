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
