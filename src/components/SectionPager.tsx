"use client";

import { useEffect } from "react";

const SECTIONS = ".snap";
const DESKTOP = "(min-width: 981px) and (min-height: 640px)";
/** True if something under the pointer can scroll itself in this direction (e.g. the crate index). */
function innerScroller(target: EventTarget | null, dy: number) {
  for (let el = target as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
  }
  return false;
}

const pixels = (e: WheelEvent) => e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);

/**
 * Desktop only: one wheel/trackpad gesture moves exactly one section (hero, crate,
 * on stage, liner notes), like the nav links. Sections taller than the screen scroll
 * normally until their edge. The rest of a gesture's momentum is swallowed so one
 * swipe never skips two sections.
 */
export function SectionPager() {
  useEffect(() => {
    const desktop = matchMedia(DESKTOP);
    const bar = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) || 48;
    let busyUntil = 0;
    let lastWheel = 0;
    let swallowing = false;

    // Each section's scroll position when its top sits under the top bar, and where
    // its bottom would sit at the bottom of the screen (same for short sections).
    const stops = () =>
      [...document.querySelectorAll<HTMLElement>(SECTIONS)].map((el) => {
        const top = el.getBoundingClientRect().top + scrollY - bar();
        const end = Math.max(top, top + el.offsetHeight + bar() - innerHeight);
        return { top, end };
      });

    const go = (y: number) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      scrollTo({ top: Math.max(0, Math.min(max, Math.round(y))), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      busyUntil = performance.now() + 750;
      swallowing = true;
    };

    const onWheel = (e: WheelEvent) => {
      if (!desktop.matches || e.ctrlKey || document.documentElement.style.overflow === "hidden") return;
      const now = performance.now();
      const sinceLast = now - lastWheel;
      lastWheel = now;
      // swallow the rest of the gesture (trackpad momentum) after a page move
      if (swallowing) {
        if (now < busyUntil || sinceLast < 160) return void e.preventDefault();
        swallowing = false;
      }
      const dy = pixels(e);
      if (Math.abs(dy) < 2 || innerScroller(e.target, dy)) return;
      const y = scrollY;
      const s = stops();
      if (!s.length) return;
      // the section we're in: the last one whose top we've reached
      let i = 0;
      s.forEach((st, k) => { if (y >= st.top - 2) i = k; });
      const cur = s[i];
      if (dy > 0) {
        if (y < cur.end - 2) {
          // tall section: scroll normally, but don't overshoot its bottom
          if (y + dy > cur.end) (e.preventDefault(), go(cur.end));
          return;
        }
        if (i + 1 < s.length) (e.preventDefault(), go(s[i + 1].top));
        // past the last section's top: let the page reach the footer normally
      } else {
        if (y > cur.top + 2) {
          if (y + dy < cur.top) (e.preventDefault(), go(cur.top));
          return;
        }
        if (i > 0) (e.preventDefault(), go(s[i - 1].end));
      }
    };

    addEventListener("wheel", onWheel, { passive: false });
    return () => removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
