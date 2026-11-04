"use client";

/**
 * Desktop scroll paging for the home page. One wheel or trackpad gesture moves
 * exactly one section — hero → work → gigs → archive → about — like the nav
 * links do. Sections taller than the screen scroll normally until their edge.
 * The rest of a gesture's momentum is swallowed so one swipe never skips two
 * sections. Phones and short windows scroll normally.
 *
 * A section takes part by having the `page-stop` class. Renders nothing.
 */
import { useEffect } from "react";
import { wheelPixels } from "@/lib/wheel";

const STOPS = ".page-stop";
const DESKTOP = "(min-width: 981px) and (min-height: 640px)"; // keep in sync with the CSS that sizes #crate / #archive
const SETTLE_MS = 750; // how long a page move takes before new input counts

/** True if an element under the pointer can still scroll itself in this direction. */
function canScrollInside(target: EventTarget | null, dy: number) {
  for (let el = target as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
    const overflow = getComputedStyle(el).overflowY;
    if ((overflow === "auto" || overflow === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
  }
  return false;
}

export function SectionPager() {
  useEffect(() => {
    const desktop = matchMedia(DESKTOP);
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const barHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) || 48;
    let busyUntil = 0;
    let lastWheel = 0;
    let swallowing = false;

    // For each section: the scroll position that puts its top under the top bar,
    // and the one that puts its bottom at the bottom of the screen.
    const stops = () =>
      [...document.querySelectorAll<HTMLElement>(STOPS)].map((el) => {
        const top = el.getBoundingClientRect().top + scrollY - barHeight();
        const end = Math.max(top, top + el.offsetHeight + barHeight() - innerHeight);
        return { top, end };
      });

    const scrollToY = (y: number) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      scrollTo({ top: Math.max(0, Math.min(max, Math.round(y))), behavior: reducedMotion.matches ? "auto" : "smooth" });
      busyUntil = performance.now() + SETTLE_MS;
      swallowing = true;
    };

    const onWheel = (e: WheelEvent) => {
      // off on small screens, when zooming, and while the record preview has locked scrolling
      if (!desktop.matches || e.ctrlKey || document.documentElement.style.overflow === "hidden") return;

      const now = performance.now();
      const sinceLast = now - lastWheel;
      lastWheel = now;
      if (swallowing) {
        if (now < busyUntil || sinceLast < 160) return void e.preventDefault();
        swallowing = false;
      }

      const dy = wheelPixels(e);
      if (Math.abs(dy) < 2 || canScrollInside(e.target, dy)) return;
      const sections = stops();
      if (!sections.length) return;

      // the section we're in: the last one whose top we've reached
      const y = scrollY;
      let i = 0;
      sections.forEach((s, k) => {
        if (y >= s.top - 2) i = k;
      });
      const current = sections[i];

      if (dy > 0) {
        if (y < current.end - 2) {
          // tall section: scroll normally, but stop at its bottom edge
          if (y + dy > current.end) {
            e.preventDefault();
            scrollToY(current.end);
          }
          return;
        }
        if (i + 1 < sections.length) {
          e.preventDefault();
          scrollToY(sections[i + 1].top);
        }
        // past the last stop: scroll on to the footer normally
      } else {
        if (y > current.top + 2) {
          if (y + dy < current.top) {
            e.preventDefault();
            scrollToY(current.top);
          }
          return;
        }
        if (i > 0) {
          e.preventDefault();
          scrollToY(sections[i - 1].end);
        }
      }
    };

    addEventListener("wheel", onWheel, { passive: false });
    return () => removeEventListener("wheel", onWheel);
  }, []);

  return null;
}
