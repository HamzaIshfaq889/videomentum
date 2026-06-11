"use client";

import Image from "next/image";
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
import { useViewportAutoPlay } from "@/hooks/useViewportAutoPlay";
import { usePreviewSettings } from "@/hooks/usePreviewSettings";

const MAX_CHAT_MESSAGE_LENGTH = 90;
const MAX_CHAT_MESSAGE_LENGTH_LONG_NAME = 70;

type MediaCardProps = {
  primaryText: string;
  secondaryText: string;
  imageSrc: string;
  navigateUrl?: string;
  pillLabel?: string;
  showPill?: boolean;
  filmsCountLabel?: string;
  teaserURL?: string;
  videoURL?: string;
  imageURLs?: string;
  /** When "chat", truncates secondaryText (90 chars, or 70 if commentor name > 11 chars) */
  variant?: "default" | "chat";
};

const isExternalUrl = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://");

export const MediaCard = ({
  primaryText,
  secondaryText,
  imageSrc,
  navigateUrl,
  pillLabel = "Hot now",
  showPill = true,
  filmsCountLabel,
  teaserURL,
  videoURL,
  imageURLs,
  variant = "default",
}: MediaCardProps) => {
  const isChat = variant === "chat";
  const maxCommentLength =
    isChat && primaryText.length > 11
      ? MAX_CHAT_MESSAGE_LENGTH_LONG_NAME
      : MAX_CHAT_MESSAGE_LENGTH;
  const displaySecondary = isChat
    ? secondaryText.slice(0, maxCommentLength) +
      (secondaryText.length > maxCommentLength ? "…" : "")
    : secondaryText;
  const cardClassName = `group relative flex aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#17181c] shadow-[0_24px_60px_rgba(0,0,0,0.7)] ${navigateUrl ? "cursor-pointer" : ""}`;

  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const { mbps: bandwidthMbps } = useBandwidth();
  const isMobile = useMobileDetection();
  const { previewsEnabled } = usePreviewSettings();

  const slideInterval = 1500;

  const previewVideoSrc = extractFirstUrl(videoURL);
  const hasPreviewVideo = !!previewVideoSrc;

  const slideImages = extractUrls(imageURLs);
  const hasSlideshow = slideImages.length > 1;

  const teaserVideoSrc = extractFirstUrl(teaserURL);
  const hasTeaserVideo = !hasPreviewVideo && !!teaserVideoSrc;

  const finalVideoSrc =
    previewVideoSrc || (hasTeaserVideo ? teaserVideoSrc : undefined);
  const shouldShowVideo = hasPreviewVideo || hasTeaserVideo;

  // ── Custom Hooks for Side Effects ─────────────────────────────────────────
  const { currentSlideIndex, setCurrentSlideIndex, slideshowIntervalRef } =
    useSlideshow(showSlideshow, slideImages, slideInterval);

  useVideoPlayback(videoRef, showVideo, isVideoPlaying);

  // ── Preview control functions for viewport manager ───────────────────────
  const startPreview = async () => {
    if (!shouldShowVideo && !hasSlideshow) return;

    // console.log("🎬 Starting preview for:", primaryText);

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
  };

  const stopPreview = () => {
    // console.log("⏹️ Stopping preview for:", primaryText);

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

  // ── Viewport auto-play for mobile ─────────────────────────────────────────
  const { playCard } = useViewportAutoPlay({
    enabled: isMobile && previewsEnabled,
    cardId: primaryText,
    cardRef,
    startPreview,
    stopPreview,
  });

  // ── Stop any active preview when previews are globally disabled ───────────
  useEffect(() => {
    if (!previewsEnabled) {
      // Inline cleanup to avoid calling stopPreview in effect
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

    // console.log("MediaCard hover:", {
    //   primaryText,
    //   videoURL,
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

  // Touch handler for mobile - manually trigger preview
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !previewsEnabled) return; // Only for mobile and if previews enabled

    // Prevent default to avoid triggering click events
    e.preventDefault();

    // console.log("👆 Manual touch on card:", primaryText);

    if (!shouldShowVideo && !hasSlideshow) return;

    // Manually play this card (viewport manager will stop others)
    playCard();
  };

  // ── NEW: onCanPlay fires earlier than onLoadedData ───────────────────────
  // onLoadedData waits for the first frame to fully decode.
  // onCanPlay fires as soon as the browser has enough data to start playback.
  const handleVideoCanPlay = () => {
    // console.log("Video can play");
    setIsVideoPlaying(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Video error:", e.currentTarget.error);
    setShowVideo(false);
    setIsVideoPlaying(false);
  };

  // ── Card content ─────────────────────────────────────────────────────────
  const cardContent = (
    <>
      {/* Thumbnail Image */}
      <Image
        src={imageSrc}
        alt={primaryText}
        fill
        priority
        unoptimized={isExternalUrl(imageSrc)}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className={`object-cover transition-all duration-500 group-hover:scale-105 ${
          (showVideo && isVideoPlaying) || showSlideshow
            ? "opacity-0"
            : "opacity-100"
        }`}
      />

      {/* Video Preview */}
      {shouldShowVideo && showVideo && (
        <video
          ref={videoRef}
          src={finalVideoSrc}
          muted
          playsInline
          preload="metadata"
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
            isVideoPlaying ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Loading Spinner — shown while buffering */}
      {showVideo && !isVideoPlaying && shouldShowVideo && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 bg-black/40 px-6 py-4 rounded-lg">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white shadow-lg"></div>
            <p className="text-sm font-figtree text-white font-medium">
              Loading preview...
            </p>
          </div>
        </div>
      )}

      {/* Image Slideshow */}
      {hasSlideshow && showSlideshow && (
        <div className="absolute inset-0 h-full w-full">
          {slideImages.map((imgUrl, index) => (
            <Image
              key={`slide-${index}-${imgUrl}`}
              src={imgUrl}
              alt={`${primaryText} - Image ${index + 1}`}
              fill
              unoptimized={isExternalUrl(imgUrl)}
              className={`object-cover transition-opacity duration-500 ${
                index === currentSlideIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      )}

      <div
        className={`relative z-10 flex h-full w-full flex-col justify-start px-0 pt-0 pb-5 sm:pt-0 sm:pb-6 transition-opacity duration-300 ${
          isVideoPlaying || showSlideshow
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <div className="flex w-full flex-col gap-2 text-white">
          <div className="relative flex w-full flex-wrap items-start gap-2">
            <div
              className={`pointer-events-none absolute top-0 left-0 right-0 bottom-[-5px] ${
                isChat
                  ? "bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0.15)_100%)]"
                  : "bg-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0.85)_50%,rgba(0,0,0,0)_100%)]"
              }`}
              aria-hidden
            />
            <div className="relative z-10 flex w-full items-center justify-between gap-2">
              {isChat ? (
                <p className="min-w-0 flex-1 text-left font-figtree text-[16px] leading-snug font-semibold tracking-[0px] text-[#FCFCFC]">
                  <span className="font-bebas text-[32px] leading-[32px] tracking-[1px] text-white">
                    {primaryText}
                  </span>{" "}
                  {displaySecondary}
                </p>
              ) : (
                <div className="w-full min-w-0">
                  {/* Mobile layout */}
                  <div className="flex w-full flex-col gap-0 sm:hidden">
                    <div className="w-full min-w-0">
                      <h3 className="truncate text-left font-bebas text-[32px] leading-none tracking-[1px]">
                        {primaryText}
                      </h3>
                    </div>
                    <div className="flex w-full items-center justify-between gap-1">
                      <p className="min-w-0 flex-1 truncate text-left font-figtree text-[16px] leading-none font-semibold tracking-[0px] text-[#FCFCFC]">
                        {secondaryText}
                      </p>
                      {showPill && (
                        <div className="inline-flex shrink-0 items-center rounded-lg bg-[#A80A0899] px-3 py-1 font-figtree text-[12px] leading-none font-semibold tracking-[0px] text-[#FCFCFC] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                          <span className="mr-1 text-[10px]">🔥</span>
                          {pillLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden w-full items-center justify-between gap-2 sm:flex">
                    <h3 className="min-w-0 shrink truncate text-left font-bebas text-[32px] leading-[32px] tracking-[1px]">
                      {primaryText}
                    </h3>
                    <p className="shrink-0 truncate text-center font-figtree text-[16px] leading-none font-semibold tracking-[0px] text-[#FCFCFC] max-w-[40%]">
                      {secondaryText}
                    </p>
                    {showPill && (
                      <div className="inline-flex shrink-0 items-center rounded-lg bg-[#A80A0899] px-3 py-1 font-figtree text-[12px] leading-none font-semibold tracking-[0px] text-[#FCFCFC] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                        <span className="mr-1 text-[10px]">🔥</span>
                        {pillLabel}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {filmsCountLabel && (
            <span className="font-bebas text-[14px] leading-none tracking-[0px] text-[#FCFCFC99]">
              {filmsCountLabel}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (navigateUrl) {
    return (
      <a
        ref={(el) => {
          cardRef.current = el;
        }}
        href={navigateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <article
      ref={(el) => {
        cardRef.current = el;
      }}
      className={cardClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {cardContent}
    </article>
  );
};
