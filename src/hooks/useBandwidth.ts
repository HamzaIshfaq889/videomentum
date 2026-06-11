'use client';

import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type BandwidthTier = 'unknown' | 'very-low' | 'low' | 'medium' | 'high';

interface BandwidthCache {
  tier: BandwidthTier;
  measuredMbps: number | null;
  timestamp: number;
}

interface NavigatorConnection {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  addEventListener?: (type: string, listener: EventListener) => void;
  removeEventListener?: (type: string, listener: EventListener) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_KEY = 'bandwidth_tier';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map measured Mbps to bandwidth tier
 * 
 * Tier breakdown:
 * - very-low: < 1 Mbps (images only later)
 * - low: 1-3 Mbps (slideshow only later)
 * - medium: 3-8 Mbps (teaser if small file later)
 * - high: 8+ Mbps (full teaser later)
 */
function mbpsToTier(mbps: number): BandwidthTier {
  if (mbps < 1) return 'very-low';
  if (mbps < 3) return 'low';
  if (mbps < 8) return 'medium';
  return 'high';
}

/**
 * Get instant rough estimate from navigator.connection
 * Provides immediate feedback before accurate measurement completes
 */
function getConnectionEstimate(): { tier: BandwidthTier; mbps: number | null } {
  if (typeof window === 'undefined') {
    return { tier: 'unknown', mbps: null };
  }

  const nav = navigator as NavigatorConnection & { connection?: NavigatorConnection; mozConnection?: NavigatorConnection; webkitConnection?: NavigatorConnection };
  const conn: NavigatorConnection | undefined = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!conn) {
    // Firefox and some browsers don't support navigator.connection
    return { tier: 'unknown', mbps: null };
  }

  // Use downlink if available (more accurate, in Mbps)
  if (typeof conn?.downlink === 'number') {
    return {
      tier: mbpsToTier(conn.downlink),
      mbps: conn.downlink,
    };
  }

  // Fall back to effectiveType (less accurate but still useful)
  if (conn.effectiveType) {
    const typeMap: Record<string, BandwidthTier> = {
      'slow-2g': 'very-low',
      '2g': 'very-low',
      '3g': 'low',
      '4g': 'high',
    };
    return {
      tier: typeMap[conn.effectiveType] || 'medium',
      mbps: null,
    };
  }

  return { tier: 'unknown', mbps: null };
}

// measureBandwidth() function removed - now using instant navigator.connection detection only

/**
 * Read cached bandwidth data from localStorage
 * Returns null if cache doesn't exist or has expired
 */
function readCache(): BandwidthCache | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: BandwidthCache = JSON.parse(cached);
    const age = Date.now() - data.timestamp;

    if (age > CACHE_EXPIRY_MS) {
      // Cache expired
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Failed to read bandwidth cache:', error);
    return null;
  }
}

/**
 * Write bandwidth data to localStorage cache
 * Cached for 5 minutes to avoid repeated detections
 */
