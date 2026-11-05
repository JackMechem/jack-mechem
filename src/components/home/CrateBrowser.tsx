"use client";

/**
 * The "Work" section: projects as records in milk crates, one crate per
 * category. It starts with every crate side by side (the picker); clicking
 * one zooms it up into the browser, where divider tabs switch crates and
 * "All crates" goes back. With a single crate it opens straight away.
 * In the browser you flip through the crate with the arrows,
 * the ticks, the arrow keys, by clicking a record, by scrolling over the
 * records, or by swiping on them (see hooks/useCrateGestures.ts). Clicking
 * the front record opens its preview. The left column shows the front
 * record's notes and tracklist.
 *
 * Until a visitor first flips a record, the crate shows how: a small "scroll
 * to flip" (or, on touchscreens, "swipe to flip") hint beside it, and the
 * front record tips forward a little every few seconds. Both stop for good
 * after the first flip (markFlipped, below).
 *
 * A case study's "Put it back" link returns here with ?crate=<id>&record=<slug>,
 * which opens that crate with that record in front.
 * Styles: styles/crate.css
 */
import Link from "next/link";
import { useCallback, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { fitStyle, pad2 } from "@/lib/format";
import { CRATE_FLIPPED_STORAGE_KEY } from "@/lib/workView";
import type { Shelf } from "@/lib/types";
import { useCrateGestures } from "@/hooks/useCrateGestures";
import { Cover } from "@/components/records/Cover";
import { Tracklist } from "@/components/records/Tracklist";
import { useOpenRecord } from "@/components/records/RecordPreview";
import { Arrow } from "@/components/layout/Arrow";

/**
 * How the crate looks:
 * - "classic": records stepped up and back behind the front one; records
 *   flipped past fold down out of view. (styles/crate.css)
 * - "real": a 3D milk crate seen from above, sleeves packed upright inside;
 *   flipping tips one record forward at a time, opening a gap onto the next
 *   one's cover, like flipping through a crate in a shop. (styles/crate-real.css)
 */
const CRATE_LOOK: "classic" | "real" = "real";
/** "real" look: short crates are padded out with blank sleeves at the back so they look full. */
const CRATE_FILL = 12;
/** "real" look: shades of the blank sleeves (% ink mixed into paper), so their edges have rhythm. */
const FILLER_TONES = ["14%", "72%", "30%", "90%", "48%", "8%", "62%", "22%"];

/** The records shown in a crate on the picker: classic shows the first five, real shows them all. */
const pickerRecords = (s: Shelf) => (CRATE_LOOK === "real" ? s.projects : s.projects.slice(0, 5));
/** How many sleeves a crate of `records` records holds (records + blank fillers). */
const sleeveCount = (records: number) => (CRATE_LOOK === "real" ? Math.max(records, CRATE_FILL) : records);

/**
 * Where record `i` sits when record `front` is at the front: records behind it
 * step up and back; records already flipped past fold down out of view.
 * `lifted` raises a record behind the front one a little, one corner first, when hovered.
 */
function classicPosition(i: number, front: number, lifted: boolean): CSSProperties {
  const depth = i - front;
  if (depth < 0)
    return {
      transform: `translateX(-50%) translateY(${depth === -1 ? 55 : 80}%) rotateX(-78deg)`,
      opacity: depth === -1 ? 0.5 : 0,
      zIndex: 300 + i,
      pointerEvents: "none",
    };
  // hovered: rise a little and twist so one top corner pokes up, like pulling a record by its corner
  // (alternating sides from record to record)
  const lift = lifted && depth > 0 ? 6 : 0;
  const twist = lift ? (i % 2 ? 3.5 : -3.5) : 0;
  return {
    transform: `translateX(-50%) translateY(${-depth * 15 - lift}%) translateZ(${-depth * 90}px) rotateX(${lift ? 2 : 4}deg) rotateZ(${twist}deg)`,
    opacity: depth > 4 ? 0 : 1,
    zIndex: 100 - depth,
    pointerEvents: depth > 4 ? "none" : undefined,
    filter: `brightness(${1 - depth * 0.1})`,
  };
}

/**
 * The same for the "real" crate, in record widths from the middle of the crate
 * floor (the crate runs from z = +.5, the front wall, to -.5, the back wall).
 * Records from `front` on are packed against the back wall, leaning back on
 * it; records flipped past are packed against the front wall, tipped forward
 * over it. Each record's spot depends only on which side of the gap it is on,
 * so a flip moves just the one record across.
 */
function realPosition(i: number, front: number, total: number, lifted: boolean): CSSProperties {
  const gap = Math.min(0.04, 0.5 / total); // sleeve spacing
  const past = i < front;
  const z = past ? 0.18 - i * gap : -0.42 + (total - 1 - i) * gap;
  const lean = past ? -38 : 10; // 38°: the frontmost record rests on the front wall's top edge
  // hovered: slide up out of the stack, one corner first (in the record's own plane, so it never cuts its neighbours)
  const lift = lifted && i > front ? 8 : 0;
  const twist = lift ? (i % 2 ? 3 : -3) : 0;
  return {
    transform: `translateX(-50%) translateZ(calc(var(--rec) * ${z})) rotateX(${lean}deg) translateY(${-lift}%) rotateZ(${twist}deg)`,
    filter: `brightness(${past ? 0.62 : Math.max(0.45, 1 - (i - front) * 0.07)})`,
  };
}

const recordPosition = (i: number, front: number, total: number, lifted: boolean) =>
  CRATE_LOOK === "real" ? realPosition(i, front, total, lifted) : classicPosition(i, front, lifted);

/**
 * What the records sit in. Classic: the front panel. Real: a 3D box (floor,
 * walls, the front panel) with blank sleeves packed in behind the records.
 */
function CrateBox({ name, records, front, children }: { name: string; records: number; front: number; children: ReactNode }) {
  const panel = (
    <span className="crate-front" aria-hidden="true">
      <span>{name}</span>
    </span>
  );
  if (CRATE_LOOK === "classic")
    return (
      <>
        {panel}
        {children}
      </>
    );
  const total = sleeveCount(records);
  return (
    <span className="crate-scene">
      <span className="crate-wall is-floor" aria-hidden="true" />
      <span className="crate-wall is-back" aria-hidden="true" />
      <span className="crate-wall is-left" aria-hidden="true" />
      <span className="crate-wall is-right" aria-hidden="true" />
      {children}
      {Array.from({ length: total - records }, (_, k) => (
        <span
          key={k}
          className="crate-record crate-filler"
          aria-hidden="true"
          style={{ ...recordPosition(records + k, front, total, false), "--i": 5, "--tone": FILLER_TONES[k % FILLER_TONES.length] } as CSSProperties}
        />
      ))}
      {panel}
    </span>
  );
}

// The page's query string (?crate=…&record=…), read on the client only.
const subscribeToUrl = (onChange: () => void) => {
  addEventListener("popstate", onChange);
  return () => removeEventListener("popstate", onChange);
};
const currentSearch = () => location.search;

const Chevron = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" />
  </svg>
);

