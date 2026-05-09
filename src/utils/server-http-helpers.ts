"use server";

import { NextResponse } from "next/server";
import { completeRepositories, createSupabase, getTable } from "./github";
import { StatusCodes } from "http-status-codes";
import { createCacheHeaders } from "./client-http-helpers";

type ResponseMetadata<T> = {
  statusMessage?: string;
  status: number;
  body?: T;
};

export async function repositoryAPI(): Promise<ResponseMetadata<Repository[]>> {
  const client = createSupabase();
  if (!client) {
    return {
      statusMessage: "Failed to get database.",
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  const [allRepositories, owners] = await Promise.all([
    getTable(client, "github_repository") as Promise<SimplifiedRepository[] | undefined>,
    getTable(client, "github_repository_owners") as Promise<Owner[] | undefined>,
  ]);

  if (!allRepositories || !owners) {
    return {
      statusMessage: "Failed to connect/read database.",
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  const publishable = allRepositories.filter((repo) => repo.visibility === "public");
  return {
    status: StatusCodes.OK,
    body: completeRepositories(publishable, owners),
  };
}

export async function languageAPI(): Promise<ResponseMetadata<LanguageMetadata[]>> {
  const client = createSupabase();
  if (!client) {
    return {
      statusMessage: "Failed to get database.",
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  const languages = await (getTable(client, "github_languages") as Promise<
    LanguageMetadata[] | undefined
  >);

  if (!languages) {
    return {
      statusMessage: "Failed to connect/read database.",
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  // const publishable: Record<string, number> = {};

  // languages.forEach((metadata) => (publishable[metadata.language] = metadata.bytes));

  return {
    status: StatusCodes.OK,
    body: languages,
  };
}

export async function responseMetadataToResponse<T>(metadata: ResponseMetadata<T>) {
  if (metadata.status === StatusCodes.OK) {
    return NextResponse.json(metadata.body, {
      headers: createCacheHeaders(),
    });
  }
  return NextResponse.json(metadata.statusMessage, {
    headers: createCacheHeaders(),
    status: metadata.status,
    statusText: metadata.statusMessage,
  });
}
