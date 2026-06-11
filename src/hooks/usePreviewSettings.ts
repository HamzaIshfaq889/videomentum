'use client';

import { useEffect, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'video_previews_enabled';
const DEFAULT_ENABLED = true;

// ─────────────────────────────────────────────────────────────────────────────
// Module-level State (Singleton)
// ─────────────────────────────────────────────────────────────────────────────

let previewsEnabled = DEFAULT_ENABLED;
const subscribers = new Set<(enabled: boolean) => void>();

/**
 * Read preview setting from localStorage
 */
function readFromStorage(): boolean {
  if (typeof window === 'undefined') return DEFAULT_ENABLED;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return DEFAULT_ENABLED;
    return stored === 'true';
  } catch (error) {
    console.warn('Failed to read preview settings from localStorage:', error);
    return DEFAULT_ENABLED;
  }
}

/**
 * Write preview setting to localStorage
 */
function writeToStorage(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch (error) {
    console.warn('Failed to write preview settings to localStorage:', error);
  }
}

/**
 * Notify all subscribers of state change
 */
function notifySubscribers(enabled: boolean): void {
  subscribers.forEach((callback) => {
    try {
      callback(enabled);
    } catch (error) {
      console.error('Error in preview settings subscriber:', error);
    }
  });
}

/**
 * Initialize module-level state from localStorage (once)
 */
if (typeof window !== 'undefined') {
  previewsEnabled = readFromStorage();
  // console.log('🎬 Preview settings initialized:', { previewsEnabled });
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Toggle preview enabled/disabled state
 */
export function togglePreviews(): void {
  const newState = !previewsEnabled;
  previewsEnabled = newState;
  writeToStorage(newState);
  notifySubscribers(newState);
  // console.log('🎬 Preview settings toggled:', { previewsEnabled: newState });
}

/**
 * Get current preview enabled state (synchronous)
 */
export function getPreviewsEnabled(): boolean {
  return previewsEnabled;
}

// ─────────────────────────────────────────────────────────────────────────────
// React Hook
// ─────────────────────────────────────────────────────────────────────────────

export function usePreviewSettings() {
  const [enabled, setEnabled] = useState(() => {
    // Initialize from module-level state (runs once on mount)
    return previewsEnabled;
  });

  useEffect(() => {
    // Subscribe to changes from other instances
    const handleChange = (newEnabled: boolean) => {
      setEnabled(newEnabled);
    };

    subscribers.add(handleChange);

    return () => {
      subscribers.delete(handleChange);
    };
  }, []);

  return {
    previewsEnabled: enabled,
    togglePreviews,
  };
}
