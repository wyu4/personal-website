import RepositoryGallery from "./components/RepositoryGallery";
import TitleBanner from "./components/TitleBanner";

const App = () => {
    return (
        <>
            <div className="background">
                <TitleBanner></TitleBanner>
                <RepositoryGallery className="in-title" autoScroll={true}></RepositoryGallery>
            </div>
        </>
    );
};

export default App;
