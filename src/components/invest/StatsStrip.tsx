 "use client";

import { useEffect, useState } from "react";

type StatConfig = {
  value: number;
  unit: string;
  showPlus: boolean;
  label: string;
  sublabel: string;
  prefix?: string;
};

const stats: StatConfig[] = [
  {
    value: 20,
    unit: "M",
    showPlus: true,
    label: "VIEWS SERVED",
    sublabel: "Across all theatres to date",
  },
  {
    value: 535000,
    unit: "",
    showPlus: true,
    label: "CREATOR PAYOUTS",
    sublabel: "Total paid out to creators",
    prefix: "$",
  },
  {
    value: 2520,
    unit: "",
    showPlus: true,
    label: "ACTIVE CREATORS",
    sublabel: "And growing every month",
  },
  {
    value: 5,
    unit: "",
    showPlus: false,
    label: "MARKETPLACE PATENTS",
    sublabel: "Filed and approved",
  },
];

export const StatsStrip = () => {
  const [counts, setCounts] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(
        stats.map((stat) => Math.round(stat.value * progress)),
      );
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="w-full bg-[#111111] border-y border-[#99999980]">
      <div className="flex w-full flex-col divide-y divide-[#99999980] text-center sm:flex-row sm:divide-y-0 sm:divide-x">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className="flex flex-1 flex-col items-center justify-center px-6 py-6 text-center sm:py-8"
          >
            <div className="font-bebas text-[48px] leading-[1] tracking-[-0.31px] text-center text-white">
              <span>
                {item.prefix ?? ""}
                {counts[index].toLocaleString()}
                {item.unit}
              </span>
              {item.showPlus && (
                <span className="text-[#A80A08]">+</span>
              )}
            </div>
            <div className="mt-2 font-figtree text-[15px] font-medium leading-[24px] tracking-[-0.31px] text-center text-[#FFFFFF]">
              {item.label}
            </div>
            <div className="mt-1 font-figtree text-[15px] font-medium leading-[24px] tracking-[-0.31px] text-center text-[#FFFFFF]">
              {item.sublabel}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

