import { forwardRef, useEffect, useRef, useState } from "react";
import { bindRefAndForwardRef } from "../utils/RefUtils";
import { PieChart } from "@mui/x-charts";

const Bio = forwardRef<HTMLDivElement, BioProps>(
    ({ className = "", ...props }, forwardedRef) => {
        return (
            <div
                {...props}
                ref={forwardedRef}
                className={`${className} flex flex-col sm:flex-row p-5 gap-1`}
            >
                <div className="chart">
                    <LanguageChart {...props} />
                </div>
                <div className="flex flex-col p-5 gap-3">
                    <h1 className="text-5xl text-left">About Me</h1>
                    <p className="text-4xl text-left">
                        I am a 17 year old living in Canada who codes as a
                        hobby. I'm currently studying in high school, and I plan
                        on going into computer science.
                    </p>
                </div>
            </div>
        );
    },
);

export default Bio;

const LanguageChart = forwardRef<HTMLDivElement, BioProps>(
    ({ languages, className, ...props }, forwardedRef) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const [pieValues, setPieValues] = useState<
            LanguageDataProp[] | undefined
        >(undefined);

        useEffect(() => {
            if (!languages) return;
            var percentage: LanguageDataProp[] = [];

            var id = 0;
            Object.entries(languages).map(([lang, count]) => {
                percentage.push({
                    id: id,
                    label: lang,
                    value: count,
                });
                id += 1;
            });

            console.log(percentage);
            setPieValues(percentage);
        }, [languages]);

        return (
            <div
                ref={(node) =>
                    bindRefAndForwardRef(node, forwardedRef, containerRef)
                }
                className={className}
                {...props}
            >
                {languages && pieValues && (
                    <PieChart
                        series={[
                            {
                                data: pieValues,
                                innerRadius: 30,
                                outerRadius: 100,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                startAngle: 0,
                                endAngle: 360,
                                highlightScope: { fade: 'global', highlight: 'item' },
                            },
                        ]}
                        width={500}
                        height={500}
                    />
                )}
            </div>
        );
    },
);
