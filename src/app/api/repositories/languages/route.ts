import { languageAPI, responseMetadataToResponse } from "@/utils/server-http-helpers";

export async function GET() {
  return await responseMetadataToResponse(await languageAPI());
}
