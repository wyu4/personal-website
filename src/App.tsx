import Bio from "./components/Bio";
import RepositoryGallery from "./components/RepositoryGallery";
import TitleBanner from "./components/TitleBanner";

const App = () => {
    return (
        <>
            <div className="background">
                <TitleBanner></TitleBanner>
                <RepositoryGallery className="in-title fade-in-on-load" autoScroll={true} style={{animationDelay: `0.5s`}}></RepositoryGallery>
                <Bio></Bio>
            </div>
        </>
    );
};

export default App;
