"use client";

const whyCards = [
  {
    num: "01",
    title: "Your content, your rules",
    desc: "We don't suppress content based on algorithm preferences or advertiser pressure. If it's legal, it lives on Videomentum without interference.",
  },
  {
    num: "02",
    title: "Earn from day one",
    desc: "Every view earns you credits. No subscriber threshold, no monetization application, no waiting. Upload and start earning immediately.",
  },
  {
    num: "03",
    title: "Your own theatre",
    desc: "You don't just get a channel. You get a branded theatre — your own space within the Videomentum universe with your identity, your films, your audience.",
  },
];

export const WhyVideomentum = () => {
  return (
    <section className="bg-black border-b border-[#1e1e1e]">
      <style>{`
        .why-card {
          position: relative;
          overflow: hidden;
          transition: background 0.2s, border-color 0.2s;
        }
        .why-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #A80B09;
          opacity: 0;
          transition: opacity 0.25s;
        }
        .why-card:hover { background: #0a0a0a; border-color: #2a2a2a; }
        .why-card:hover::before { opacity: 1; }

        /* Tablet ≤1024px */
        @media (max-width: 1024px) {
          .why-section-inner  { padding: 40px 28px; }
          .why-grid           { grid-template-columns: 1fr 1fr !important; }
          .why-grid .why-card:last-child { grid-column: 1 / -1; }
        }

        /* Mobile ≤680px */
        @media (max-width: 680px) {
          .why-section-inner { padding: 36px 16px; }
          .why-section-title { font-size: 30px !important; }
          .why-grid          { grid-template-columns: 1fr !important; gap: 2px; }
          .why-grid .why-card:last-child { grid-column: auto; }
          .why-card          { padding: 24px 20px !important; }
          .why-num           { font-size: 36px !important; }
        }

        /* Small mobile ≤420px */
        @media (max-width: 420px) {
          .why-section-title { font-size: 26px !important; }
        }
      `}</style>

      <div className="why-section-inner px-16 py-14">
        <p className="text-[10px] font-bold text-[#A80B09] tracking-[3px] uppercase mb-2.5">
          The Alternative
        </p>
        <h2
          className="why-section-title text-[40px] text-white tracking-[0.5px] mb-8"
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          Why Migrate to Videomentum?
        </h2>

        <div className="why-grid grid grid-cols-3 gap-0.5">
          {whyCards.map((card) => (
            <div
              key={card.num}
              className="why-card bg-[#111111] border border-[#1e1e1e] p-8"
            >
              <p
                className="why-num text-[44px] leading-none mb-3"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  color: "rgba(168,11,9,0.2)",
                }}
              >
                {card.num}
              </p>
              <p className="text-[15px] font-semibold text-white mb-2">{card.title}</p>
              <p className="text-[13px] text-[#888888] leading-[1.65] font-light">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};