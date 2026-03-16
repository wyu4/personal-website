declare type BioProps = DivAttributes & {
    languages: Record<string, number> | undefined;
};

declare type LanguageDataProp = {
    id: number;
    value: number;
    label: string;
};
