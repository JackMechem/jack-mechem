"use client";

/**
 * The section links in the top bar. On the home page the link for the
 * section currently in view is highlighted (aria-current), as you scroll.
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

export function NavLinks() {
  const onHome = usePathname() === "/";
  const active = useActiveSection(IDS, onHome);

  return NAV.map(({ id, label }) => (
    <Link key={id} href={`/#${id}`} aria-current={active === id ? "location" : undefined}>
      {label}
    </Link>
  ));
}
