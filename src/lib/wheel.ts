/**
 * Mouse-wheel / trackpad helpers for the crate (hooks/useCrateGestures.ts).
 */

/** Vertical wheel distance in pixels, whatever unit the browser reports (Firefox mice report lines). */
export function wheelPixels(e: WheelEvent) {
  if (e.deltaMode === 1) return e.deltaY * 40; // lines
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // pages
  return e.deltaY;
}

const GESTURE_GAP = 150; // ms of quiet that ends a wheel gesture

// One tracker for the whole page, so every listener agrees on where gestures start.
let seen: WheelEvent | null = null;
let current = { id: 0, start: true };
let lastTime = -Infinity;
let lastDir = 0;
let peak = 0; // biggest delta of this gesture so far
let floor = 0; // smallest delta since that peak

/**
 * Which wheel gesture an event belongs to. A trackpad keeps sending decaying
 * "momentum" events for a second or two after the fingers lift; those stay in
 * the same gesture. A new gesture starts after a pause, on a change of
 * direction, or when the deltas jump back up after decaying (a fresh swipe
 * made while the last one's momentum is still running).
 *
 * Safe to call from several listeners for the same event; call it before any
 * early return so every event is counted.
 */
export function wheelGesture(e: WheelEvent) {
  if (e === seen) return current;
  seen = e;
  const now = performance.now();
  const dy = wheelPixels(e);
  const abs = Math.abs(dy);
  const dir = Math.sign(dy);
  const quiet = now - lastTime > GESTURE_GAP;
  lastTime = now;
  if (!dir) {
    // a sideways-only event: no vertical movement, but a pause still ends the gesture
    if (quiet) lastDir = 0;
    return current;
  }

  const decaying = floor < peak / 2;
  const fresh = quiet || dir !== lastDir || (decaying && abs > floor * 2 + 8);
  lastDir = dir;
  if (fresh) {
    current = { id: current.id + 1, start: true };
    peak = floor = abs;
  } else {
    current = { id: current.id, start: false };
    if (abs >= peak) peak = floor = abs; // still speeding up
    else floor = Math.min(floor, abs);
  }
  return current;
}
