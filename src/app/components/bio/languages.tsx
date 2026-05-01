"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useRetryEffect } from "@/app/hooks/retry";
import { getLanguages } from "@/utils/client-http-helpers";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Legend, Tooltip, Chart as ChartJS, ChartData } from "chart.js";
import { GITHUB_LANGUAGE_SIZE } from "@/utils/environment";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";
import gsap from "gsap";
import { InsetDiv, PopupDiv } from "../reusable/div-presets";
import { useIsInView } from "@/app/hooks/view";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Languages() {
  const [languages, setLanguages] = useState<LanguageMetadata[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);

  useRetryEffect(
    async () => {
      const data = await getLanguages();
      if (data) {
        setLanguages(data.sort((a, b) => b.bytes - a.bytes).slice(0, GITHUB_LANGUAGE_SIZE));
      }
      return data !== undefined;
    },
    1000,
    [],
    "bio-languages",
  );

  useGSAP(() => {
    const split = new SplitText(heading.current, {
      type: "words, chars",
    });

    gsap.fromTo(
      split.chars,
      {
        opacity: 0,
        y: "-1rem",
      },
      {
        scrollTrigger: heading.current,
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.05,
        ease: "power2.inOut",
        onComplete: () => split.revert(),
      },
    );

    return () => split.revert();
  }, []);

  return (
    <InsetDiv className="rounded-2xl w-full p-5 overflow-clip flex flex-row justify-center items-center gap-5">
      <PopupDiv className="flex flex-col justify-center items-center gap-5 p-5 rounded-2xl">
        <h2 ref={heading}>{`Top ${GITHUB_LANGUAGE_SIZE} Languages`}</h2>
        <LanguageChart pieValues={languages} />
      </PopupDiv>
    </InsetDiv>
  );
}

type BioChartProps = DivAttributes & {
  pieValues: LanguageMetadata[];
};

const LanguageChart = forwardRef<HTMLDivElement, BioChartProps>(({ pieValues }, forwardedRef) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<"doughnut">>(null);
  const [data, setData] = useState<ChartData<"doughnut"> | undefined>(undefined);
  const [isInView, setIsInView] = useState(false);

  const [createIsInView, cleanupIsInView] = useIsInView((view) => setIsInView(view), containerRef);

  useEffect(() => {
    let totalBytes = 0;
    pieValues.forEach((lang) => (totalBytes += lang.bytes));
    setData({
      labels: pieValues.map((entry) => entry.language),
      datasets: [
        {
          label: "%",
          data: pieValues.map((entry) => (entry.bytes / totalBytes) * 100),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [pieValues]);

  useEffect(() => {
    createIsInView();
    return cleanupIsInView;
  }, []);

  useEffect(() => {
    if (!chartRef.current || !isInView) return;
    chartRef.current.reset();
    chartRef.current.update();
  }, [isInView]);

  return (
    <div
      ref={(node) => bindRefAndForwardRef(node, forwardedRef, containerRef)}
      className={`flex flex-col justify-center items-center`}
    >
      {data !== undefined && (
        <Doughnut
          ref={chartRef}
          data={data}
          redraw={true}
          options={{
            animation: {
              duration: 2500,
            },

            plugins: {
              legend: {
                labels: {
                  color: "var(--gray-900)",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
});
