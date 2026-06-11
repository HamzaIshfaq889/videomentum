"use client";

import { useEffect, useState } from "react";
import { HotMoviesCarousel } from "@/components/HotMoviesCarousel";
import type { TopInTheatreItem } from "@/lib/api";

type HotMoviesClientProps = {
  initialItems: TopInTheatreItem[];
};

export function HotMoviesClient({ initialItems }: HotMoviesClientProps) {
  const [items, setItems] = useState(initialItems);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const hasItems = items.length > 0;

  useEffect(() => {
    if (hasItems || retryCount >= 2) return;
    const controller = new AbortController();
    setIsRetrying(true);
    fetch("/api/top-in-theatres", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TopInTheatreItem[]) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {})
      .finally(() => {
        setIsRetrying(false);
        setRetryCount((c) => c + 1);
      });
    return () => controller.abort();
  }, [hasItems, retryCount]);

  if (hasItems) {
    return <HotMoviesCarousel items={items} />;
  }

  if (isRetrying) {
    return (
      <p className="font-figtree text-[18px] text-[#999999]">
        Loading films…
      </p>
    );
  }

  return (
    <p className="font-figtree text-[18px] text-[#999999]">
      No films in theatres right now.
    </p>
  );
}
