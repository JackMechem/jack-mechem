"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["/admin", "Gigs"],
  ["/admin/clips", "Clips"],
  ["/admin/projects", "Projects"],
] as const;

export function AdminTabs() {
  const path = usePathname();
  return (
    <nav className="adm-tabs" aria-label="Admin sections">
      {TABS.map(([href, label]) => {
        const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
