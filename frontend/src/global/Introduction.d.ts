declare type IntroductionProps = {
    repositories: Repository[] | undefined;
};

declare type RepositoryCarouselProps = DivAttributes &
    IntroductionProps & {
        secondsPerCard: number;
        inverted: boolean;
    };
