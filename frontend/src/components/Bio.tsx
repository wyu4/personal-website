import { forwardRef, useEffect, useReducer, useRef, useState } from "react";
import { bindRefAndForwardRef } from "../utils/RefUtils";
import { pieArcClasses, pieArcLabelClasses, PieChart } from "@mui/x-charts";
import { getREMInPixels } from "../utils/TextUtils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useResizeEffect, useScrollEffect } from "../hooks/WindowHooks";

const REM = getREMInPixels();

const Bio = forwardRef<HTMLDivElement, BioProps>(
    (
        { className = "", bioMounted = true, languages, ...props },
        forwardedRef,
    ) => {
        const bioRef = useRef<HTMLDivElement>(null);
        const [chartWidth, setChartWidth] = useState(0);
        const [pieValues, setPieValues] = useState<
            LanguageDataProp[] | undefined
        >(undefined);
        const splitTitle = useRef<SplitText | undefined>(undefined);
        const splitBio = useRef<SplitText | undefined>(undefined);

        useGSAP(
            () => {
                if (!splitTitle.current) {
                    splitTitle.current = new SplitText(".about", {
                        type: "words, chars",
                    });
                }

                if (!splitBio.current) {
                    splitBio.current = new SplitText(".desc", {
                        type: "words, chars",
                    });
                }

                if (!bioMounted) {
                    gsap.to(splitTitle.current.chars, {
                        opacity: 0,
                        duration: 0,
                        overwrite: "auto",
                    });
                    gsap.to(splitBio.current.chars, {
                        opacity: 0,
                        duration: 0,
                        overwrite: "auto",
                    });
                    return;
                }

                const tween = gsap.to(splitTitle.current.chars, {
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.5,
                    delay: 0,
                    overwrite: "auto",
                });
                gsap.to(splitBio.current.chars, {
                    opacity: 1,
                    stagger: 0.01,
                    duration: 0,
                    delay: tween.duration(),
                    overwrite: "auto",
                });
            },
            { scope: bioRef, dependencies: [bioMounted] },
        );

        useResizeEffect((_h, w) => {
            setChartWidth(Math.max(w * 0.25, REM * 20));
        }, []);

        useEffect(() => {
            if (!languages) return;
            let percentage: LanguageDataProp[] = [];

            let id = 0;
            let byteCount = Math.max(
                1,
                Object.values(languages).reduce((sum, n) => sum + n, 0),
            );

            Object.entries(languages).map(([lang, count]) => {
                percentage.push({
                    id: id,
                    label: lang,
                    value: Math.round(((count * 100) / byteCount) * 100) / 100,
                });
                id += 1;
            });

            setPieValues(percentage);
        }, [languages]);

        return (
            <div
                {...props}
                ref={(node) => bindRefAndForwardRef(node, forwardedRef, bioRef)}
                className={`${className} flex flex-col justify-around items-center md:flex-row p-5 gap-5 bg-[#000000aa] border rounded-2xl`}
            >
                <div className="chart">
                    {languages && bioMounted && (
                        <LanguageChart
                            pieValues={pieValues}
                            chartWidth={chartWidth}
                            {...props}
                        />
                    )}
                </div>
                <div className="flex flex-col p-5 gap-3">
                    <h1 className="about sm:text-3xl md:text-5xl text-left">
                        About Me
                    </h1>
                    <p className="desc sm:text-2xl md:text-4xl text-left">
                        I am a 17 year old living in Canada who codes as a
                        hobby. I'm currently studying in high school, and I plan
                        on going into computer science.
                    </p>
                    <p className="desc sm:text-2xl md:text-4xl text-left mt-5">
                        (more coming soon!)
                    </p>
                </div>
            </div>
        );
    },
);

export default Bio;

const LanguageChart = forwardRef<HTMLDivElement, BioChartProps>(
    ({ pieValues, chartWidth, className, ...props }, forwardedRef) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const [renderedPieValues, setRenderedPieValues] = useState<
            LanguageDataProp[]
        >([]);

        useEffect(() => {
            setRenderedPieValues([]);
            if (!pieValues) return;
            let currentIndex = 1;
            let interval: number | undefined = undefined;
            interval = setInterval(() => {
                setRenderedPieValues(pieValues.slice(0, currentIndex));
                currentIndex += 1;
                if (currentIndex > pieValues.length) {
                    clearInterval(interval);
                    interval = undefined;
                }
            }, 100);

            return () => {
                if (!interval) return;
                clearInterval(interval);
            };
        }, [pieValues]);

        return (
            <div
                ref={(node) =>
                    bindRefAndForwardRef(node, forwardedRef, containerRef)
                }
                className={`${className} border rounded-2xl border-slate-400 bg-black flex flex-col justify-center items-center p-3`}
                {...props}
            >
                {renderedPieValues && (
                    <PieChart
                        series={[
                            {
                                data: renderedPieValues,
                                arcLabelMinAngle: 15,
                                sortingValues: "desc",
                                innerRadius: chartWidth / 20,
                                outerRadius: chartWidth / 3,
                                paddingAngle: 2,
                                cornerRadius: 5,
                                startAngle: 0,
                                endAngle: 360,
                                highlightScope: {
                                    fade: "global",
                                    highlight: "item",
                                },
                            },
                        ]}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontWeight: "bold",
                                fill: "#ffffff !important",
                            },
                            [`& .${pieArcClasses.root}`]: {
                                animationDuration: "5s !important",
                            },
                            ["& .MuiChartsLegend-label"]: {
                                color: "#ffffff !important",
                            },
                        }}
                        width={chartWidth}
                        height={chartWidth}
                        slotProps={{
                            legend: {
                                direction: "horizontal",
                                position: {
                                    horizontal: "center",
                                    vertical: "bottom",
                                },
                            },
                        }}
                    />
                )}
            </div>
        );
    },
);
