"use client";

const steps = [
  {
    num: "1",
    title: "Apply",
    desc: "Fill in the form below. Tell us about your content, your platform, and your audience size.",
  },
  {
    num: "2",
    title: "We Review",
    desc: "Our team reviews your application within 48 hours and sets up your theatre.",
  },
  {
    num: "3",
    title: "Upload",
    desc: "Add your existing content here too, or start fresh — your other platforms stay exactly as they are. We support bulk uploads and handle the heavy lifting.",
  },
  {
    num: "4",
    title: "Go Live",
    desc: "Your theatre goes live on the Videomentum platform. Start earning credits from your very first view.",
  },
];

export const MigrationSteps = () => {
  return (
    <section
      id="migration-steps"
      className="bg-[#0d0d0d] border-b border-[#1e1e1e]"
      style={{ scrollMarginTop: "120px" }}
    >
      <style>{`
        .steps-row {
          position: relative;
        }
        /* Dashed connector line — desktop only */
        .steps-row::before {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(12.5% + 16px);
          right: calc(12.5% + 16px);
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #A80B09 0px, #A80B09 8px,
            transparent 8px, transparent 16px
          );
          z-index: 0;
        }

        /* Tablet ≤1024px — 2 column, hide connector */
        @media (max-width: 1024px) {
          .steps-section-inner { padding: 40px 28px; }
          .steps-row           { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
          .steps-row::before   { display: none; }
        }

        /* Mobile ≤680px — 1 column, horizontal step layout */
        @media (max-width: 680px) {
          .steps-section-inner { padding: 36px 16px; }
          .steps-section-title { font-size: 30px !important; }
          .steps-row           { grid-template-columns: 1fr !important; gap: 24px !important; }
          .steps-row::before   { display: none; }
          .step                { flex-direction: row !important; text-align: left !important; align-items: flex-start !important; gap: 16px; }
          .step-num            { flex-shrink: 0; width: 44px !important; height: 44px !important; font-size: 20px !important; margin-bottom: 0 !important; }
        }

        /* Small mobile ≤420px */
        @media (max-width: 420px) {
          .steps-section-title { font-size: 26px !important; }
          .step-num            { width: 38px !important; height: 38px !important; font-size: 18px !important; }
          .step-title          { font-size: 13px !important; }
          .step-desc           { font-size: 11px !important; }
        }
      `}</style>

      <div className="steps-section-inner px-16 py-14">
        <p className="text-[10px] font-bold text-[#A80B09] tracking-[3px] uppercase mb-2.5">
          The Process
        </p>
        <h2
          className="steps-section-title text-[40px] text-white tracking-[0.5px] mb-8"
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          How it Works
        </h2>

        <div className="steps-row grid grid-cols-4 gap-0 mt-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="step relative z-10 flex flex-col items-center text-center px-5"
            >
              <div
                className="step-num w-14 h-14 rounded-full bg-black border-2 border-[#A80B09] flex items-center justify-center mb-4 flex-shrink-0 text-[#A80B09] text-[24px]"
                style={{ fontFamily: "'Bebas Neue', cursive" }}
              >
                {step.num}
              </div>
              <p className="step-title text-[14px] font-semibold text-white mb-1.5">
                {step.title}
              </p>
              <p className="step-desc text-[12px] text-[#888888] leading-[1.6] font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
