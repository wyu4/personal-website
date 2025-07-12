import RepositoryGallery from "./components/RepositoryGallery";
import TitleBanner from "./components/TitleBanner";

const App = () => {
    return (
        <>
            <div className="background">
                <TitleBanner></TitleBanner>
                <RepositoryGallery className="in-title"></RepositoryGallery>
            </div>
        </>
    );
};

export default App;
