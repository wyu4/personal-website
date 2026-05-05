import { repositoryAPI } from "@/utils/server-http-helpers";

export async function GET() {
  return await repositoryAPI();
}
