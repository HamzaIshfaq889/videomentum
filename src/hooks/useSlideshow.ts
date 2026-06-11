import { useState, useEffect, useRef } from "react";

/**
 * Handle slideshow cycling logic
 * 
 * @param showSlideshow - Whether to show the slideshow
 * @param slideImages - Array of image URLs
 * @param slideInterval - Interval in ms between slides (default 1500)
 * @returns Current slide index and interval ref for cleanup
 */
export function useSlideshow(
  showSlideshow: boolean,
  slideImages: string[],
  slideInterval: number = 1500,
): {
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  slideshowIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | undefined>;
} {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slideshowIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (!showSlideshow || slideImages.length <= 1) return;

    slideshowIntervalRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slideImages.length);
    }, slideInterval);

    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = undefined;
      }
    };
  }, [showSlideshow, slideImages.length, slideInterval]);

  return { currentSlideIndex, setCurrentSlideIndex, slideshowIntervalRef };
}
