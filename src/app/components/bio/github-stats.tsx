"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useRetryEffect } from "@/app/hooks/retry";
import { getLanguages } from "@/utils/client-http-helpers";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Legend, Tooltip, Chart as ChartJS, ChartData } from "chart.js";
import { GITHUB_LANGUAGE_SIZE } from "@/utils/environment";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import gsap from "gsap";
import { InsetDiv, PopupDiv } from "../reusable/div-presets";
import { useIsInView } from "@/app/hooks/view";
import Contributions from "./github-contributions";
import { getVar } from "@/utils/style-helpers";
import { useRootClassEffect } from "@/app/hooks/misc";

ChartJS.register(ArcElement, Tooltip, Legend);

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".stat-card",
        {
          opacity: 0,
          y: "2rem",
        },
        {
          scrollTrigger: container.current,
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.5,
          ease: "power2.inOut",
        },
      );
    },
    {
      dependencies: [],
      scope: container,
    },
  );

  return (
    <InsetDiv
      ref={container}
      className="rounded-2xl w-full p-5 overflow-clip grid grid-cols-1 lg:grid-cols-2 justify-center items-center gap-5"
    >
      <StatCard headingText={`Top ${GITHUB_LANGUAGE_SIZE} Languages`}>
        <LanguageChart />
      </StatCard>
      <StatCard headingText="GitHub Contributions">
        <Contributions />
      </StatCard>
    </InsetDiv>
  );
}

const StatCard = forwardRef<
  HTMLDivElement,
  DivAttributes & {
    headingText: string;
    headingDelay?: number;
  }
>(({ children, headingText, className, headingDelay }, ref) => {
  const heading = useRef<HTMLHeadingElement>(null);

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
        delay: headingDelay,
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
    <PopupDiv
      ref={ref}
      className={`stat-card relative h-full flex flex-col justify-start items-center gap-5 p-5 rounded-2xl bg-gray-150 ${className}`}
    >
      <h2 ref={heading}>{headingText}</h2>
      {children}
    </PopupDiv>
  );
});

const LanguageChart = forwardRef<HTMLDivElement, DivAttributes>(({}, forwardedRef) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartJS<"doughnut">>(null);
  const [data, setData] = useState<ChartData<"doughnut"> | undefined>(undefined);
  const [isInView, setIsInView] = useState(false);
  const rootClasses = useRootClassEffect();
  const [textColor, setTextColor] = useState("var(--gray-900)");

  const [languages, setLanguages] = useState<LanguageMetadata[]>([]);

  useRetryEffect(
    async () => {
      const data = await getLanguages();
      if (data) {
        setLanguages(
          data.sort((a, b) => b.bytes - a.bytes).slice(0, GITHUB_LANGUAGE_SIZE),
        );
      }
      return data !== undefined;
    },
    5000,
    [],
    "bio-languages",
  );

  const [createIsInView, cleanupIsInView] = useIsInView(
    (view) => setIsInView(view),
    containerRef,
  );

  useEffect(() => {
    let totalBytes = 0;
    languages.forEach((lang) => (totalBytes += lang.bytes));

    setData({
      labels: languages.map((entry) => entry.language),
      datasets: [
        {
          label: "%",
          data: languages.map((entry) => +((entry.bytes / totalBytes) * 100).toFixed(2)),
          backgroundColor: [
            getVar("--chart-1"),
            getVar("--chart-2"),
            getVar("--chart-3"),
            getVar("--chart-4"),
            getVar("--chart-5"),
            getVar("--chart-6"),
          ],
          borderColor: [
            getVar("--chart-1-border"),
            getVar("--chart-2-border"),
            getVar("--chart-3-border"),
            getVar("--chart-4-border"),
            getVar("--chart-5-border"),
            getVar("--chart-6-border"),
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [languages, rootClasses]);

  useEffect(() => {
    createIsInView();
    return cleanupIsInView;
  }, []);

  useEffect(() => {
    if (!chartRef.current || !isInView) return;
    chartRef.current.reset();
    chartRef.current.update();
  }, [isInView]);

  useEffect(() => setTextColor(getVar("--gray-900")), [rootClasses]);

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
                  color: textColor,
                },
              },
            },
          }}
        />
      )}
    </div>
  );
});
