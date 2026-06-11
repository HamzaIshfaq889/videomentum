"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import type { ChannelItem } from "@/lib/api";

function creditsHref(url: string): string {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

const creditsText = "Get Credits";
const creditsLetters = creditsText.split("");

export function ChannelCard({ channel }: { channel: ChannelItem }) {
  return (
    <>
      <style>{`
        @keyframes letterWave {
          0%, 100% { transform: translateY(0); }
          40%       { transform: translateY(-7px); }
        }
        .wave-credits-btn:hover .wave-letter { animation: letterWave 0.5s ease forwards; }
        .wave-credits-btn:hover .wave-letter:nth-child(1) { animation-delay: 0.00s; }
        .wave-credits-btn:hover .wave-letter:nth-child(2) { animation-delay: 0.04s; }
        .wave-credits-btn:hover .wave-letter:nth-child(3) { animation-delay: 0.08s; }
        .wave-credits-btn:hover .wave-letter:nth-child(4) { animation-delay: 0.12s; }
        .wave-credits-btn:hover .wave-letter:nth-child(5) { animation-delay: 0.16s; }
        .wave-credits-btn:hover .wave-letter:nth-child(6) { animation-delay: 0.20s; }
        .wave-credits-btn:hover .wave-letter:nth-child(7) { animation-delay: 0.24s; }
        .wave-credits-btn:hover .wave-letter:nth-child(8) { animation-delay: 0.28s; }
        .wave-credits-btn:hover .wave-letter:nth-child(9) { animation-delay: 0.32s; }
        .wave-credits-btn:hover .wave-letter:nth-child(10) { animation-delay: 0.36s; }
        .wave-credits-btn:hover .wave-letter:nth-child(11) { animation-delay: 0.40s; }
      `}</style>

      <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#141416] transition-all duration-300 hover:border-[#A80A08]/50 hover:shadow-[0_0_32px_rgba(168,10,8,0.12)]">
        {/* Preview image */}
        <div className="relative h-52 overflow-hidden">
          <a
            href={creditsHref(channel?.getCreditsUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 block cursor-pointer"
            aria-label={`Open ${channel.name} credits link`}
          >
            {channel?.contentPreviewImage ? (
              <Image
                src={channel.contentPreviewImage}
                alt={channel.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Image
                src="/assets/logo.svg"
                alt="Videomentum logo"
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
            )}
          </a>
          {/* Gradient */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-t from-[#141416] via-[#141416]/20 to-transparent" />

          {channel.ageLimit > 0 && (
            <span className="absolute right-3 top-3 z-20 rounded bg-black/70 px-2 py-0.5 font-figtree text-xs font-semibold text-[#FCFCFCB2] backdrop-blur-sm">
              {channel.ageLimit}+
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <p className="mb-1 font-figtree text-[10px] font-semibold uppercase tracking-[2px] text-[#A80A08]">
              {channel?.domain}
            </p>
            <h3 className="font-bebas text-[28px] leading-none tracking-[0.5px] text-white">
              {channel?.name}
            </h3>
            {channel?.leftText && (
              <p className="mt-1 font-figtree text-[11px] font-semibold uppercase tracking-[1.5px] text-[#FCFCFCB2]">
                {channel.leftText}
              </p>
            )}
          </div>

          <p className="line-clamp-2 font-figtree text-xs leading-4 text-[#888888]">
            {channel?.description}
          </p>

          <a
            href={creditsHref(channel?.getCreditsUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="wave-credits-btn mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#A80A08] px-4 py-3 font-figtree text-sm font-bold text-white transition-transform hover:scale-105"
          >
            <CreditCard size={15} aria-hidden />
            <span className="inline-flex">
              {creditsLetters.map((letter, i) => (
                <span key={i} className="wave-letter inline-block">
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
