declare type BioProps = DivAttributes & {
    languages: Record<string, number> | undefined;
    bioMounted?: boolean;
};

declare type LanguageDataProp = {
    id: number;
    value: number;
    label: string;
};

declare type BioChartProps = DivAttributes & {
    chartWidth: number;
    pieValues: LanguageDataProp[] | undefined;
};
