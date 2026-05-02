import Bio from "./components/bio/bio";
import Banner from "./components/title/banner";
import TopBar from "./components/top/top-bar";

export default function Home() {
  return (
    <>
      <TopBar />
      <Banner />
      <Bio />
    </>
  );
}
