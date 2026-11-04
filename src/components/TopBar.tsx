"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RecordMark } from "./RecordMark";

type Item = { b: string; text: string };

export function TopBar({ items }: { items: Item[] }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark"), []);

  const toggle = () => {
    const t = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("jm-theme", t);
    } catch {}
    setTheme(t);
  };

  const track = items.map((it, i) => (
    <span key={i}>
      <b>{it.b}</b>: {it.text}
      <span aria-hidden="true">✳</span>
    </span>
  ));

  return (
    <header className="topbar">
      <Link className="logo" href="/" aria-label="Jack Mechem, home">
        <RecordMark />
        <span className="full">Jack Mechem</span>
        <span className="short" aria-hidden="true">JM</span>
      </Link>
      <div className="ticker" aria-hidden="true">
        {/* rendered twice so the loop is seamless */}
        <div className="track">
          {track}
          {track}
        </div>
      </div>
      <nav aria-label="Main">
        <Link href="/#crate">Work</Link>
        <Link href="/#gigs">Gigs</Link>
        <Link href="/#archive">Archive</Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
        <button type="button" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          <span className="t-label">{theme === "dark" ? "Light" : "Dark"}</span>
          <svg className="t-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M10 2 A8 8 0 0 1 10 18 Z" fill="currentColor" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
