import ContactSpan from "./ContactSpan";

export default function TitleBanner() {
    return (
        <>
            <section className="title transparent">
                <h1 className="heavy fade-in-on-load">Wilson Yu</h1>
                <ContactSpan fadeIn={true} fadeInDelay={1}></ContactSpan>
            </section>
        </>
    );
}
