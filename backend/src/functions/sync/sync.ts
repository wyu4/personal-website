import { Config, Context } from "@netlify/functions";
import { syncFunction } from "../../api/repository";

export const config: Config = {
    schedule: "@hourly",
};

export default async (req: Request, context: Context) => {
    console.log(`<<< Received ping for '${config.path}' from [${context.ip}]`);
    const data = await syncFunction();
    if (!data) {
        return new Response("Failed to sync data.", {
            status: 403,
            statusText: "Server failed to load repository data.",
        });
    }
    return new Response("Data successfully synced!");
};
