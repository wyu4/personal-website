import { createSupabase, getTable } from "@/utils/github";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET() {
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

  const publishable: Record<string, number> = {};

  languages.forEach(
    (metadata) => (publishable[metadata.language] = metadata.bytes),
  );

  return NextResponse.json(publishable);
}
