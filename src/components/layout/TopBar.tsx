/**
 * The fixed bar across the top of every public page: logo, a scrolling
 * ticker (built in app/(site)/layout.tsx), the section links (NavLinks) and
 * the theme toggle. Styles: styles/layout.css (.topbar-…)
 */
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { RecordMark } from "./RecordMark";
import { ThemeToggle } from "./ThemeToggle";

export type TickerItem = { title: string; text: string };

export function TopBar({ ticker }: { ticker: TickerItem[] }) {
  const items = ticker.map((item, i) => (
    <span key={i}>
      <b>{item.title}</b>: {item.text}
      <span aria-hidden="true">✳</span>
    </span>
  ));

  return (
    <header className="topbar">
      <Link className="topbar-logo" href="/" aria-label="Jack Mechem, home">
        <RecordMark />
        <span className="logo-full">Jack Mechem</span>
        <span className="logo-short" aria-hidden="true">
          JM
        </span>
      </Link>

      <div className="topbar-ticker" aria-hidden="true">
        {/* rendered twice so the loop is seamless */}
        <div className="ticker-track">
          {items}
          {items}
        </div>
      </div>

      <nav className="topbar-nav" aria-label="Main">
        <NavLinks />
        <ThemeToggle />
      </nav>
    </header>
  );
}
