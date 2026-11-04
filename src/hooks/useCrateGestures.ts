"use client";

/**
 * Scroll and swipe handling for the record crate (components/home/CrateBrowser.tsx).
 *
 * - Mouse wheel / trackpad over a record flips through the crate. The first
 *   tick of a gesture flips straight away, then one record per STEP pixels.
 *   Once a gesture has flipped a record it stays with the crate until it ends,
 *   so trackpad momentum never flings the page. At the first/last record a
 *   fresh gesture scrolls the page instead.
 * - Touch: a vertical swipe that starts on a record flips it (drag down = next
 *   record, like pulling the front one toward you). Swipes anywhere else
 *   scroll the page as normal.
 *
 * Only events that start on a `.crate-record` are handled.
 */
import { useEffect, useRef, type RefObject } from "react";
import { wheelPixels } from "@/lib/wheel";

const STEP = 180; // wheel pixels per record after the first
const GESTURE_GAP = 250; // ms of quiet that ends a wheel gesture
const SWIPE = 45; // touch pixels per record

type Options = {
  /** The crate element to listen on. */
  crate: RefObject<HTMLElement | null>;
  /** Index of the front record, and the last valid index. */
  front: number;
  last: number;
  /** Called with the new front index. */
  setFront: (i: number) => void;
  /** Re-attach listeners when this changes (the crate element remounts on crate switch). */
  resetKey: unknown;
};

/** Returns a ref that is true right after a swipe, so the record's click handler can ignore it. */
export function useCrateGestures({ crate, front, last, setFront, resetKey }: Options) {
  // the listeners below are attached once, so they read the latest index from a ref
  const frontRef = useRef(front);
  useEffect(() => {
    frontRef.current = front;
  }, [front]);
  const justSwiped = useRef(false);

  useEffect(() => {
    const el = crate.current;
    if (!el) return;

    const flip = (dir: number) => {
      const next = frontRef.current + dir;
      if (next < 0 || next > last) return false;
      frontRef.current = next;
      setFront(next);
      return true;
    };
    const onRecord = (target: EventTarget | null) => !!(target as Element | null)?.closest(".crate-record");

    // --- wheel / trackpad ---
    let distance = 0;
    let lastEvent = 0;
    let ownsGesture = false;
    const onWheel = (e: WheelEvent) => {
      if (!onRecord(e.target)) return;
      const now = performance.now();
      const dy = wheelPixels(e);
      const newGesture = now - lastEvent > GESTURE_GAP;
      lastEvent = now;
      if (newGesture) {
        distance = 0;
        ownsGesture = false;
      }
      const dir = Math.sign(dy);
      const atEnd = (dir > 0 && frontRef.current === last) || (dir < 0 && frontRef.current === 0);
      if (atEnd && !ownsGesture) return; // let the page scroll on
      e.preventDefault();
      e.stopPropagation(); // keep the section pager out of it
      distance += dy;
      if (newGesture || Math.abs(distance) >= STEP) {
        if (flip(dir)) ownsGesture = true;
        distance = 0;
      }
    };

    // --- touch ---
    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      startY = onRecord(e.target) ? e.touches[0].clientY : null;
      justSwiped.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY === null) return;
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) > SWIPE) {
        flip(-Math.sign(dy));
        startY = e.touches[0].clientY;
        justSwiped.current = true;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [crate, last, setFront, resetKey]);

  return justSwiped;
}
