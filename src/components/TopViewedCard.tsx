"use client";

import Image from "next/image";
import { Felipa } from "next/font/google";
import { useState, useRef, useEffect } from "react";

import {
  extractUrls,
  extractFirstUrl,
  decideContentToShow,
} from "@/lib/videoMetadata";

import { useBandwidth } from "@/hooks/useBandwidth";
import { useMobileDetection } from "@/hooks/useMobileDetection";
import { useVideoPlayback } from "@/hooks/useVideoPlayback";
import { useSlideshow } from "@/hooks/useSlideshow";
import { usePreviewSettings } from "@/hooks/usePreviewSettings";

const isExternalUrl = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://");

// Module-level tracker for currently active mobile card
let activeTopViewedCardCleanup: (() => void) | null = null;

const felipa = Felipa({
  subsets: ["latin"],
  weight: "400",
});

type TopViewedCardProps = {
  rank: number;
  title: string;
  subtitle: string;
  durationLabel?: string;
  imageSrc: string;
  navigateUrl?: string;
  videoURLs?: string;
  imageURLs?: string;
  teaserURL?: string;
  /** Mobile carousel: called when a video preview starts playing */
  onVideoPlaying?: () => void;
  /** Mobile carousel: called when video preview ends or card resets */
  onVideoEnded?: () => void;
};

