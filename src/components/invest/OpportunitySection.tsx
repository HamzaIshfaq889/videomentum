const opportunities = [
  {
    number: "01",
    title: "A platform built for scale",
    body: "Videomentum's multi-theatre model creates multiple revenue streams from a single platform — content distribution, creator credits, and audience monetisation all under one roof.",
  },
  {
    number: "02",
    title: "Underserved market, massive upside",
    body: "Global by design. Connected by values. Driven by equity. We operate without borders or centers, rooted in mutual respect for every culture we touch.",
  },
  {
    number: "03",
    title: "Built by people, not algorithms",
    body: "Every decision on this platform is made with creators and viewers in mind. That philosophy drives retention, loyalty, and long-term platform value that ad-driven platforms can’t replicate.",
  },
];

export const OpportunitySection = () => {
  return (
    <section className="w-full bg-[#0E0E10] px-6 py-16">
      <div className="mx-auto px-6">
        <p className="mb-2 font-figtree text-[11px] font-semibold tracking-[2px] text-[#FCFCFCB2] uppercase">
          The opportunity
        </p>
        <h2 className="mb-8 font-bebas text-[40px] font-normal leading-[1] tracking-[0.35px] text-white sm:text-[48px] md:text-[56px]">
          WHY INVEST IN VIDEOMENTUM?
        </h2>

        <div className="rounded-[18px] bg-[#111111] px-6 py-8">
          <div className="flex flex-col items-stretch gap-8 sm:flex-row sm:gap-10">
            {opportunities.map((item, idx) => (
              <div
                key={item.number}
                className="flex h-full flex-1 flex-col justify-center gap-3 border-t border-[#9999994D] pt-6 sm:border-t-0 sm:border-l sm:border-l-[#9999994D] sm:pl-8 sm:pt-0 first:border-none first:pt-0 first:pl-0"
              >
                <div className="font-bebas text-[64px] leading-[64px] tracking-[0.35px] text-[#A80B0933]">
                  {item.number}
                </div>
                <h3 className="font-figtree text-[20px] font-bold leading-[28px] tracking-[0.35px] text-white">
                  {item.title}
                </h3>
                <p className="font-figtree text-[18px] font-normal leading-[24px] tracking-[-0.31px] text-[#999999]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
