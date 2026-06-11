"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface VideoMetadata {
  fileSize: number; // bytes
  duration: number; // seconds
  bitrate: number; // Mbps
  url: string;
  timestamp: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_PREFIX = "video_metadata_";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse pipe-separated URLs from a string
 */
export function extractUrls(url?: string): string[] {
  if (!url) return [];
  return url
    .split("|")
    .map((u) => u.trim())
    .filter((u) => u.length > 0);
}

/**
 * Extract the first URL from a pipe-separated string
 */
export function extractFirstUrl(url?: string): string | undefined {
  const urls = extractUrls(url);
  return urls.length > 0 ? urls[0] : undefined;
}

/**
 * Create a cache key from video URL
 */
function getCacheKey(url: string): string {
  // Simple hash to keep localStorage key short
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return CACHE_PREFIX + Math.abs(hash).toString(36);
}

/**
 * Read cached metadata from localStorage
 */
function readCache(url: string): VideoMetadata | null {
  if (typeof window === "undefined") return null;

  try {
    const key = getCacheKey(url);
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const data: VideoMetadata = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    if (age > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Failed to read video metadata cache:", error);
    return null;
  }
}

/**
 * Write metadata to localStorage cache
 */
function writeCache(metadata: VideoMetadata): void {
  if (typeof window === "undefined") return;

  try {
    const key = getCacheKey(metadata.url);
    localStorage.setItem(key, JSON.stringify(metadata));
  } catch (error) {
    console.warn("Failed to write video metadata cache:", error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get video metadata (file size, duration, bitrate)
 *
 * @param videoUrl - URL of the video file
 * @returns VideoMetadata object or null if failed
 *
 * How it works:
 * 1. Check localStorage cache first
 * 2. Fetch first 8KB of video using Range header
 * 3. Parse MP4 structure to extract duration
 * 4. Get file size from Content-Range or Content-Length header
 * 5. Calculate bitrate = (fileSize * 8) / duration / 1000000 (Mbps)
 * 6. Cache result for 24 hours
 */
export async function getVideoMetadata(
  videoUrl: string,
): Promise<VideoMetadata | null> {
  // Step 1: Check cache
  const cached = readCache(videoUrl);
  if (cached) {
    console.log("Using cached video metadata:", cached);
    return cached;
  }

  try {
    // Step 2: Fetch metadata via API route (bypasses CORS)
    console.log("Fetching video metadata for:", videoUrl);

    const response = await fetch(
      `/v3/api/video-metadata?url=${encodeURIComponent(videoUrl)}`,
    );

    if (!response.ok) {
      console.warn("Failed to fetch video metadata:", response.status);
      return null;
    }

    // Step 3: Get metadata from API response
    const data = await response.json();

    if (data.error) {
      console.warn("Video metadata error:", data.error);
      return null;
    }

    const { fileSize, duration, bitrate } = data;

    if (!fileSize || !duration || !bitrate) {
      console.warn("Incomplete video metadata");
      return null;
    }

    // Step 4: Create metadata object
    const metadata: VideoMetadata = {
      fileSize,
      duration,
      bitrate,
      url: videoUrl,
      timestamp: Date.now(),
    };

    // Step 5: Cache it
    writeCache(metadata);

    console.log("Video metadata retrieved via API:", {
      url: videoUrl,
      fileSize: `${(fileSize / 1024 / 1024).toFixed(2)} MB`,
      duration: `${duration.toFixed(2)}s`,
      bitrate: `${bitrate.toFixed(2)} Mbps`,
    });

    return metadata;
  } catch (error) {
    console.error("Failed to get video metadata:", error);
    return null;
  }
}

/**
 * Check if a video can be played based on user's bandwidth
 *
 * @param videoUrl - URL of the video
 * @param userBandwidthMbps - User's bandwidth in Mbps
 * @param safetyMargin - Safety margin multiplier (default 1.2 = use 120% of bandwidth)
 * @returns true if video can play smoothly, false otherwise
 */
export async function canPlayVideo(
  videoUrl: string,
  userBandwidthMbps: number,
  safetyMargin: number = 1.2,
): Promise<boolean> {
  const metadata = await getVideoMetadata(videoUrl);

  if (!metadata) {
    // If we can't get metadata, assume it's too risky
    return false;
  }

  // Use 120% of available bandwidth as safe threshold (aggressive playback)
  const availableBandwidth = userBandwidthMbps * safetyMargin;
  const canPlay = metadata.bitrate <= availableBandwidth;

  console.log("Video playback check:", {
    url: videoUrl,
    videoBitrate: `${metadata.bitrate.toFixed(2)} Mbps`,
    userBandwidth: `${userBandwidthMbps.toFixed(2)} Mbps`,
    available: `${availableBandwidth.toFixed(2)} Mbps`,
    canPlay,
  });

  return canPlay;
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Decision Logic
// ─────────────────────────────────────────────────────────────────────────────

export type ContentDecision = {
  showVideo: boolean;
  showSlideshow: boolean;
  videoUrl?: string;
  reason: string;
};

/**
 * Decide what content to show based on bandwidth and available media
 *
 * Decision flow:
 * 1. If video exists and bandwidth available:
 *    - Check video metadata & compare with bandwidth
 *    - Play video if sufficient bandwidth
 *    - Fallback to slideshow if video too heavy
 * 2. If metadata fails:
 *    - Conservative: show slideshow if available
 * 3. If no bandwidth data:
 *    - Conservative: show slideshow if available
 *    - Optimistic: show video if no slideshow
 *
 * @param videoUrl - URL of the video to check (can be preview or teaser)
 * @param bandwidthMbps - User's bandwidth in Mbps (null if not detected)
 * @param hasSlideshow - Whether slideshow is available as fallback
 * @returns Decision object indicating what to show and why
 */
export async function decideContentToShow(
  videoUrl: string | undefined,
  bandwidthMbps: number | null,
  hasSlideshow: boolean,
): Promise<ContentDecision> {
  // No video available
  if (!videoUrl) {
    if (hasSlideshow) {
      return {
        showVideo: false,
        showSlideshow: true,
        reason: "No video available, showing slideshow",
      };
    }
    return {
      showVideo: false,
      showSlideshow: false,
      reason: "No video or slideshow available",
    };
  }

  console.log("🎬 Fetching video metadata on hover...");
  console.log("📊 User bandwidth:", {
    speed: bandwidthMbps ? `${bandwidthMbps.toFixed(2)} Mbps` : "unknown",
  });

  // Fetch video metadata
  const metadata = await getVideoMetadata(videoUrl);

  // Case 1: Metadata retrieved successfully
  if (metadata && bandwidthMbps) {
    console.log("✅ Video metadata retrieved:", {
      url: videoUrl,
      fileSize: `${(metadata.fileSize / 1024 / 1024).toFixed(2)} MB`,
      duration: `${metadata.duration.toFixed(2)}s`,
      bitrate: `${metadata.bitrate.toFixed(2)} Mbps`,
    });

    const availableBandwidth = bandwidthMbps * 1.2;
    const canPlay = metadata.bitrate <= availableBandwidth;

    console.log("🔍 Comparison:", {
      userBandwidth: `${bandwidthMbps.toFixed(2)} Mbps`,
      availableBandwidth: `${availableBandwidth.toFixed(2)} Mbps (120%)`,
      videoBitrate: `${metadata.bitrate.toFixed(2)} Mbps`,
      canPlay: canPlay ? "✅ YES" : "❌ NO",
    });

    if (canPlay) {
      console.log("✅ Playing video (sufficient bandwidth)");
      return {
        showVideo: true,
        showSlideshow: false,
        videoUrl,
        reason: "Sufficient bandwidth for video",
      };
    } else {
      console.log("⚠️ Video too heavy, checking alternatives...");
      if (hasSlideshow) {
        console.log("📸 Showing slideshow instead");
        return {
          showVideo: false,
          showSlideshow: true,
          reason: "Video bitrate exceeds bandwidth, showing slideshow",
        };
      } else {
        console.log("🖼️ Showing static thumbnail only");
        return {
          showVideo: false,
          showSlideshow: false,
          reason: "Video too heavy, no slideshow available",
        };
      }
    }
  }

  // Case 2: Metadata fetch failed
  if (!metadata) {
    console.log("❌ Failed to get video metadata, using fallback");
    if (hasSlideshow) {
      console.log("📸 Showing slideshow (safe fallback)");
      return {
        showVideo: false,
        showSlideshow: true,
        reason: "Metadata unavailable, safe fallback to slideshow",
      };
    } else {
      console.log("🖼️ Showing static thumbnail only");
      return {
        showVideo: false,
        showSlideshow: false,
        reason: "Metadata unavailable, no slideshow available",
      };
    }
  }

  // Case 3: No bandwidth data (conservative approach)
  console.log("⚠️ No bandwidth data, using conservative approach");
  if (hasSlideshow) {
    console.log("📸 Showing slideshow (no bandwidth data)");
    return {
      showVideo: false,
      showSlideshow: true,
      reason: "Bandwidth unknown, conservative fallback to slideshow",
    };
  } else {
    console.log("🎬 Showing video optimistically (no slideshow available)");
    return {
      showVideo: true,
      showSlideshow: false,
      videoUrl,
      reason: "Bandwidth unknown, showing video optimistically",
    };
  }
}
