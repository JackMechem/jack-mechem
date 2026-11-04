"use client";

/**
 * Which of the given page sections is "in view", for highlighting the top-bar
 * link (components/layout/NavLinks.tsx).
 *
 * A section counts as in view when it covers a line 35% of the way down the
 * screen (below the top bar). At the very bottom of the page the last
 * visible section wins, so a short final section (Contact) can still be
 * active. Returns null when none qualifies, e.g. on the hero.
 */
import { useEffect, useState } from "react";

const PROBE = 0.35; // how far down the screen the "in view" line sits

export function useActiveSection(ids: readonly string[], enabled = true) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      requestAnimationFrame(() => setActive(null));
      return;
    }
    const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) || 0;

    const measure = () => {
      const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const visible = sections.filter((el) => el.getBoundingClientRect().top < innerHeight);
        return visible.at(-1)?.id ?? null;
      }
      const line = bar + (innerHeight - bar) * PROBE;
      const hit = sections.find((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      return hit?.id ?? null;
    };

    // measure at most once per frame while scrolling
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setActive(measure());
      });
    };

    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [ids, enabled]);

  return active;
}
