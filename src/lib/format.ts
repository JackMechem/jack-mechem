/**
 * Small formatting helpers used across the site.
 */
import type { CSSProperties } from "react";

/** Format a YYYY-MM-DD calendar date (gigs) without timezone drift. */
export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
}

/** Today's date in Los Angeles as YYYY-MM-DD (used to hide past gigs). */
export function todayInLA() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
}

/** "3" → "03": the two-digit numbers used for counters and catalogue-style labels. */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Inline style for a display title that must fit its column. Sets --len to
 * the longest unbreakable chunk of the text; the `.fit` class in
 * styles/base.css turns that into a font size. Use as:
 *   <h1 className="fit" style={fitStyle(name)}>{name}</h1>
 */
export function fitStyle(text: string): CSSProperties {
  const longest = Math.max(4, ...text.split(/[\s-]+/).map((w) => w.length));
  return { "--len": longest, "--chars": text.length } as CSSProperties; // --chars: for places that cap long names by total length
}
