import { useRetryEffect } from "@/app/hooks/retry";
import { getContributions } from "@/utils/client-http-helpers";
import { bindRefAndForwardRef } from "@/utils/ref-helpers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { forwardRef, useRef, useState } from "react";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type MonthlyContributions = {
  year: number;
  month: (typeof MONTH_NAMES)[number];
  dailyContributionLevels: number[];
};
const Contributions = forwardRef<HTMLDivElement, DivAttributes>(({ className }, forwardedRef) => {
  const container = useRef<HTMLDivElement>(null);
  const [contributions, setContributions] = useState<MonthlyContributions[]>([]);

  const extractMonthFromContribution = (contribution: GithubContribution) => {
    const [year, month] = contribution.date.split("-").map(Number);
    const clampedMonth = Math.max(0, Math.min(month, MONTH_NAMES.length)) - 1;

    return {
      year: year,
      month: MONTH_NAMES[clampedMonth],
    };
  };

  const processContributions = (response: GithubContributionAPIResponse) => {
    const processed: MonthlyContributions[] = [];
    let current: MonthlyContributions | undefined = undefined;

    for (const contribution of response.contributions) {
      const { year, month } = extractMonthFromContribution(contribution);

      if (current && (current.year !== year || current.month !== month)) {
        current.dailyContributionLevels.push(contribution.level);
        processed.push(current);
        current = undefined;
      }
      if (!current) {
        current = {
          year: year,
          month: month,
          dailyContributionLevels: [],
        };
      }

      current.dailyContributionLevels.push(contribution.level);
    }
    if (current) processed.push(current);

    setContributions(processed);
  };

  useRetryEffect(
    async () => {
      const data = await getContributions();
      if (data) {
        processContributions(data);
      }
      return data !== undefined;
    },
    5000,
    [],
    "bio-contributions",
  );

  useGSAP(
    () => {
      if (contributions.length === 0) return;
      gsap.fromTo(
        ".month",
        { opacity: 0 },
        {
          scrollTrigger: container.current,
          delay: 0.5,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
          stagger: {
            each: 0.1,
            from: "random",
          },
        },
      );
    },
    {
      dependencies: [contributions],
      scope: container,
    },
  );

  return (
    <div
      ref={(node) => bindRefAndForwardRef(node, forwardedRef, container)}
      className={`flex flex-row justify-center items-start flex-wrap md:grid md:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {contributions.map((data) => (
        <MonthPanel key={`${data.year}-${data.month}`} data={data} />
      ))}
    </div>
  );
});

export default Contributions;

type MonthPanelProps = {
  data: MonthlyContributions;
};
function MonthPanel({ data }: MonthPanelProps) {
  return (
    <div className="month flex flex-col flex-nowrap items-center justify-start gap-1 p-1 opacity-0">
      <h3 className="select-none">{data.month}</h3>
      <div className="relative grid grid-cols-7 gap-1">
        {data.dailyContributionLevels.map((level, i) => (
          <Day key={`${data.year}-${data.month}-${i}`} level={level} />
        ))}
      </div>
    </div>
  );
}

type DayProps = {
  level: number;
};
function Day({ level }: DayProps) {
  const clampedLevel = Math.max(0, Math.min(level, 4));
  const color = clampedLevel === 0 ? "var(--gray-300)" : `var(--green-${9 - clampedLevel}00)`;
  return (
    <div
      className="aspect-square w-2 rounded-xs"
      style={{
        backgroundColor: color,
      }}
    />
  );
}
