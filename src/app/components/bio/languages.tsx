import { forwardRef, useEffect, useRef, useState } from "react";
import InsetDiv from "../reusable/inset-div";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { pieArcClasses, pieArcLabelClasses, PieChart } from "@mui/x-charts";

export default function Languages() {
  const [languages, setLanguages] = useState<Map<string, number>>(new Map<string, number>());

  return (
    <InsetDiv>
      <LanguageChart chartWidth={100} pieValues={undefined} />
    </InsetDiv>
  );
}

type ChartData = {
  id: number;
  value: number;
  label: string;
};

type BioChartProps = DivAttributes & {
  chartWidth: number;
  pieValues: ChartData[] | undefined;
};

const LanguageChart = forwardRef<HTMLDivElement, BioChartProps>(
  ({ pieValues, chartWidth, className }, forwardedRef) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [renderedPieValues, setRenderedPieValues] = useState<ChartData[]>([]);

    useEffect(() => {
      setRenderedPieValues([]);
      if (!pieValues) return;
      let currentIndex = 1;
      let interval: NodeJS.Timeout | undefined = undefined;
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
        ref={(node) => bindRefAndForwardRef(node, forwardedRef, containerRef)}
        className={`${className} border rounded-2xl border-slate-400 bg-black flex flex-col justify-center items-center p-3`}
      >
        {renderedPieValues && (
          <PieChart
            series={[
              {
                data: pieValues ?? [],
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
