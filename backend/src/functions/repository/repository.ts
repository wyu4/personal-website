import { Config, Context } from "@netlify/functions";
import { repositoriesFunction } from "../../api/repository";
import { getCORSHeaders } from "../../helpers/external";

export const config: Config = {
    path: "/api/repositories",
};

export default async (req: Request, context: Context) => {
    console.log(`<<< Received ping for '${config.path}' from [${context.ip}]`);
    const data = await repositoriesFunction();
    const cors = getCORSHeaders(req.headers.get("origin") || "");
    if (!data) {
        return Response.json("[]", {
            headers: cors,
            status: 403,
            statusText: "Server failed to load repository data.",
        });
    }
    return Response.json(data, {
        headers: cors,
    });
};