function writeCache(tier: BandwidthTier, measuredMbps: number | null): void {
  if (typeof window === 'undefined') return;

  try {
    const data: BandwidthCache = {
      tier,
      measuredMbps,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to write bandwidth cache:', error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Global State Management
// ─────────────────────────────────────────────────────────────────────────────

// Global flag to ensure bandwidth is detected only once across ALL component instances
let globalMeasurementComplete = false;

// Subscribers that listen for bandwidth updates
const subscribers = new Set<(tier: BandwidthTier, mbps: number | null) => void>();

function notifySubscribers(tier: BandwidthTier, mbps: number | null) {
  subscribers.forEach((callback) => callback(tier, mbps));
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useBandwidth - Detect user's network bandwidth and categorize into tiers
 * 
 * Usage:
 * ```tsx
 * const { tier, mbps, isDetecting } = useBandwidth();
 * ```
 * 
 * Returns:
 * - tier: BandwidthTier - 'unknown' | 'very-low' | 'low' | 'medium' | 'high'
 * - mbps: number | null - Estimated speed in Mbps from navigator.connection, null if not available
 * - isDetecting: boolean - Always false (instant detection via navigator.connection)
 * 
 * How it works:
 * 1. Checks localStorage cache (5 min expiry) - instant if cached
 * 2. Uses navigator.connection API for instant bandwidth detection (no file fetch)
 * 3. Caches result to localStorage for 5 minutes
 * 4. Listens for connection changes and re-detects if network changes
 * 5. All component instances share the same detection (singleton pattern)
 */
export function useBandwidth() {
  // Initialize state with cached value or instant estimate to avoid setState in effect
  const [tier, setTier] = useState<BandwidthTier>(() => {
    if (typeof window === 'undefined') return 'unknown';
    const cached = readCache();
    if (cached) return cached.tier;
    const estimate = getConnectionEstimate();
    return estimate.tier;
  });

  const [mbps, setMbps] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const cached = readCache();
    if (cached) return cached.measuredMbps;
    const estimate = getConnectionEstimate();
    return estimate.mbps;
  });

  const [isDetecting, setIsDetecting] = useState(false);

  // Subscribe to global bandwidth updates
  useEffect(() => {
    const handleUpdate = (newTier: BandwidthTier, newMbps: number | null) => {
      setTier(newTier);
      setMbps(newMbps);
      setIsDetecting(false);
    };

    subscribers.add(handleUpdate);

    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  // Main detection logic - runs ONCE globally across all component instances
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Step 1: Check cache first (instant if available)
    const cached = readCache();
    if (cached) {
      // console.log('📦 Using cached bandwidth:', {
      //   tier: cached.tier,
      //   mbps: cached.measuredMbps?.toFixed(2),
      //   age: `${Math.round((Date.now() - cached.timestamp) / 1000)}s ago`,
      // });
      globalMeasurementComplete = true;
      return;
    }

    // Step 2: If already detected, don't detect again
    if (globalMeasurementComplete) {
      return;
    }

    // Step 3: Mark as complete (global lock)
    globalMeasurementComplete = true;

    // Step 4: Use instant navigator.connection estimate
    const estimate = getConnectionEstimate();
    const finalTier = estimate.tier !== 'unknown' ? estimate.tier : 'medium';
    const finalMbps = estimate.mbps;

    // Cache the estimate
    writeCache(finalTier, finalMbps);
    
    // console.log('✅ Bandwidth detected (navigator.connection):', {
    //   speed: finalMbps ? `${finalMbps.toFixed(2)} Mbps` : 'N/A',
    //   tier: finalTier,
    // });
    
    // Notify all subscribers
    notifySubscribers(finalTier, finalMbps);
  }, []);

  // Listen for connection changes - re-measure if network changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nav = navigator as NavigatorConnection & { connection?: NavigatorConnection; mozConnection?: NavigatorConnection; webkitConnection?: NavigatorConnection };
    const conn: NavigatorConnection | undefined = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!conn || !conn.addEventListener) return;

    const handleConnectionChange = () => {
      // console.log('🔄 Connection changed, re-detecting bandwidth...');
      
      // Reset global flag
      globalMeasurementComplete = false;

      // Clear cache
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch (e) {
        console.warn('Failed to clear bandwidth cache:', e);
      }

      // Get new instant estimate
      const estimate = getConnectionEstimate();
      const finalTier = estimate.tier !== 'unknown' ? estimate.tier : 'medium';
      const finalMbps = estimate.mbps;
      
      // Cache the new estimate
      writeCache(finalTier, finalMbps);
      
      // console.log('✅ Bandwidth re-detected:', {
      //   speed: finalMbps ? `${finalMbps.toFixed(2)} Mbps` : 'N/A',
      //   tier: finalTier,
      // });
      
      // Notify all subscribers with new estimate
      notifySubscribers(finalTier, finalMbps);
      
      globalMeasurementComplete = true;
    };

    conn.addEventListener('change', handleConnectionChange);

    return () => {
      if (conn.removeEventListener) {
        conn.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return {
    tier,
    mbps,
    isDetecting,
  };
}
