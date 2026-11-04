"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Shelf } from "@/lib/types";
import { fitStyle } from "@/lib/format";
import { Cover, Sides } from "./Record";
import { useOpenRecord } from "./RecordPlayer";

/** Wheel delta in pixels, whatever unit the browser reports (Firefox mice report lines). */
const pixels = (e: WheelEvent) => e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);

/**
 * Record crates, one per category, picked with the divider tabs. Flip through a crate
 * with the buttons, arrow keys, the index, clicking a record, scrolling while the
 * pointer is over the records, or swiping on a record.
 */
export function Crate({ shelves }: { shelves: Shelf[] }) {
  const openRecord = useOpenRecord();
  const [shelf, setShelf] = useState(0);
  const projects = shelves[shelf].projects;
  const [front, setFront] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const last = projects.length - 1;

  const go = useCallback((i: number) => setFront(Math.max(0, Math.min(last, i))), [last]);

  // arriving from a case study's "Put it back": open that crate with that record in front
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const s = shelves.findIndex((x) => x.id === q.get("crate"));
    if (s < 0) return;
    setShelf(s);
    setFront(Math.max(0, shelves[s].projects.findIndex((x) => x.slug === q.get("record"))));
  }, [shelves]);

  const crate = useRef<HTMLDivElement>(null);
  const frontRef = useRef(front);
  frontRef.current = front;
  const swiped = useRef(false);
  useEffect(() => {
    const el = crate.current;
    if (!el) return;
    const flip = (dir: number) => {
      const next = frontRef.current + dir;
      if (next < 0 || next > last) return false;
      frontRef.current = next;
      setFront(next);
      return true;
    };

    // Scrolling over the records flips them: the first tick of a gesture flips right
    // away, then one record per STEP px. A gesture that has flipped records stays with
    // the crate until it ends (so trackpad momentum never flings the page); a fresh
    // gesture at either end scrolls the page on.
    const STEP = 180;
    let acc = 0;
    let lastEvent = 0;
    let owned = false;
    const onWheel = (e: WheelEvent) => {
      if (!(e.target as Element).closest(".rec")) return;
      const now = performance.now();
      const dy = pixels(e);
      const newGesture = now - lastEvent > 250;
      lastEvent = now;
      if (newGesture) {
        acc = 0;
        owned = false;
      }
      const dir = Math.sign(dy);
      const atEnd = (dir > 0 && frontRef.current === last) || (dir < 0 && frontRef.current === 0);
      if (atEnd && !owned) return; // hand the scroll to the page
      e.preventDefault();
      e.stopPropagation();
      acc += dy;
      if (newGesture || Math.abs(acc) >= STEP) {
        if (flip(dir)) owned = true;
        acc = 0;
      }
    };

    // Touch: a vertical swipe that starts on a record flips; everywhere else scrolls the page.
    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      startY = (e.target as Element).closest(".rec") ? e.touches[0].clientY : null;
      swiped.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY === null) return;
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) > 45) {
        flip(-Math.sign(dy)); // drag down = next record, like pulling the front one toward you
        startY = e.touches[0].clientY;
        swiped.current = true;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [last, shelf]); // shelf: the crate element remounts when switching crates

  const place = (i: number): CSSProperties => {
    const d = i - front;
    if (d < 0)
      return {
        transform: `translateX(-50%) translateY(${d === -1 ? 55 : 80}%) rotateX(-78deg)`,
        opacity: d === -1 ? 0.5 : 0,
        zIndex: 300 + i,
        pointerEvents: "none",
      };
    const lift = hover === i && d > 0 ? 18 : 0;
    return {
      transform: `translateX(-50%) translateY(${-d * 15 - lift}%) translateZ(${-d * 90}px) rotateX(${lift ? 0 : 4}deg)`,
      opacity: d > 4 ? 0 : 1,
      zIndex: 100 - d,
      pointerEvents: d > 4 ? "none" : undefined,
      filter: `brightness(${1 - d * 0.1})`,
    };
  };

  const p = projects[front];
  const pickShelf = (i: number) => {
    setShelf(i);
    setFront(0);
    setHover(null);
  };

  return (
    <div className="dig">
      <div className="info">
        <span className="cap" aria-live="polite">
          {String(front + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {p.cat}
        </span>
        <h3 className="fit" style={fitStyle(p.name)}>{p.name}</h3>
        <p className="cap" style={{ lineHeight: 1.4 }}>
          {p.kind} · {p.stack.join(" · ")}
        </p>
        <p>{p.summary}</p>
        <div className="ctrls">
          <button type="button" className="btn solid" onClick={() => openRecord(p.slug)}>
            Pull it out ↗
          </button>
          <Link className="btn" href={`/work/${p.slug}`}>
            Case study →
          </Link>
        </div>
        <div className="info-tracks">
          <Sides p={p} />
        </div>
      </div>
      <div className="crate-col">
      {shelves.length > 1 && (
        <div className="bins" role="tablist" aria-label="Crates">
          {shelves.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === shelf} onClick={() => pickShelf(i)}>
              {s.name}
              <span>{String(s.projects.length).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      )}
      <div
        className="crate"
        key={shelves[shelf].id}
        ref={crate}
        tabIndex={0}
        aria-label="Record crate. Use the arrow keys to flip, Enter to pull a record out."
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") (e.preventDefault(), go(front + 1));
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") (e.preventDefault(), go(front - 1));
          if (e.key === "Enter" && e.target === e.currentTarget) openRecord(p.slug);
        }}
      >
        {projects.length > 1 && (
          <div className="crate-ticks" role="group" aria-label="Records in this crate">
            <span className="cap">
              {String(front + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <div>
              {projects.map((q, i) => (
                <button key={q.slug} type="button" aria-current={i === front} aria-label={q.name} title={q.name} onClick={() => go(i)} />
              ))}
            </div>
          </div>
        )}
        <button type="button" className="crate-nav prev" onClick={() => go(front - 1)} disabled={front === 0} aria-label="Previous record">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" /></svg>
          <small className="cap">Prev</small>
        </button>
        <button type="button" className="crate-nav next" onClick={() => go(front + 1)} disabled={front === last} aria-label="Next record">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="square" /></svg>
          <small className="cap">Next</small>
        </button>
        <div className="box" aria-hidden="true">
          <span>{shelves[shelf].name}</span>
        </div>
        {projects.map((q, i) => (
          <button
            key={q.slug}
            type="button"
            className="rec"
            style={{ ...place(i), "--i": Math.min(i, 5) } as CSSProperties}
            tabIndex={-1}
            aria-label={i === front ? `${q.name}: open record` : `Flip to ${q.name}`}
            onClick={() => {
              if (swiped.current) return void (swiped.current = false);
              if (i === front) openRecord(q.slug);
              else go(i);
            }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <Cover p={q} index={i} />
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
