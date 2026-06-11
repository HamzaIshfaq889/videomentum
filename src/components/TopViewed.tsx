"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TopViewedCard } from "@/components/TopViewedCard";
import type { HotNowItem } from "@/lib/api";

const DEFAULT_IMAGE = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/movie.jpg`;

type TopViewedProps = {
  initialItems: HotNowItem[];
};

const CARDS_PER_PAGE_DESKTOP = 6;
const CARDS_PER_PAGE_MOBILE = 1;
const AUTO_SCROLL_INTERVAL_MS = 4_000;

export const TopViewed = ({ initialItems }: TopViewedProps) => {
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const items = initialItems ?? [];

  // Whether the current card's video is playing — holds the carousel
  const isVideoHoldingRef = useRef(false);
  // Stores the resolve function to release the hold when video ends
  const videoEndedResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const cardsPerPage = isMobile ? CARDS_PER_PAGE_MOBILE : CARDS_PER_PAGE_DESKTOP;
  const totalPages = Math.max(1, Math.ceil(items.length / cardsPerPage));
  const showScroll = totalPages > 1;
  const start = page * cardsPerPage;
  const visible = items.slice(start, start + cardsPerPage);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, totalPages - 1)));
  }, [totalPages]);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  // Called by TopViewedCard when video starts playing on mobile
  const handleVideoPlaying = useCallback(() => {
    console.log("🎬 TopViewed: video is playing, holding carousel");
    isVideoHoldingRef.current = true;
  }, []);

  // Called by TopViewedCard when video ends/errors on mobile
  const handleVideoEnded = useCallback(() => {
    console.log("✅ TopViewed: video ended, releasing carousel hold");
    isVideoHoldingRef.current = false;
    // If carousel was waiting on this, release it immediately
    if (videoEndedResolveRef.current) {
      videoEndedResolveRef.current();
      videoEndedResolveRef.current = null;
    }
  }, []);

  // Wait until video finishes (or timeout as safety net)
  const waitForVideoOrTimeout = useCallback((timeoutMs: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!isVideoHoldingRef.current) {
        resolve();
        return;
      }
      console.log(`⏳ TopViewed: waiting for video to finish (max ${timeoutMs}ms)...`);
      // Store resolve so handleVideoEnded can release early
      videoEndedResolveRef.current = resolve;
      // Safety timeout in case video never fires onEnded
      setTimeout(() => {
        if (videoEndedResolveRef.current === resolve) {
          console.log("⏱️ TopViewed: video timeout reached, advancing anyway");
          videoEndedResolveRef.current = null;
          isVideoHoldingRef.current = false;
          resolve();
        }
      }, timeoutMs);
    });
  }, []);

  const advance = useCallback(async () => {
    // On mobile, wait if a video is currently playing
    if (isMobile && isVideoHoldingRef.current) {
      await waitForVideoOrTimeout(30_000); // max 30s wait
    }
    setPage((p) => (p + 1) % Math.max(1, totalPages));
  }, [totalPages, isMobile, waitForVideoOrTimeout]);

  // Reset video hold whenever page changes (new card, fresh state)
  useEffect(() => {
    isVideoHoldingRef.current = false;
    videoEndedResolveRef.current = null;
  }, [page]);

  useEffect(() => {
    if (!showScroll) return;
    const id = setInterval(advance, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showScroll, advance]);



  return (
    <section className="w-full px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8 sm:mb-10">
        <h2 className="font-bebas text-[64px] leading-[64px] tracking-[1px] text-[#FFFFFF]">
          Hot Now
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
            {visible.map((item) => (
              <TopViewedCard
                key={`${item.rank}-${item.title}-${item.subtitle}`}
                rank={item.rank}
                title={item.title}
                subtitle={item.subtitle}
                durationLabel={item.durationLabel}
                imageSrc={item.imageUrl ?? DEFAULT_IMAGE}
                navigateUrl={item.navigateUrl}
                videoURLs={item.videoURLs}
                teaserURL={item.teaserURL}
                imageURLs={item.imageURLs}
                onVideoPlaying={isMobile ? handleVideoPlaying : undefined}
                onVideoEnded={isMobile ? handleVideoEnded : undefined}
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

