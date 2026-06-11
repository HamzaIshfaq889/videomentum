import { useEffect, useRef } from "react";

/**
 * Handle video playback control (play/pause/reset)
 * 
 * @param videoRef - Ref to the video element
 * @param showVideo - Whether to show and play the video
 * @param isVideoPlaying - Whether the video is currently playing
 */
export function useVideoPlayback(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  showVideo: boolean,
  isVideoPlaying: boolean,
): void {
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (showVideo) {
      video.currentTime = 0;

      playPromiseRef.current = video.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Video play failed:", err.name, err.message);
        }
      });
    } else {
      if (playPromiseRef.current) {
        playPromiseRef.current
          .then(() => {
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          })
          .catch(() => {});
        playPromiseRef.current = undefined;
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [videoRef, showVideo, isVideoPlaying]);
}
