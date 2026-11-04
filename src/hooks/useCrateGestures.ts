"use client";

/**
 * Scroll and swipe handling for the record crate (components/home/CrateBrowser.tsx).
 *
 * - Mouse wheel / trackpad: a gesture that starts on a record or the crate
 *   box (HOT) while the page is still flips through the crate. The first tick
 *   flips straight away, then one record per STEP pixels, stopping at the
 *   first/last record. The crate keeps the gesture until it ends (momentum
 *   included), even if the pointer drifts off as records move under it.
 *   A gesture that starts while the page is scrolling (in the last STILL_MS)
 *   belongs to the page, so scrolling past the crate never gets caught on it.
 *   Gestures come from wheelGesture (lib/wheel.ts).
 *   Blocking wheel events isn't enough in every browser (Firefox scrolls
 *   trackpad momentum off the main thread), so while the crate owns a
 *   gesture, and until it has died down, the page itself is made unscrollable
 *   with html.crate-scroll-lock (styles/crate.css).
 * - Touch: a vertical swipe that starts on a record flips it (drag down = next
 *   record, like pulling the front one toward you). Swipes anywhere else
 *   scroll the page as normal.
 */
import { useEffect, useRef, type RefObject } from "react";
import { wheelGesture, wheelPixels } from "@/lib/wheel";

const HOT = ".crate-record, .crate-front"; // the parts of the crate that capture scrolling
const STEP = 180; // wheel pixels per record after the first
const STILL_MS = 300; // the page must have stopped scrolling this long before the crate takes a gesture
const UNLOCK_AFTER = 300; // ms of wheel quiet before the page can scroll again
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
    const onHot = (target: EventTarget | null) => !!(target as Element | null)?.closest(HOT);

    // --- wheel / trackpad ---
    const root = document.documentElement;
    let owned = -1; // the wheel gesture the crate has taken over
    let flipped = false; // whether that gesture has flipped its first record yet
    let distance = 0;
    let lastPageScroll = -Infinity;
    let lastOwnedWheel = -Infinity;
    let unlockTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      lastPageScroll = performance.now();
    };
    // keep the page locked until the owned gesture has gone quiet
    const unlockLater = () => {
      clearTimeout(unlockTimer);
      const wait = UNLOCK_AFTER - (performance.now() - lastOwnedWheel);
      if (wait > 0) unlockTimer = setTimeout(unlockLater, wait);
      else root.classList.remove("crate-scroll-lock");
    };

    // listens on the window, before anything else, so it can hold on to its gesture anywhere
    const onWheel = (e: WheelEvent) => {
      const gesture = wheelGesture(e);
      if (e.ctrlKey) return;
      const now = performance.now();
      if (gesture.id !== owned) {
        const startsHere = gesture.start && el.contains(e.target as Node) && onHot(e.target);
        if (!startsHere || now - lastPageScroll < STILL_MS) return; // the page's
        owned = gesture.id;
        flipped = false;
        distance = 0;
      }
      lastOwnedWheel = now;
      root.classList.add("crate-scroll-lock");
      unlockLater();
      // Claim every event, even the empty one a trackpad swipe often starts with:
      // browsers only let a page block a scroll if it blocked the first event.
      e.preventDefault();
      e.stopPropagation();
      const dy = wheelPixels(e);
      if (!dy) return;
      if (!flipped) {
        flip(Math.sign(dy));
        flipped = true;
        return;
      }
      distance += dy;
      if (Math.abs(distance) >= STEP) {
        flip(Math.sign(dy));
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

    addEventListener("wheel", onWheel, { capture: true, passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(unlockTimer);
      root.classList.remove("crate-scroll-lock");
      removeEventListener("scroll", onScroll);
      removeEventListener("wheel", onWheel, { capture: true });
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [crate, last, setFront, resetKey]);

  return justSwiped;
}
