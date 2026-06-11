'use client';

import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Global Viewport Manager (Singleton)
// ─────────────────────────────────────────────────────────────────────────────

type CardState = {
  element: HTMLElement;
  id: string;
  startPreview: () => void;
  stopPreview: () => void;
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingRect: DOMRect | null;
};

class ViewportManager {
  private cards = new Map<string, CardState>();
  private observer: IntersectionObserver | null = null;
  private currentPlayingId: string | null = null;
  private evaluationTimeout: ReturnType<typeof setTimeout> | null = null;
  private isEvaluating = false; // Prevent concurrent evaluations

  constructor() {
    if (typeof window === 'undefined') return;

    // Create IntersectionObserver with thresholds
    this.observer = new IntersectionObserver(
      (entries) => {
        let needsEvaluation = false;

        entries.forEach((entry) => {
          const cardId = (entry.target as HTMLElement).dataset.cardId;
          if (!cardId) return;

          const card = this.cards.get(cardId);
          if (!card) return;

          const wasFullyVisible = card.intersectionRatio === 1.0;
          const isFullyVisible = entry.intersectionRatio === 1.0;

          // Update card state
          card.isIntersecting = entry.isIntersecting;
          card.intersectionRatio = entry.intersectionRatio;
          card.boundingRect = entry.isIntersecting
            ? entry.boundingClientRect
            : null;

          // console.log(`📍 Card "${cardId}" visibility:`, {
          //   visible: entry.isIntersecting,
          //   ratio: `${(entry.intersectionRatio * 100).toFixed(1)}%`,
          //   fullyVisible: isFullyVisible,
          //   currentlyPlaying: this.currentPlayingId === cardId,
          // });

          // CRITICAL: If this card was playing and lost even 1% visibility, stop immediately
          if (
            this.currentPlayingId === cardId &&
            wasFullyVisible &&
            !isFullyVisible
          ) {
            // console.log(`⚠️ Card "${cardId}" lost full visibility, stopping immediately!`);
            card.stopPreview();
            this.currentPlayingId = null;
            needsEvaluation = true; // Find next best card
          }

          // Also stop if card is currently playing but not in the cards list anymore
          // (shouldn't happen, but defensive programming)
          if (this.currentPlayingId === cardId && !isFullyVisible) {
            card.stopPreview();
            if (this.currentPlayingId === cardId) {
              this.currentPlayingId = null;
            }
            needsEvaluation = true;
          }

          // If card became fully visible or visibility changed significantly
          if (isFullyVisible || !entry.isIntersecting) {
            needsEvaluation = true;
          }
        });

        // Evaluate immediately if needed
        if (needsEvaluation) {
          this.scheduleEvaluation();
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 0.95, 0.99, 1.0], // Fine-grained tracking
        rootMargin: '-111px 0px 0px 0px', // Exclude header (56px) + tabs (55px) from top
      }
    );
  }

  /**
   * Register a card with the viewport manager
   */
  registerCard(
    element: HTMLElement,
    id: string,
    startPreview: () => void,
    stopPreview: () => void
  ) {
    const card: CardState = {
      element,
      id,
      startPreview,
      stopPreview,
      isIntersecting: false,
      intersectionRatio: 0,
      boundingRect: null,
    };

    this.cards.set(id, card);
    element.dataset.cardId = id;

    if (this.observer) {
      this.observer.observe(element);
    }

    // console.log(`✅ Registered card: "${id}"`);

    // Evaluate immediately after registration
    this.scheduleEvaluation();
  }

  /**
   * Unregister a card when it unmounts
   */
  unregisterCard(id: string) {
    const card = this.cards.get(id);
    if (card) {
      if (this.observer) {
        this.observer.unobserve(card.element);
      }
      if (this.currentPlayingId === id) {
        this.currentPlayingId = null;
      }
      this.cards.delete(id);
      // console.log(`❌ Unregistered card: "${id}"`);

      // Re-evaluate after unregistration
      this.scheduleEvaluation();
    }
  }

  /**
   * Schedule evaluation with debouncing
   */
  private scheduleEvaluation() {
    if (this.evaluationTimeout) {
      clearTimeout(this.evaluationTimeout);
    }

    this.evaluationTimeout = setTimeout(() => {
      this.evaluateAndPlayBest();
    }, 50); // 50ms debounce for fast response
  }

