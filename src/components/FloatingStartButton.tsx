"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const letters = ["S", "t", "a", "r", "t"];

export const FloatingStartButton = () => {
  return (
    <>
      <style>{`
        @keyframes letterWave {
          0%, 100% { transform: translateY(0); }
          40%       { transform: translateY(-7px); }
        }
        .float-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .float-btn .btn-text {
          opacity: 1;
          margin-right: 4px;
          display: inline-flex;
          overflow: visible;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (min-width: 640px) {
          .float-btn:hover .wave-letter {
            animation: letterWave 0.5s ease forwards;
          }
          .float-btn:hover .wave-letter:nth-child(1) { animation-delay: 0.00s; }
          .float-btn:hover .wave-letter:nth-child(2) { animation-delay: 0.07s; }
          .float-btn:hover .wave-letter:nth-child(3) { animation-delay: 0.14s; }
          .float-btn:hover .wave-letter:nth-child(4) { animation-delay: 0.21s; }
          .float-btn:hover .wave-letter:nth-child(5) { animation-delay: 0.28s; }
        }
      `}</style>

      <Link
        href="/start"
        className="float-btn fixed bottom-4 right-2 z-50 inline-flex items-center justify-center rounded-full bg-[#A80A08] px-3 py-1.5 font-bebas text-[20px] tracking-[1px] text-white shadow-[0_8px_32px_rgba(168,10,8,0.45)] sm:text-[23px] sm:hover:scale-105 active:scale-95"
        aria-label="Get started with Videomentum"
      >
        <span className="btn-text inline-flex">
          {letters.map((letter, i) => (
            <span key={i} className="wave-letter inline-block">
              {letter}
            </span>
          ))}
        </span>
        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} aria-hidden />
      </Link>
    </>
  );
};
