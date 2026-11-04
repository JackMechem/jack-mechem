"use client";

/**
 * Light / dark switch in the top bar. The theme is the `data-theme` attribute
 * on <html> (dark by default); the choice is saved in localStorage and
 * restored before first paint by the script in app/layout.tsx.
 */
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "dark" | "light";

// The <html data-theme> attribute is the source of truth; re-render when it changes.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const currentTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "dark" as Theme);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // private browsing: the choice just won't persist
    }
  };

  return (
    <button type="button" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
      <span className="theme-label">{theme === "dark" ? "Light" : "Dark"}</span>
      {/* phones show this half-filled circle instead of the word */}
      <svg className="theme-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 2 A8 8 0 0 1 10 18 Z" fill="currentColor" />
      </svg>
    </button>
  );
}