  /**
   * Find and play the topmost fully visible card
   */
  private evaluateAndPlayBest() {
    // Prevent concurrent evaluations (race condition guard)
    if (this.isEvaluating) {
      // console.log('⏳ Evaluation already in progress, skipping...');
      return;
    }

    this.isEvaluating = true;

    try {
      // Get all cards that are 100% visible (strict requirement)
      const fullyVisibleCards = Array.from(this.cards.values()).filter(
        (card) => card.isIntersecting && card.intersectionRatio === 1.0
      );

      // If no cards are fully visible, stop all
      if (fullyVisibleCards.length === 0) {
        // console.log('🛑 No fully visible cards, stopping all previews');
        this.stopAllPreviews();
        return;
      }

      // Find the topmost card (smallest Y position)
      const topmostCard = fullyVisibleCards.reduce((topmost, card) => {
        const topmostY = topmost.boundingRect?.top ?? Infinity;
        const cardY = card.boundingRect?.top ?? Infinity;
        return cardY < topmostY ? card : topmost;
      });

      // console.log(`🎯 Topmost fully visible card: "${topmostCard.id}" at Y=${topmostCard.boundingRect?.top.toFixed(0)}`);

      // Play only if not already playing
      if (this.currentPlayingId !== topmostCard.id) {
        this.playCard(topmostCard);
      }
    } finally {
      // Always release the lock
      this.isEvaluating = false;
    }
  }

  /**
   * Play a specific card (stops others first)
   */
  private playCard(card: CardState) {
    // Verify card is still fully visible before playing
    if (!card.isIntersecting || card.intersectionRatio !== 1.0) {
      // console.log(`⚠️ Card "${card.id}" no longer fully visible, skipping play`);
      return;
    }

    // CRITICAL: Stop ALL cards first to prevent race conditions
    // console.log(`🛑 Stopping all other cards before playing "${card.id}"`);
    this.cards.forEach((otherCard) => {
      if (otherCard.id !== card.id) {
        otherCard.stopPreview();
      }
    });

    // Clear current playing ID
    this.currentPlayingId = null;

    // Start new card
    // console.log(`▶️  Playing: "${card.id}"`);
    card.startPreview();
    this.currentPlayingId = card.id;
  }

  /**
   * Stop all previews
   */
  private stopAllPreviews() {
    // console.log('🛑 Stopping all card previews');
    this.cards.forEach((card) => {
      card.stopPreview();
    });
    this.currentPlayingId = null;
  }

  /**
   * Manually stop a specific card (for touch interactions)
   */
  stopCard(id: string) {
    const card = this.cards.get(id);
    if (card) {
      card.stopPreview();
      if (this.currentPlayingId === id) {
        this.currentPlayingId = null;
        // Re-evaluate to play next best card
        this.scheduleEvaluation();
      }
    }
  }

  /**
   * Manually play a specific card (for touch interactions)
   */
  playCardById(id: string) {
    const card = this.cards.get(id);
    if (card) {
      this.playCard(card);
    }
  }
}

// Global singleton instance
const viewportManager = new ViewportManager();

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useViewportAutoPlay - Auto-play the topmost fully visible card
 * 
 * Rules:
 * - Only cards with 100% visibility can play
 * - If playing card loses even 1% visibility, stops immediately
 * - Next topmost 100% visible card starts playing
 * - If card returns to 100% visibility, can play again
 * 
 * Usage:
 * ```tsx
 * useViewportAutoPlay({
 *   enabled: isMobile,
 *   cardId: primaryText,
 *   cardRef,
 *   startPreview: () => { setShowVideo(true); },
 *   stopPreview: () => { setShowVideo(false); setShowSlideshow(false); },
 * });
 * ```
 */
export function useViewportAutoPlay({
  enabled,
  cardId,
  cardRef,
  startPreview,
  stopPreview,
}: {
  enabled: boolean;
  cardId: string;
  cardRef: React.MutableRefObject<HTMLElement | null>;
  startPreview: () => void;
  stopPreview: () => void;
}) {
  const isRegistered = useRef(false);

  useEffect(() => {
    if (!enabled || !cardRef.current || isRegistered.current) return;

    // Register with viewport manager
    viewportManager.registerCard(
      cardRef.current,
      cardId,
      startPreview,
      stopPreview
    );

    isRegistered.current = true;

    // Cleanup on unmount
    return () => {
      if (isRegistered.current) {
        viewportManager.unregisterCard(cardId);
        isRegistered.current = false;
      }
    };
  }, [enabled, cardId, cardRef, startPreview, stopPreview]);

  // Return manager methods for manual control
  return {
    stopCard: () => viewportManager.stopCard(cardId),
    playCard: () => viewportManager.playCardById(cardId),
  };
}
