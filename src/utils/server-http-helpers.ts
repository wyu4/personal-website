"use server";

import { NextResponse } from "next/server";
import { completeRepositories, createSupabase, getTable } from "./github";
import { StatusCodes } from "http-status-codes";
import { createCacheHeaders } from "./client-http-helpers";

export async function repositoryAPI() {
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

export async function languageAPI() {
  const client = createSupabase();
  if (!client) {
    return NextResponse.json("Failed to get database.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  const languages = await (getTable(client, "github_languages") as Promise<
    LanguageMetadata[] | undefined
  >);

  if (!languages) {
    return NextResponse.json("Failed to connect/read database.", {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  // const publishable: Record<string, number> = {};

  // languages.forEach((metadata) => (publishable[metadata.language] = metadata.bytes));

  return NextResponse.json(languages, { headers: createCacheHeaders() });
}
