import { GITHUB_LANGUAGE_SIZE } from "@/utils/environment";
import PageComponent from "./components/PageComponent";
import { languageAPI, repositoryAPI } from "@/utils/server-http-helpers";

export default async function Home() {
  const repositoriesResponse = await repositoryAPI();
  const languagesResponse = await languageAPI();

  return (
    <PageComponent
      repositories={repositoriesResponse.body}
      languages={languagesResponse.body?.slice(0, GITHUB_LANGUAGE_SIZE)}
    />
  );
}
