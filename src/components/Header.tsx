"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { TickerData } from "@/lib/api";

const navLinkBase =
  "flex flex-1 items-center justify-center border-[0.5px] border-[#5E5E5E66] pb-1";
const navLinkActive =
  "border-b-2 border-b-red-600 text-[#FFFFFF]";
const navLinkInactive =
  "text-[#D1D5DB] hover:border-b-2 hover:border-b-red-600 hover:text-[#FCFCFC]";

export const Header = () => {
  const pathname = usePathname();
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/ticker`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: TickerData | null) => {
        if (!cancelled && data && Array.isArray(data.ticker) && data.ticker.length > 0) {
          setTickerData(data);
        }
      })
      .catch(() => {
        // leave ticker blank on error
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = (path: string) => {
    const p = pathname ?? "/";
    if (path === "/") return p === "/" || p === "" || p === "/index";
    return p === path || p.startsWith(path + "/");
  };
  return (
    <header className="sticky top-0 z-50 flex flex-col border-b border-zinc-900 bg-[#0E0E10] text-[11px] text-zinc-200">
      {/* Top stats ticker */}
      <div className="flex h-12 items-stretch border-b border-zinc-900 bg-[#0E0E10] sm:h-14">
        {/* Left static tagline */}
        <div className="hidden h-full max-w-[55%] items-center bg-[#0E0E10] px-3 font-figtree text-[10px] leading-[16px] font-semibold tracking-[0px] text-[#FCFCFCB2] sm:flex sm:max-w-none sm:px-4 sm:text-[12px] sm:leading-none">
          ONE UNIVERSE. MANY PATHS. MOVING TOGETHER.
        </div>

        {/* Feed label */}
        <div className="flex h-full items-center border-l border-zinc-900 bg-[#7b0b0b] px-4 font-figtree text-[12px] leading-none font-semibold tracking-[1.25px] uppercase text-[#FFFFFF]">
          FEED
        </div>

        {/* Scrolling strip (from right edge to left) */}
        <div
          className="relative flex-1 overflow-hidden border-l border-zinc-900 bg-[#0E0E10]"
          onMouseEnter={() => setIsTickerPaused(true)}
          onMouseLeave={() => setIsTickerPaused(false)}
        >
          {tickerData?.ticker && tickerData.ticker.length > 0 && (
            <div
              className="ticker-track absolute inset-y-0 left-0 flex items-stretch whitespace-nowrap font-figtree text-[10px] leading-[20px] tracking-[0px] sm:text-[12px] sm:leading-[24px]"
              style={{ animationPlayState: isTickerPaused ? "paused" : "running" }}
            >
              {[0, 1].map((loop) => (
                <div key={loop} className="flex">
                  {tickerData.ticker.map((item, i) => (
                    item.navigateUrl ? (
                      <a
                        key={`${loop}-${i}`}
                        href={item.navigateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full items-center gap-1.5 border-l border-zinc-800 bg-zinc-950 px-4"
                        style={{ color: item.color }}
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-22 w-22 shrink-0 rounded object-contain"
                          />
                        )}
                        <span className="text-lg">{item.text}</span>
                      </a>
                    ) : (
                      <div
                        key={`${loop}-${i}`}
                        className="flex h-full items-center gap-1.5 border-l border-zinc-800 bg-zinc-950 px-4"
                        style={{ color: item.color }}
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-4 w-4 shrink-0 rounded object-contain"
                          />
                        )}
                        <span className="text-lg">{item.text}</span>
                      </div>
                    )
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex h-14 items-stretch border-[0.5px] border-[#5E5E5E66] bg-[#0E0E10] pl-6 pr-0">
        {/* Logo section (natural width) */}
        <div className="flex items-center">
          <Link href="/watch" className="flex items-center gap-3">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/logo.svg`}
              alt="VideoMentum logo"
              width={52}
              height={64}
              className="h-8 w-auto sm:h-10 md:h-12"
              priority
            />
          </Link>
        </div>

        {/* Menu section (fills remaining width, equal item widths) */}
        <nav className="ml-8 flex flex-1 items-stretch font-bebas text-[18px] leading-[20px] tracking-[0px] uppercase sm:text-[22px] sm:leading-[22px] md:text-[28px] md:leading-[24px]">
          <Link
            href="/watch"
            className={`${navLinkBase} ${isActive("/watch") ? navLinkActive : navLinkInactive}`}
          >
            Watch
          </Link>
          <Link
            href="/create"
            className={`${navLinkBase} ${isActive("/create") ? navLinkActive : navLinkInactive}`}
          >
            Create
          </Link>
          <Link
            href="/invest"
            className={`${navLinkBase} ${isActive("/invest") ? navLinkActive : navLinkInactive}`}
          >
            Invest
          </Link>
          <Link
            href="/faq"
            className={`${navLinkBase} ${isActive("/faq") ? navLinkActive : navLinkInactive}`}
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}

