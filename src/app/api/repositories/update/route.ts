import {
  createSupabase,
  lookupRepositories,
  overwriteTable,
  pushTable,
  simplifyRepositories,
  timedCache,
} from "@/utils/github";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET() {
  const client = createSupabase();
  if (!client) {
    return NextResponse.json("Failed to get database.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const syncJob = async () => {
    const repositories = await lookupRepositories();
    if (!repositories) throw Error("Repository lookup failed.");

    const simplifiedResults = simplifyRepositories(repositories);
    const ownerSuccess = await pushTable(
      client,
      "github_repository_owners",
      simplifiedResults.owners,
    );
    if (!ownerSuccess)
      throw Error("Something went wrong while pushing to the owner table.");

    const tableSuccess = await overwriteTable(
      client,
      "github_repository",
      simplifiedResults.simplified,
    );
    if (!tableSuccess)
      throw Error("Something went wrong while overwriting the repository table.");
  };

  const error = await timedCache(client, "github_repository", syncJob);

  if (error) {
    return NextResponse.json(error, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  return NextResponse.json("Cache request sent.");
}
