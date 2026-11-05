/**
 * The Work section's layout: "crate" (default, flip through one crate at a
 * time) or "shelf" (every record face-out). It's the `data-work-view`
 * attribute on <html>; styles/shelf.css shows the chosen layout.
 */
export type WorkView = "crate" | "shelf";

/** localStorage key for the saved layout (read in app/layout.tsx, written by WorkViewSwitch). */
export const WORK_VIEW_STORAGE_KEY = "jm-work-view";

/**
 * localStorage key set once a visitor has flipped a record in the crate; from
 * then on the crate's "scroll / swipe to flip" hint stays hidden. Mirrored to
 * <html data-crate-flipped> (read in app/layout.tsx, written by CrateBrowser).
 */
export const CRATE_FLIPPED_STORAGE_KEY = "jm-crate-flipped";
