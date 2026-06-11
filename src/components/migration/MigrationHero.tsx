"use client";

export const MigrationHero = () => {
  return (
    <section className="relative flex items-center overflow-hidden min-h-[480px]">
      <style>{`
        .migration-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #050505 0%, #150505 40%, #000000 100%);
        }
        .migration-hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(168,11,9,0.03) 60px, rgba(168,11,9,0.03) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(168,11,9,0.02) 60px, rgba(168,11,9,0.02) 61px);
        }
        .migration-hero-bg::after {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(168,11,9,0.12) 0%, transparent 65%);
        }
        .hero-eyebrow::before {
          content: '';
          width: 28px;
          height: 2px;
          background: #A80B09;
          display: inline-block;
        }

        /* Tablet ≤1024px */
        @media (max-width: 1024px) {
          .hero-content { padding: 48px 28px; }
          .hero-title   { font-size: 56px !important; }
          .hero-watermark { font-size: 160px !important; }
        }

        /* Mobile ≤680px */
        @media (max-width: 680px) {
          .migration-hero { min-height: auto !important; }
          .hero-content   { padding: 40px 16px 48px !important; }
          .hero-eyebrow   { font-size: 10px !important; }
          .hero-title     { font-size: 44px !important; }
          .hero-sub       { font-size: 14px !important; }
          .hero-cta-row   { flex-direction: column; gap: 10px; }
          .hero-cta-row button { width: 100%; font-size: 14px !important; padding: 14px !important; text-align: center; }
          .hero-trust     { flex-direction: column; align-items: flex-start; gap: 8px; }
          .hero-watermark { font-size: 100px !important; opacity: 0.04 !important; }
        }

        /* Small mobile ≤420px */
        @media (max-width: 420px) {
          .hero-title { font-size: 36px !important; }
          .hero-sub   { font-size: 13px !important; }
        }
      `}</style>

      <div className="migration-hero-bg" />

      {/* Watermark */}
      <span
        className="hero-watermark absolute right-[-20px] top-1/2 -translate-y-1/2 pointer-events-none leading-none select-none"
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "220px",
          color: "rgba(168,11,9,0.05)",
          letterSpacing: "-4px",
        }}
      >
        MIGRATE
      </span>

      {/* Content */}
      <div className="hero-content relative z-10 px-16 py-16 max-w-[700px]">
        <div className="hero-eyebrow flex items-center gap-2.5 mb-4 text-[11px] font-bold text-[#A80B09] tracking-[3px] uppercase">
          Creator Freedom
        </div>

        <h1
          className="hero-title text-[72px] leading-[0.95] tracking-[1px] text-white mb-5"
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          Done Playing
          <br />
          By <span className="text-[#A80B09]">Their</span> Rules?
        </h1>

        <p className="hero-sub text-[16px] font-light text-[#cccccc] leading-[1.7] mb-8 max-w-[540px]">
          YouTube is suppressing your content. Other platforms are demonetizing
          your work. Videomentum doesn&apos;t suppress creators — we build theatres
          for them. Bring your content. Keep your audience. Own your lane.
        </p>

        <div className="hero-cta-row flex gap-3 items-center">
          <button className="bg-[#A80B09] text-white text-[15px] font-semibold px-10 py-4 rounded border-none cursor-pointer transition-all duration-200 hover:bg-[#c70d0a] hover:-translate-y-px">
            Start Your Migration →
          </button>
          <button className="bg-transparent text-[#cccccc] text-[15px] font-medium px-7 py-4 rounded border border-[#2a2a2a] cursor-pointer transition-colors duration-200 hover:border-[#A80B09] hover:text-white">
            See How It Works
          </button>
        </div>

        <div className="hero-trust mt-6 flex items-center gap-5 text-[12px] text-[#888888]">
          {[
            "No content suppression",
            "No algorithm penalties",
            "Earn credits from day one",
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A80B09] flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};