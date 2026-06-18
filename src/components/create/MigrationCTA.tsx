"use client";

import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const MigrationCTA = () => {
  const router = useRouter();
  return (
    <section className="w-full border-t border-zinc-900 bg-black px-6 py-16">
      <div className="mx-auto w-full">
        <style>{`
          .migration-banner::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 300px;
            background: linear-gradient(to left, rgba(168, 11, 9, 0.06) 0%, transparent 100%);
            pointer-events: none;
            z-index: 0;
          }

          .banner-title {
            font-family: 'Bebas Neue', cursive;
          }

          .btn-migrate,
          .btn-learn {
            font-family: 'DM Sans', sans-serif;
          }

          /* Tablet ≤1024px */
          @media (max-width: 1024px) {
            .migration-banner     { flex-direction: column; gap: 20px; padding: 24px; }
            .banner-right         { width: 100%; display: flex; flex-direction: row; gap: 12px; }
            .btn-migrate          { flex: 1; margin-bottom: 0; }
            .btn-learn            { flex: 1; }
          }

          /* Mobile ≤680px */
          @media (max-width: 680px) {
            .migration-banner     { padding: 20px 16px; border-radius: 6px; }
            .banner-title         { font-size: 22px !important; }
            .banner-sub           { font-size: 12px !important; }
            .banner-right         { flex-direction: column; gap: 8px; }
            .btn-migrate,
            .btn-learn            { width: 100%; }
            .platform-tag         { font-size: 12px; }
          }
        `}</style>
        {/* Banner container */}
        <div className="migration-banner relative overflow-hidden border border-[#1e1e1e] border-l-4 border-l-[#a80b09] rounded-lg bg-[#111111] flex items-center justify-between gap-8 px-8 py-7">
          {/* Left section */}
          <div className="relative z-10 flex-1">
            <span className="block text-[10px] font-bold text-[#a80b09] tracking-[2.5px] uppercase mb-2">
              You deserve a platform built for you
            </span>

            <h3 className="banner-title text-[28px] text-white tracking-[0.5px] mb-1.5">
              Bring Your Content to Videomentum
            </h3>

            <p className="banner-sub text-[13px] text-[#cccccc] font-light max-w-[480px] leading-[1.5] mb-3">
              We value your work and respect your creative voice. Keep every
              platform you&apos;re already on, and add Videomentum as another
              stage to shine, grow, and reach your full potential - on your
              terms.
            </p>

            {/* Videomentum tag */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="platform-tag inline-flex items-center gap-1.5 text-[14px] text-white bg-gradient-to-r from-[#a80b09] to-[#c70d0a] border border-[rgba(168,11,9,0.5)] px-4 py-1.5 rounded-full font-semibold shadow-[0_0_16px_rgba(168,11,9,0.35)]">
                + Videomentum
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="banner-right relative z-10 flex-shrink-0 flex flex-col gap-2">
            <button
              className="btn-migrate bg-[#a80b09] text-white text-sm font-semibold px-8 py-3.5 rounded cursor-pointer whitespace-nowrap text-center transition-all duration-200 hover:bg-[#c70d0a] hover:-translate-y-px"
              onClick={() => router.push("/migration")}
            >
              Start Creating{" "}
              <ArrowRight className="inline-block ml-1 w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/faq")}
              className="btn-learn bg-transparent text-[#888888] text-xs font-medium px-8 py-2 rounded border border-[#1e1e1e] cursor-pointer whitespace-nowrap text-center w-full transition-all duration-200 hover:border-[#a80b09] hover:text-white"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
