/**
 * Mouse-wheel / trackpad helpers shared by the crate and the section pager.
 */

/** Vertical wheel distance in pixels, whatever unit the browser reports (Firefox mice report lines). */
export function wheelPixels(e: WheelEvent) {
  if (e.deltaMode === 1) return e.deltaY * 40; // lines
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // pages
  return e.deltaY;
}
