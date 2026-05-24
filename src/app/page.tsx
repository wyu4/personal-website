import { GITHUB_LANGUAGE_SIZE, PROJECTS_MAINTENANCE } from "@/utils/environment";
import PageComponent from "./components/PageComponent";
import { languageAPI, repositoryAPI } from "@/utils/server-http-helpers";

export default async function Home() {
  const repositoriesResponse = await repositoryAPI();
  const languagesResponse = await languageAPI();

  return (
    <PageComponent
      repositories={repositoriesResponse.body}
      languages={languagesResponse.body}
      projectsMaintenance={PROJECTS_MAINTENANCE}
    />
  );
}
