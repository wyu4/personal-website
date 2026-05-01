import { completeRepositories, createSupabase, getTable } from "@/utils/github";
import { createCacheHeaders } from "@/utils/client-http-helpers";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET() {
  const client = createSupabase();
  if (!client) {
    return NextResponse.json("Failed to get database.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const [allRepositories, owners] = await Promise.all([
    getTable(client, "github_repository") as Promise<SimplifiedRepository[] | undefined>,
    getTable(client, "github_repository_owners") as Promise<Owner[] | undefined>,
  ]);

  if (!allRepositories || !owners) {
    return NextResponse.json("Failed to connect/read database.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const publishable = allRepositories.filter((repo) => repo.visibility === "public");

  return NextResponse.json(completeRepositories(publishable, owners), {
    headers: createCacheHeaders(),
  });
}
