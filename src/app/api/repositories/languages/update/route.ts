import { CRON_SECRET } from "@/utils/environment";
import {
  createSupabase,
  getTable,
  lookupLanguages,
  lookupRepositories,
  overwriteTable,
  pushTable,
  simplifyRepositories,
  timedCache,
} from "@/utils/github";
import { createCacheHeaders } from "@/utils/http-helpers";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json("Missing authorization to run this cron job.", {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const client = createSupabase();
  if (!client) {
    return NextResponse.json("Failed to get database.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const syncJob = async () => {
    const repositories = (await getTable(client, "github_repository")) as
      | SimplifiedRepository[]
      | undefined;
    if (!repositories) throw Error("Repositories lookup failed.");

    const languageIndex = await lookupLanguages(repositories);

    const languages: LanguageMetadata[] = [];
    for (const name in languageIndex) {
      languages.push({
        language: name,
        bytes: languageIndex[name] ?? 0,
      });
    }

    const success = await overwriteTable(client, "github_languages", languages);
    if (!success) throw Error("Something went wrong while overwriting the languages table.");
  };

  const error = await timedCache(client, "github_languages", syncJob);

  if (error) {
    return NextResponse.json(error, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json("Cache request sent.", { headers: createCacheHeaders() });
}
