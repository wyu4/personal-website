declare type IntroductionProps = {
    repositories: Repository[] | undefined;
};

declare type RepositoryCarouselProps = DivAttributes &
    IntroductionProps & {
        secondsPerPixel: number;
    };
