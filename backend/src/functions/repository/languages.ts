import { Config, Context } from "@netlify/functions";
import { languageFunction } from "../../api/repository";

export const config: Config = {
    path: "/api/repositories/languages",
};

export default async (req: Request, context: Context) => {
    console.log(`<<< Received ping for '${config.path}' from [${context.ip}]`);
    const data = await languageFunction();
    if (!data) {
        return Response.json("{}", {
            status: 403,
            statusText: "Server failed to load language data.",
        });
    }
    return Response.json(data);
};
