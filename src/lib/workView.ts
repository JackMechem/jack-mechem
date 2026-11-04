/**
 * The Work section's layout: "crate" (default, flip through one crate at a
 * time) or "shelf" (every record face-out). It's the `data-work-view`
 * attribute on <html>; styles/shelf.css shows the chosen layout.
 */
export type WorkView = "crate" | "shelf";

/** localStorage key for the saved layout (read in app/layout.tsx, written by WorkViewSwitch). */
export const WORK_VIEW_STORAGE_KEY = "jm-work-view";
