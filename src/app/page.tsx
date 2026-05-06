import PageComponent from "./components/PageComponent";
import { repositoryAPI } from "@/utils/server-http-helpers";

export default async function Home() {
  const repositoriesResponse = await repositoryAPI();
  if (repositoriesResponse && repositoriesResponse.ok) {
    console.log("Fetched repository data before feeding website");
  }
  return (
    <PageComponent
      repositories={
        repositoriesResponse && repositoriesResponse.ok
          ? ((await repositoriesResponse.json()) as Repository[])
          : undefined
      }
    />
  );
}
