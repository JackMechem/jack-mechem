"use client";

/**
 * The section links in the top bar. On the home page the link for the
 * section currently in view is highlighted (aria-current), as you scroll,
 * and clicking one scrolls there with scrollToSection (below) rather than
 * through the router. Elsewhere they're ordinary links to /#section.
 * Styles: styles/layout.css (.topbar-nav)
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";

/** Links to the home page sections (their ids are set in app/(site)/page.tsx and components/home/*). */
const NAV = [
  { id: "crate", label: "Work" },
  { id: "gigs", label: "Gigs" },
  { id: "archive", label: "Archive" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;
const IDS = NAV.map((n) => n.id);

const SETTLE_MS = 150; // scrolling has stopped once it's been quiet this long
const RETRIES = 2; // how many times to finish a scroll that ended off target

/**
 * Smooth-scrolls to a section. On phones a long smooth scroll can stop short
 * or land off target (the browser bar resizes as it goes, images load and
 * shift the page), so once it settles, check where the section ended up and
 * scroll again if it isn't at the top. Gives up as soon as the visitor
 * scrolls themselves.
 */
function scrollToSection(el: HTMLElement) {
  const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) || 0;
  let tries = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const stop = () => {
    clearTimeout(timer);
    removeEventListener("scroll", onScroll);
    removeEventListener("touchstart", stop);
    removeEventListener("wheel", stop);
  };
  const check = () => {
    const off = Math.abs(el.getBoundingClientRect().top - bar);
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2; // a short last section can't reach the top
    if (off <= 2 || atBottom || tries++ >= RETRIES) return stop();
    el.scrollIntoView({ block: "start" });
    onScroll();
  };
  function onScroll() {
    clearTimeout(timer);
    timer = setTimeout(check, SETTLE_MS);
  }

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("touchstart", stop, { passive: true });
  addEventListener("wheel", stop, { passive: true });
  el.scrollIntoView({ block: "start" }); // smooth, or instant with reduced motion (html's scroll-behavior)
  onScroll();
}

export function NavLinks() {
  const onHome = usePathname() === "/";
  const active = useActiveSection(IDS, onHome);

  return NAV.map(({ id, label }) => (
    <Link
      key={id}
      href={`/#${id}`}
      aria-current={active === id ? "location" : undefined}
      onClick={(e) => {
        const el = document.getElementById(id);
        if (!onHome || !el || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
        scrollToSection(el);
      }}
    >
      {label}
    </Link>
  ));
}
