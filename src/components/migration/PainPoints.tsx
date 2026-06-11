"use client";

const painCards = [
  {
    icon: "⚡",
    title: "Demonetization without warning",
    desc: "Your video goes viral and YouTube strips the revenue. No explanation, no recourse.",
  },
  {
    icon: "👻",
    title: "Shadow banning & reduced reach",
    desc: "Your content exists but nobody sees it. The algorithm quietly buries it.",
  },
  {
    icon: "🚫",
    title: "Strikes, bans & account termination",
    desc: "One strike and years of content disappear overnight. No appeal, no warning.",
  },
];

export const PainPoints = () => {
  return (
    <section className="bg-[#0d0d0d] border-t border-b border-[#1e1e1e]">
      <style>{`
        /* Tablet ≤1024px */
        @media (max-width: 1024px) {
          .pain-section-inner { padding: 40px 28px; }
          .pain-grid          { grid-template-columns: 1fr !important; gap: 28px !important; }
        }

        /* Mobile ≤680px */
        @media (max-width: 680px) {
          .pain-section-inner { padding: 36px 16px; }
          .pain-title         { font-size: 30px !important; }
          .pain-desc          { font-size: 13px !important; }
          .pain-card          { padding: 14px 16px !important; }
        }

        /* Small mobile ≤420px */
        @media (max-width: 420px) {
          .pain-title { font-size: 26px !important; }
        }
      `}</style>

      <div className="pain-section-inner px-16 py-14">
        <div className="pain-grid grid grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div>
            <p className="text-[10px] font-bold text-[#A80B09] tracking-[3px] uppercase mb-3">
              Sound Familiar?
            </p>
            <h2
              className="pain-title text-[40px] text-white leading-[1.05] tracking-[0.5px] mb-4"
              style={{ fontFamily: "'Bebas Neue', cursive" }}
            >
              The Platforms You&apos;re On
              <br />
              Are Working Against You
            </h2>
            <p className="pain-desc text-[14px] font-light text-[#cccccc] leading-[1.7]">
              If you&apos;re a creator making content that pushes boundaries, tells
              hard truths, or just doesn&apos;t fit the algorithm — you already know
              what it feels like to be suppressed. Videomentum was built for
              exactly this.
            </p>
          </div>

          {/* Right — Pain Cards */}
          <div className="flex flex-col gap-3">
            {painCards.map((card) => (
              <div
                key={card.title}
                className="pain-card bg-[#111111] border border-[#1e1e1e] rounded-md px-5 py-4 flex gap-3.5 items-start"
              >
                <div className="w-8 h-8 rounded-md bg-[rgba(168,11,9,0.12)] border border-[rgba(168,11,9,0.2)] flex items-center justify-center flex-shrink-0 text-sm">
                  {card.icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white mb-0.5">{card.title}</p>
                  <p className="text-[12px] text-[#888888] leading-[1.5] font-light">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};