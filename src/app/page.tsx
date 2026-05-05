import Bio from "./components/bio/bio";
import Banner from "./components/title/banner";
import TopBar from "./components/top/top-bar";
import { repositoryAPI } from "@/utils/server-http-helpers";

export default async function Home() {
  const repositoriesResponse = await repositoryAPI();
  if (repositoriesResponse && repositoriesResponse.ok) {
    console.log("Fetched repository data before feeding website");
  }
  return (
    <>
      <TopBar />
      <Banner
        repositories={
          repositoriesResponse && repositoriesResponse.ok
            ? ((await repositoriesResponse.json()) as Repository[])
            : undefined
        }
      />
      <Bio />
    </>
  );
}
