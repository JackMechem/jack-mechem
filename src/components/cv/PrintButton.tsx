"use client";

/** Opens the browser's print dialog (the CV has a print stylesheet, so "Save as PDF" works). */
export function PrintButton() {
  return (
    <button type="button" className="btn cv-print" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
