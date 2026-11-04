"use client";

/** The Gigs / Clips / Projects tabs at the top of /admin (highlights the current one). */
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
    <nav className="admin-tabs" aria-label="Admin sections">
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
