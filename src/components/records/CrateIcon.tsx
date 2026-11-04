/**
 * A little milk crate with records standing in it, drawn in the text colour.
 * Used on the case-study "Put it back" / "Back to crate" buttons; the
 * records dip into the crate on hover (styles/case-study.css).
 */
export function CrateIcon({ size = 28 }: { size?: number }) {
  return (
    <svg className="crate-icon" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <g className="crate-icon-records" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="7" y="5" width="11" height="13" />
        <rect x="13" y="3" width="12" height="15" fill="currentColor" />
      </g>
      <path d="M3 14 H29 V29 H3 Z" fill="var(--crate-fill, var(--paper))" stroke="currentColor" strokeWidth="2" />
      <rect x="11.5" y="17" width="9" height="3" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 23 V27 M9 23 V27 M12 23 V27 M15 23 V27 M18 23 V27 M21 23 V27 M24 23 V27 M27 23 V27" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
