import { useState, useEffect } from "react";

/**
 * Detect if the device is mobile (touch-enabled without hover capability)
 * 
 * @returns boolean - true if mobile, false if desktop
 */
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check 1: Touch capability
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      
      // Check 2: Hover capability (unreliable on some Android devices)
      const hasHover = window.matchMedia("(hover: hover)").matches;
      
      // Check 3: Screen width (mobile typically < 1024px)
      const isMobileWidth = window.innerWidth < 1024;
      
      // Check 4: User agent (fallback for problematic devices)
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Prioritize touch + mobile width, or touch + mobile UA
      // Some devices (like Vivo) incorrectly report hover capability
      const isMobileDevice = hasTouch && (isMobileWidth || isMobileUA || !hasHover);

      // console.log("📱 Mobile Detection:", {
      //   hasTouch,
      //   hasHover,
      //   isMobileWidth,
      //   isMobileUA,
      //   result: isMobileDevice,
      //   userAgent: navigator.userAgent.substring(0, 50),
      // });

      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
