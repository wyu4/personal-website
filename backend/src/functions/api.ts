import { Config, Context } from "@netlify/functions";

export const config: Config = {
    path: "/api",
};

export default async (req: Request, context: Context) => {
    return new Response("The backend service is currently up.");
};
