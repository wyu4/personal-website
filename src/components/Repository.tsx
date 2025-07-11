import Button from "./Button";

export type RepositoryData = {
    full_name: string;
    html_url: string;
    owner: {
        avatar_url: string;
    };
    description: string;
};

export default function Repository(args: RepositoryData) {
    return (
        <Button className="repository" href={args.html_url}>
            <h2 id="title">{args.full_name}</h2>
            <p id="desc">{args.description}</p>
            <img id="icon" src={args.owner.avatar_url} draggable="false"></img>
        </Button>
    );
}
