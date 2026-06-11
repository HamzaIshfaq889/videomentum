"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatCard } from "@/components/ChatCard";
import type { ChatItem } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const FALLBACK_IMAGES = [
  `${BASE}/assets/movie.jpg`,
  `${BASE}/assets/movie2.jpg`,
  `${BASE}/assets/movie3.jpg`,
];

type ChatProps = {
  initialItems?: ChatItem[];
};

const CARDS_PER_PAGE_DESKTOP = 6;
const CARDS_PER_PAGE_MOBILE = 1;
const AUTO_SCROLL_INTERVAL_MS = 4_000;

export const Chat = ({ initialItems = [] }: ChatProps) => {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const showScroll = initialItems.length > 6;
  const cardsPerPage = isMobile
    ? CARDS_PER_PAGE_MOBILE
    : CARDS_PER_PAGE_DESKTOP;
  const totalPages = Math.max(1, Math.ceil(initialItems.length / cardsPerPage));
  const start = showScroll ? page * cardsPerPage : 0;
  const visible = showScroll
    ? initialItems.slice(start, start + cardsPerPage)
    : initialItems;

  useEffect(() => {
    if (!showScroll) return;
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages, showScroll]);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  const advance = useCallback(() => {
    setPage((p) => (p + 1) % Math.max(1, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (!showScroll || totalPages <= 1) return;
    const id = setInterval(advance, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showScroll, totalPages, advance]);

  return (
    <section className="w-full px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10">
        <h2 className="font-bebas text-[64px] leading-[64px] tracking-[1px] text-[#FFFFFF]">
          Chat
        </h2>
      </header>

      <div className="relative w-full">
        {showScroll && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-[#5E5E5E] bg-[#0E0E10] shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-[#FCFCFC] transition-colors hover:bg-[#1a1a1a]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div className="w-full overflow-hidden">
          <div
            key={page}
            className="grid w-full grid-cols-1 gap-6 carousel-fade-in sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((item, index) => (
              <ChatCard
                key={`${item.title}-${item.username}-${start + index}`}
                title={item.title}
                username={item.username}
                message={item.message}
                imageSrc={
                  item.imageUrl ??
                  FALLBACK_IMAGES[(start + index) % FALLBACK_IMAGES.length]
                }
                navigateUrl={item.navigateUrl}
                avatarInitials=""
                handle=""
                timeAgo=""
                videoURL={item.videoURL}
                teaserURL={item.teaserURL}
              />
            ))}
          </div>
        </div>

        {showScroll && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-[#5E5E5E] bg-[#0E0E10] shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-[#FCFCFC] transition-colors hover:bg-[#1a1a1a]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};
