import ContactSpan from "./ContactSpan";
import RepositoryGallery from "./RepositoryGallery";

export default function TitleBanner() {
    return (
        <section className="title">
            <h1 className="heavy fade-in-on-load">Wilson Yu</h1>
            <ContactSpan></ContactSpan>
            <br></br>
            <RepositoryGallery></RepositoryGallery>
        </section>
    );
}
