declare type RepositoryOwner = {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
};

declare type Repository = {
    name: string;
    html_url: string;
    owner: RepositoryOwner;
    description: string;
    fork: boolean;
    archived: boolean;
};

declare type RepositoryCardProps = DivAttributes & {
    repository: Repository | undefined;
    characterLimit?: number;
};

declare type RepositoryTagProps = DivAttributes & {
    text: string;
};
