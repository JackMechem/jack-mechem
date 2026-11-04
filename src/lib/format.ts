/** Format a YYYY-MM-DD calendar date without timezone drift. */
export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
}

/** Today's date in Los Angeles as YYYY-MM-DD. */
export function todayInLA() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
}

/**
 * Inline style for a display title that must fit its column: CSS sizes `.fit` text by
 * the longest unbreakable chunk (words, and parts of hyphenated words can wrap).
 */
export function fitStyle(text: string) {
  const longest = Math.max(4, ...text.split(/[\s-]+/).map((w) => w.length));
  return { "--len": longest } as React.CSSProperties;
}
