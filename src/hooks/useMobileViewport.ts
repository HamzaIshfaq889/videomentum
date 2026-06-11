import { useEffect } from "react";

/**
 * Handle mobile viewport intersection observer for auto-play
 * 
 * @param isMobile - Whether device is mobile
 * @param cardRef - Ref to the card element
 * @param shouldShowVideo - Whether video is available
 * @param hasSlideshow - Whether slideshow is available
 * @param primaryText - Card title for logging
 * @param setShowVideo - Setter for showVideo state
 * @param setShowSlideshow - Setter for showSlideshow state
 * @param setIsVideoPlaying - Setter for isVideoPlaying state
 * @param setCurrentSlideIndex - Setter for currentSlideIndex state
 */
export function useMobileViewport(
  isMobile: boolean,
  cardRef: React.RefObject<HTMLElement | null>,
  shouldShowVideo: boolean,
  hasSlideshow: boolean,
  primaryText: string,
  setShowVideo: (show: boolean) => void,
  setShowSlideshow: (show: boolean) => void,
  setIsVideoPlaying: (playing: boolean) => void,
  setCurrentSlideIndex: (index: number) => void,
): void {
  useEffect(() => {
    if (!isMobile || !cardRef.current) return;
    if (!shouldShowVideo && !hasSlideshow) return;

    // console.log("🔍 Setting up IntersectionObserver for:", primaryText);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // console.log(`✅ Mobile: Card in viewport - ${primaryText}`);
            if (shouldShowVideo) {
              setShowVideo(true);
            } else if (hasSlideshow) {
              setShowSlideshow(true);
            }
          } else {
            // console.log(`❌ Mobile: Card left viewport - ${primaryText}`);
            setShowVideo(false);
            setIsVideoPlaying(false);
            setShowSlideshow(false);
            setCurrentSlideIndex(0);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [
    isMobile,
    shouldShowVideo,
    hasSlideshow,
    primaryText,
    cardRef,
    setShowVideo,
    setShowSlideshow,
    setIsVideoPlaying,
    setCurrentSlideIndex,
  ]);
}
