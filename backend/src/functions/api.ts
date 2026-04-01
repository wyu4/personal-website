import { Config, Context } from "@netlify/functions";
import { getCORSHeaders } from "../helpers/external";

export const config: Config = {
    path: "/api",
};

export default async (req: Request, context: Context) => {
    const cors = getCORSHeaders(req.headers.get("origin") || "");
    return new Response("The backend service is currently up.", { headers: cors });
};