export const TopViewedCard = ({
  rank,
  title,
  subtitle,
  durationLabel,
  imageSrc,
  navigateUrl,
  videoURLs,
  imageURLs,
  teaserURL,
  onVideoPlaying,
  onVideoEnded,
}: TopViewedCardProps) => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { mbps: bandwidthMbps } = useBandwidth();
  const isMobile = useMobileDetection();
  const { previewsEnabled } = usePreviewSettings();

  // ── Content Preparation ───────────────────────────────────────────────────
  const slideInterval = 1500;

  const previewVideoSrc = extractFirstUrl(videoURLs);
  const hasPreviewVideo = !!previewVideoSrc;

  const slideImages = extractUrls(imageURLs);
  const hasSlideshow = slideImages.length > 1; // Slideshow is a FALLBACK option

  const teaserVideoSrc = extractFirstUrl(teaserURL);
  const hasTeaserVideo = !hasPreviewVideo && !!teaserVideoSrc; // Try teaser if no preview

  const finalVideoSrc = previewVideoSrc || (hasTeaserVideo ? teaserVideoSrc : undefined);
  const shouldShowVideo = hasPreviewVideo || hasTeaserVideo;

  // ── Log card info on mount (visible when carousel advances) ──────────────
  useEffect(() => {
    const safetyMargin = 1.2;
    const availableBandwidth = bandwidthMbps != null ? bandwidthMbps * safetyMargin : null;

    // Check cached video metadata for bitrate comparison (sync, no fetch)
    let bitrateInfo: Record<string, string | boolean> = { note: "metadata not cached yet" };
    if (finalVideoSrc && typeof window !== "undefined") {
      try {
        const CACHE_PREFIX = "video_metadata_";
        let hash = 0;
        for (let i = 0; i < finalVideoSrc.length; i++) {
          const char = finalVideoSrc.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        const key = CACHE_PREFIX + Math.abs(hash).toString(36);
        const raw = localStorage.getItem(key);
        if (raw) {
          const meta = JSON.parse(raw);
          const eligible = availableBandwidth != null ? meta.bitrate <= availableBandwidth : null;
          bitrateInfo = {
            videoBitrate: `${meta.bitrate.toFixed(2)} Mbps`,
            availableBandwidth: availableBandwidth != null ? `${availableBandwidth.toFixed(2)} Mbps (${bandwidthMbps?.toFixed(2)} × ${safetyMargin})` : "unknown",
            eligible: eligible ?? "unknown",
            verdict: eligible === true ? "✅ can play" : eligible === false ? "❌ too slow" : "❓ no bandwidth data",
          };
        }
      } catch {
        bitrateInfo = { note: "cache read error" };
      }
    }

    // console.log(`🃏 TopViewedCard mounted: "${title}"`, {
    //   rank,
    //   hasPreviewVideo,
    //   hasTeaserVideo,
    //   hasSlideshow,
    //   shouldShowVideo,
    //   previewVideoSrc: previewVideoSrc ?? "—",
    //   teaserVideoSrc: teaserVideoSrc ?? "—",
    //   slideshowImages: slideImages.length,
    //   rawVideoURLs: videoURLs ?? "—",
    //   rawTeaserURL: teaserURL ?? "—",
    //   rawImageURLs: imageURLs ?? "—",
    //   "── bandwidth ──": "",
    //   userBandwidth: bandwidthMbps != null ? `${bandwidthMbps.toFixed(2)} Mbps` : "not detected",
    //   ...bitrateInfo,
    // });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Custom Hooks for Side Effects ─────────────────────────────────────────
  const { currentSlideIndex, setCurrentSlideIndex, slideshowIntervalRef } = useSlideshow(
    showSlideshow,
    slideImages,
    slideInterval,
  );

  useVideoPlayback(videoRef, showVideo, isVideoPlaying);

  // ── Mobile: Auto-preview when card enters viewport ───────────────────────
  useEffect(() => {
    if (!isMobile || !cardRef.current || !previewsEnabled) return;
    if (!shouldShowVideo && !hasSlideshow) return;

    // Adjust viewport to exclude header (56px) + tabs (55px) = 111px from top
    // When card goes under these fixed elements, it's considered "out of viewport"
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            // console.log(`📱 TopViewedCard entered viewport: "${title}" - fetching metadata & deciding content`);
            
            // Decide what content to show based on bandwidth and available media
            const decision = await decideContentToShow(
              finalVideoSrc,
              bandwidthMbps,
              hasSlideshow,
            );

            // console.log("📋 Viewport content decision:", decision.reason);

            // Apply the decision
            if (decision.showVideo) {
              // Video is eligible and will play → hold carousel immediately (during loading too)
              // console.log("🎬 Eligible video found, holding carousel now (including loading phase)");
              onVideoPlaying?.(); // Hold carousel immediately, even during loading
              setShowVideo(true);
            } else {
              // No video eligible (only slideshow or not enough bandwidth)
              // → Don't show anything, let carousel wait normal 4s then advance
              // console.log("⏭️ No eligible video for carousel, will advance after normal 4s timeout");
              // Do nothing - carousel will use normal AUTO_SCROLL_INTERVAL_MS (4s)
            }
            // Note: We don't show slideshow in TopViewedCard carousel on mobile
          } else {
            // console.log(`📱 TopViewedCard left viewport (went under header/tabs): "${title}" - stopping preview`);
            // Clean up when card leaves viewport
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = undefined;
            }
            if (slideshowIntervalRef.current) {
              clearInterval(slideshowIntervalRef.current);
              slideshowIntervalRef.current = undefined;
            }
            setShowVideo(false);
            setIsVideoPlaying(false);
            setShowSlideshow(false);
            setCurrentSlideIndex(0);
          }
        });
      },
      { 
        threshold: 0.5, // Card must be 50% visible
        rootMargin: "-111px 0px 0px 0px" // Exclude header (56px) + tabs (55px) from top
      }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isMobile, shouldShowVideo, hasSlideshow, title, finalVideoSrc, bandwidthMbps]);

  // ── Stop any active preview when previews are globally disabled ───────────
  useEffect(() => {
    if (!previewsEnabled) {
      // Clean up any active preview
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = undefined;
      }
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = undefined;
      }
      // Reset preview state when globally disabled - this is intentional
      setShowVideo(false);
      setIsVideoPlaying(false);
      setShowSlideshow(false);
      setCurrentSlideIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewsEnabled]);

  // ── Event handlers (Mouse for desktop, Touch for mobile) ─────────────────
  const handleMouseEnter = () => {
    if (isMobile || !previewsEnabled) return; // Only for desktop and if previews enabled

    // console.log("TopViewedCard hover:", {
    //   title,
    //   videoURLs,
    //   teaserURL,
    //   imageURLs,
    //   previewVideoSrc,
    //   hasPreviewVideo,
    //   hasSlideshow,
    //   hasTeaserVideo,
    //   slideImagesCount: slideImages.length,
    // });

    if (!shouldShowVideo && !hasSlideshow) return;

    hoverTimeoutRef.current = setTimeout(async () => {
      // Decide what content to show based on bandwidth and available media
      const decision = await decideContentToShow(
        finalVideoSrc,
        bandwidthMbps,
        hasSlideshow,
      );

      // console.log("📋 Content decision:", decision.reason);

      // Apply the decision
      if (decision.showVideo) {
        setShowVideo(true);
      } else if (decision.showSlideshow) {
        setShowSlideshow(true);
      }
      // If both false, thumbnail stays visible (do nothing)
    }, 200);
  };

  const handleMouseLeave = () => {
    if (isMobile || !previewsEnabled) return; // Only for desktop and if previews enabled

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = undefined;
    }

    setShowVideo(false);
    setIsVideoPlaying(false);
    setShowSlideshow(false);
    setCurrentSlideIndex(0);
  };

  // Touch handler for mobile - keeps playing until another card is touched
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !previewsEnabled) return; // Only for mobile and if previews enabled

    // Prevent default to avoid triggering click events
    e.preventDefault();

    // console.log("TopViewedCard touch:", {
    //   title,
    //   videoURLs,
    //   teaserURL,
    //   imageURLs,
    //   previewVideoSrc,
    //   hasPreviewVideo,
    //   hasSlideshow,
    //   hasTeaserVideo,
    //   slideImagesCount: slideImages.length,
    // });

    if (!shouldShowVideo && !hasSlideshow) return;

    // Stop any currently playing card preview
    if (activeTopViewedCardCleanup) {
      // console.log("🛑 Stopping previous TopViewedCard preview");
      activeTopViewedCardCleanup();
      activeTopViewedCardCleanup = null;
    }

    // Create cleanup function for this card
    const cleanup = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = undefined;
      }
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = undefined;
      }
      setShowVideo(false);
      setIsVideoPlaying(false);
      setShowSlideshow(false);
      setCurrentSlideIndex(0);
    };

    // Store this card's cleanup function as the active one
    activeTopViewedCardCleanup = cleanup;

    // Start preview after delay
    hoverTimeoutRef.current = setTimeout(async () => {
      // Decide what content to show based on bandwidth and available media
      const decision = await decideContentToShow(
        finalVideoSrc,
        bandwidthMbps,
        hasSlideshow,
      );

      // console.log("📋 Content decision:", decision.reason);

      // Apply the decision
      if (decision.showVideo) {
        onVideoPlaying?.(); // Hold carousel when user manually touches to play video
        setShowVideo(true);
      } else if (decision.showSlideshow) {
        setShowSlideshow(true);
      }
      // If both false, thumbnail stays visible (do nothing)
    }, 200);
  };

  const handleVideoCanPlay = () => {
    // console.log("Video can play");
    setIsVideoPlaying(true);
    // Note: onVideoPlaying() is called earlier in viewport observer to hold carousel during loading
  };

  const handleVideoEnded = () => {
    // console.log("Video ended");
    setShowVideo(false);
    setIsVideoPlaying(false);
    // Notify parent carousel that video has finished
    onVideoEnded?.();
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e.currentTarget.error);
    setShowVideo(false);
    setIsVideoPlaying(false);
    // Treat error as ended so carousel can advance
    onVideoEnded?.();
  };

  const handleClick = () => {
    if (navigateUrl) {
      window.open(navigateUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      ref={(el) => {
        cardRef.current = el;
      }}
      role={navigateUrl ? "link" : undefined}
      tabIndex={navigateUrl ? 0 : undefined}
      onClick={navigateUrl ? handleClick : undefined}
      onKeyDown={
        navigateUrl
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      className={`group flex w-full flex-col gap-4 ${navigateUrl ? "cursor-pointer" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {/* Image card with rank and duration overlay */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-[#17181c] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        {/* Thumbnail Image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          unoptimized={isExternalUrl(imageSrc)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            (showVideo && isVideoPlaying) || showSlideshow ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Video Preview on Hover */}
        {shouldShowVideo && showVideo && (
          <video
            ref={videoRef}
            src={finalVideoSrc}
            muted
            playsInline
            preload="metadata"
            onCanPlay={handleVideoCanPlay}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
              isVideoPlaying ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Loading Spinner - Shows while video is loading (especially for teaserURL) */}
        {showVideo && !isVideoPlaying && shouldShowVideo && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 bg-black/40 px-6 py-4 rounded-lg backdrop-blur-sm">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white shadow-lg"></div>
              <p className="text-sm font-figtree text-white font-medium">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Image Slideshow on Hover (when no video) */}
        {hasSlideshow && showSlideshow && (
          <div className="absolute inset-0 h-full w-full">
            {slideImages.map((imgUrl, index) => (
              <Image
                key={`slide-${index}-${imgUrl}`}
                src={imgUrl}
                alt={`${title} - Image ${index + 1}`}
                fill
                unoptimized={isExternalUrl(imgUrl)}
                className={`object-cover transition-opacity duration-500 ${
                  index === currentSlideIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        )}

        <div className={`relative z-10 flex h-full w-full flex-col justify-between p-4 sm:p-6 transition-opacity duration-300 ${
          isVideoPlaying || showSlideshow ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          {/* Rank number */}
          <div className="flex justify-between">
            <span
              className={`${felipa.className} text-[48px] leading-none tracking-[0px] text-[#FFFFFF]`}
            >
              {rank}
            </span>
          </div>

          {/* Duration bottom-right */}
          {durationLabel && (
            <div className="flex justify-end">
              <span className="text-[11px] font-figtree text-[#FCFCFC99]">
                {durationLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Text block below image */}
      <div className="px-1 text-white sm:px-0">
        <h3 className="font-figtree text-[32px] leading-none font-bold tracking-[-0.41px] text-[#FFFFFF]">
          {title}
        </h3>
        <p className="mt-1 font-figtree text-[20px] leading-none font-normal tracking-[-0.14px] text-[#99A1AF]">
          {subtitle}
        </p>
      </div>
    </article>
  );
};