/** Retires the how-to-flip hint (styles/crate.css hides it under <html data-crate-flipped>), remembered across visits. */
function markFlipped() {
  if (document.documentElement.dataset.crateFlipped) return;
  document.documentElement.dataset.crateFlipped = "1";
  try {
    localStorage.setItem(CRATE_FLIPPED_STORAGE_KEY, "1");
  } catch {
    // private browsing: the hint will just show again next visit
  }
}

/** Runs a state change as a view transition (the picked crate morphs into the big one), where supported. */
function transition(update: () => void) {
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return update();
  document.startViewTransition(() => flushSync(update));
}

export function CrateBrowser({ shelves }: { shelves: Shelf[] }) {
  const openRecord = useOpenRecord();
  // null while showing the picker
  const [shelfIndex, setShelfIndex] = useState<number | null>(shelves.length > 1 ? null : 0);
  // the crate that morphs between the picker and the browser
  const [morphing, setMorphing] = useState<number | null>(null);
  const [front, setFront] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const crateRef = useRef<HTMLDivElement>(null);

  const shelf = shelves[shelfIndex ?? 0];
  const projects = shelf.projects;
  const last = projects.length - 1;
  const p = projects[front];

  // every flip the visitor makes goes through here
  const flipTo = useCallback((i: number) => {
    markFlipped();
    setFront(i);
  }, []);
  const go = useCallback((i: number) => flipTo(Math.max(0, Math.min(last, i))), [flipTo, last]);
  const justSwiped = useCrateGestures({ crate: crateRef, front, last, setFront: flipTo, resetKey: shelfIndex });

  const pickShelf = (i: number) => {
    setShelfIndex(i);
    setFront(0);
    setHovered(null);
  };
  const openShelf = (i: number) => {
    flushSync(() => setMorphing(i)); // name the clicked crate before the "before" snapshot
    transition(() => pickShelf(i));
    // "go up to it": bring the section to the top of the screen if it isn't already
    const section = document.getElementById("crate");
    const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar")) || 48;
    if (section && Math.abs(section.getBoundingClientRect().top - bar) > 4) section.scrollIntoView({ behavior: "smooth" });
  };
  const backToPicker = () => {
    setMorphing(shelfIndex);
    transition(() => {
      setShelfIndex(null);
      setHovered(null);
    });
  };

  // Arriving from a case study's "Put it back": open that crate with that record in front.
  // (React's "adjust state when an input changes" pattern: compare with the last URL handled.)
  const search = useSyncExternalStore(subscribeToUrl, currentSearch, () => "");
  const [handledSearch, setHandledSearch] = useState("");
  if (search !== handledSearch) {
    setHandledSearch(search);
    const query = new URLSearchParams(search);
    const s = shelves.findIndex((x) => x.id === query.get("crate"));
    if (s >= 0) {
      setShelfIndex(s);
      setFront(Math.max(0, shelves[s].projects.findIndex((x) => x.slug === query.get("record"))));
    }
  }

  if (shelfIndex === null)
    return (
      <div className="crate-picker">
        {shelves.map((s, i) => (
          <button key={s.id} type="button" className="crate-pick" onClick={() => openShelf(i)} aria-label={`Open the ${s.name} crate, ${s.projects.length} records`}>
            <span className={`crate crate--${CRATE_LOOK}`} style={i === morphing ? { viewTransitionName: "crate" } : undefined} aria-hidden="true">
              <CrateBox name={s.name} records={pickerRecords(s).length} front={0}>
                {pickerRecords(s).map((q, k) => (
                  <span key={q.slug} className="crate-record" style={{ ...recordPosition(k, 0, sleeveCount(s.projects.length), false), "--i": k } as CSSProperties}>
                    <Cover project={q} index={k} sizes="260px" />
                  </span>
                ))}
              </CrateBox>
            </span>
            <span className="crate-pick-label">
              {s.name}
              <span className="cap">
                {pad2(s.projects.length)} records <Arrow />
              </span>
            </span>
          </button>
        ))}
      </div>
    );

  return (
    <div className="crate-browser">
      {/* left: notes for the front record */}
      <div className="crate-notes">
        <span className="cap" aria-live="polite">
          {pad2(front + 1)} / {pad2(projects.length)} · {p.cat}
        </span>
        <h3 className="fit" style={fitStyle(p.name)}>
          {p.name}
        </h3>
        <p className="cap crate-notes-kind">
          {p.kind} · {p.stack.join(" · ")}
        </p>
        <p>{p.summary}</p>
        <div className="crate-actions">
          <button type="button" className="btn solid" onClick={() => openRecord(p.slug)}>
            Pull it out <Arrow dir="out" />
          </button>
          <Link className="btn" href={`/work/${p.slug}`}>
            Case study <Arrow />
          </Link>
        </div>
        <div className="crate-notes-tracks">
          <Tracklist project={p} />
        </div>
      </div>

      {/* right: crate tabs + the crate */}
      <div className="crate-column">
        {shelves.length > 1 && (
          <div className="crate-tabs">
            <button type="button" className="crate-back" onClick={backToPicker}>
              <Arrow dir="left" /> All crates
            </button>
            <div role="tablist" aria-label="Crates">
              {shelves.map((s, i) => (
                <button key={s.id} type="button" role="tab" aria-selected={i === shelfIndex} onClick={() => pickShelf(i)}>
                  {s.name}
                  <span>{pad2(s.projects.length)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className={`crate crate--${CRATE_LOOK}`}
          key={shelf.id}
          ref={crateRef}
          style={{ viewTransitionName: "crate" }}
          tabIndex={0}
          aria-label="Record crate. Use the arrow keys to flip, Enter to pull a record out."
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              go(front + 1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              go(front - 1);
            } else if (e.key === "Enter" && e.target === e.currentTarget) {
              openRecord(p.slug);
            }
          }}
        >
          {/* left of the crate: prev, the position counter + ticks, next */}
          <div className="crate-controls">
            <button type="button" className="crate-nav prev" onClick={() => go(front - 1)} disabled={front === 0} aria-label="Previous record">
              <Chevron d="M4 15 L12 7 L20 15" />
              <small className="cap">Prev</small>
            </button>
            {projects.length > 1 && (
              <div className="crate-ticks" role="group" aria-label="Records in this crate">
                <span className="cap">
                  {pad2(front + 1)} / {pad2(projects.length)}
                </span>
                <div>
                  {projects.map((q, i) => (
                    <button key={q.slug} type="button" aria-current={i === front} aria-label={q.name} title={q.name} onClick={() => go(i)} />
                  ))}
                </div>
              </div>
            )}
            <button type="button" className="crate-nav next" onClick={() => go(front + 1)} disabled={front === last} aria-label="Next record">
              <Chevron d="M4 9 L12 17 L20 9" />
              <small className="cap">Next</small>
            </button>
          </div>

          {/* how to flip, until the visitor first does (the crate's aria-label covers keyboard / screen readers) */}
          {projects.length > 1 && (
            <div className="crate-hint" aria-hidden="true">
              <span className="crate-hint-icon crate-hint-wheel">
                <i />
              </span>
              <span className="crate-hint-icon crate-hint-swipe">
                <i />
              </span>
              <span className="cap">
                <span className="crate-hint-wheel">Scroll</span>
                <span className="crate-hint-swipe">Swipe</span> to flip
              </span>
            </div>
          )}

          <CrateBox name={shelf.name} records={projects.length} front={front}>
            {projects.map((q, i) => (
              <button
                key={q.slug}
                type="button"
                className={`crate-record${i === front && projects.length > 1 ? " is-front" : ""}`}
                style={{ ...recordPosition(i, front, sleeveCount(projects.length), hovered === i), "--i": Math.min(i, 5) } as CSSProperties}
                tabIndex={-1}
                aria-label={i === front ? `${q.name}: open record` : `Flip to ${q.name}`}
                onClick={() => {
                  if (justSwiped.current) {
                    justSwiped.current = false;
                    return;
                  }
                  if (i === front) openRecord(q.slug);
                  else go(i);
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <Cover project={q} index={i} />
              </button>
            ))}
          </CrateBox>
        </div>
      </div>
    </div>
  );
}
