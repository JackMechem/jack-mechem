/**
 * The logo: a record whose label is a terminal prompt, >_ (same drawing as src/app/icon.svg).
 * Drawn in the text colour with the label cut out, so it works on any background.
 */
export function RecordMark({ size = 22 }: { size?: number }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d="M1 32a31 31 0 1 0 62 0a31 31 0 1 0 -62 0Z M15 32a17 17 0 1 0 34 0a17 17 0 1 0 -34 0Z" />
      <path d="M22 25 L28 31 L22 37" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="square" />
      <path className="cursor" d="M31 39 H42" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="square" />
    </svg>
  );
}
