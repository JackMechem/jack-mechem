/**
 * The site's arrows, drawn as SVG so they match the display type (the arrow
 * characters in the fonts don't). Sized to the text around them and drawn in
 * its colour; on a .btn or link they nudge in their direction on hover.
 * Styles: styles/base.css (.arrow)
 */
const PATHS = {
  right: "M2 8 H13 M9 4 L13 8 L9 12",
  left: "M14 8 H3 M7 4 L3 8 L7 12",
  down: "M8 2 V13 M4 9 L8 13 L12 9",
  up: "M8 14 V3 M4 7 L8 3 L12 7",
  out: "M4 12 L12 4 M6 4 H12 V10", // opens somewhere else
  close: "M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5",
};

export function Arrow({ dir = "right" }: { dir?: keyof typeof PATHS }) {
  return (
    <svg className={`arrow arrow--${dir}`} viewBox="0 0 16 16" aria-hidden="true">
      <path d={PATHS[dir]} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}
