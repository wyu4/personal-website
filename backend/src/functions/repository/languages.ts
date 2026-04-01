import { Config, Context } from "@netlify/functions";
import { languageFunction } from "../../api/repository";
import { getCORSHeaders } from "../../helpers/external";

export const config: Config = {
    path: "/api/languages",
};

export default async (req: Request, context: Context) => {
    console.log(`<<< Received ping for '${config.path}' from [${context.ip}]`);
    const cors = getCORSHeaders(req.headers.get("origin") || "");
    const data = await languageFunction();
    if (!data) {
        return Response.json("{}", {
            headers: cors,
            status: 403,
            statusText: "Server failed to load language data.",
        });
    }
    return Response.json(data, { headers: cors });
};
