declare type IntroductionProps = ScrollControllerProps & {
    repositories: Repository[] | undefined;
    languages: GithubLanguages | undefined;
};

declare type RepositoryCarouselProps = DivAttributes & {
    repositories: Repository[] | undefined;
    secondsPerCard: number;
    inverted: boolean;
};
