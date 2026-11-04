"use client";

/**
 * Horizontal swipe detection for touch screens (used by the screenshot viewer).
 * Calls `onSwipe(1)` for a swipe to the left (next) and `onSwipe(-1)` for a
 * swipe to the right (previous). Mostly-vertical drags are ignored so the
 * page still scrolls; pair it with `touch-action: pan-y` on the element.
 */
import { useEffect, useRef, type RefObject } from "react";

const MIN_DISTANCE = 50; // px of horizontal travel that counts as a swipe

export function useSwipe(target: RefObject<HTMLElement | null>, onSwipe: (dir: 1 | -1) => void, enabled = true) {
  // the listeners are attached once; read the latest callback from a ref
  const callback = useRef(onSwipe);
  useEffect(() => {
    callback.current = onSwipe;
  }, [onSwipe]);

  useEffect(() => {
    const el = target.current;
    if (!el || !enabled) return;
    let start: { x: number; y: number } | null = null;

    const onStart = (e: TouchEvent) => {
      // two fingers is a pinch, not a swipe
      start = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    };
    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      start = null;
      if (Math.abs(dx) >= MIN_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) callback.current(dx < 0 ? 1 : -1);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [target, enabled]);
}
