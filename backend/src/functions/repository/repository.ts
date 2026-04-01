import { Config, Context } from "@netlify/functions";
import { repositoriesFunction } from "../../api/repository";

export const config: Config = {
    path: "/api/repositories",
};

export default async (req: Request, context: Context) => {
    console.log(`<<< Received ping for '${config.path}' from [${context.ip}]`);
    const data = await repositoriesFunction();
    if (!data) {
        return Response.json("[]", {
            status: 403,
            statusText: "Server failed to load repository data.",
        });
    }
    return Response.json(data);
};
