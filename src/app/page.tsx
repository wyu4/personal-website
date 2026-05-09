import PageComponent from "./components/PageComponent";
import { languageAPI, repositoryAPI } from "@/utils/server-http-helpers";

export default async function Home() {
  const repositoriesResponse = await repositoryAPI();
  const languagesResponse = await languageAPI();

  return (
    <PageComponent repositories={repositoriesResponse.body} languages={languagesResponse.body} />
  );
}
