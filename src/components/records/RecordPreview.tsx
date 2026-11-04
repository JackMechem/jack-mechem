"use client";

/**
 * The record preview: clicking a record anywhere on the home page opens it as
 * a gatefold LP sleeve, with liner notes on the left and the screenshot +
 * tracklist on the right, while the record slides out and spins.
 *
 * <RecordPreview> wraps the home page and provides useOpenRecord(); any
 * component inside can call `openRecord(slug)` to show a project.
 * Prev / next (buttons below the sleeve, or the ← / → keys) move through the
 * records in the same crate: the record tucks back in, the sleeve folds shut,
 * its cover changes to the next record's, and it opens again (.is-swapping).
 * Styles: styles/gatefold.css (.preview-…, .gatefold-…)
 */
import Link from "next/link";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { fitStyle, pad2 } from "@/lib/format";
import type { Project } from "@/lib/types";
import { Cover } from "./Cover";
import { RecordLabel } from "./RecordLabel";
import { Tracklist } from "./Tracklist";
import { Arrow } from "@/components/layout/Arrow";

const SWAP_MS = 950; // how long the sleeve takes to fold shut before the next record goes in (gatefold.css)

const OpenRecordContext = createContext<(slug: string) => void>(() => {});

/** Returns `openRecord(slug)`, which opens that project's preview. */
export const useOpenRecord = () => useContext(OpenRecordContext);

type Props = {
  projects: Project[];
  /** Sleeve colour per slug (the project's position within its crate), so it matches the crate. */
  sleeveIndex?: Record<string, number>;
  /** The slugs in each crate, in order: prev / next stay within the open record's crate. */
  crates?: string[][];
  children: React.ReactNode;
};

export function RecordPreview({ projects, sleeveIndex = {}, crates = [], children }: Props) {
  const [slug, setSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const focusBeforeOpen = useRef<HTMLElement | null>(null);
  const swapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // the open record's crate (all records if it isn't in one) and its place there
  const siblings = useMemo(() => (slug && crates.find((c) => c.includes(slug))) || projects.map((q) => q.slug), [slug, crates, projects]);
  const pos = slug ? siblings.indexOf(slug) : -1;

  const openRecord = useCallback((s: string) => {
    focusBeforeOpen.current = document.activeElement as HTMLElement;
    setOpen(false);
    setSlug(s);
    // wait two frames so the closed state paints first and the opening animates
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const close = useCallback(() => {
    clearTimeout(swapTimer.current);
    setSwapping(false);
    setOpen(false);
    focusBeforeOpen.current?.focus({ preventScroll: true });
  }, []);

  // Prev / next: fold the sleeve shut, put the next record in, open it again.
  const step = useCallback(
    (dir: number) => {
      const target = siblings[pos + dir];
      if (!target || swapping) return;
      setSwapping(true);
      const wait = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : SWAP_MS;
      swapTimer.current = setTimeout(() => {
        setSlug(target);
        setSwapping(false);
        stage.current?.scrollTo({ top: 0 });
      }, wait);
    },
    [siblings, pos, swapping],
  );
  useEffect(() => () => clearTimeout(swapTimer.current), []);

  // While open: lock page scrolling, focus the close button, close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // ← / → step through the crate while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, step]);

  const name = (s: string | undefined) => projects.find((q) => q.slug === s)?.name;

  const index = projects.findIndex((p) => p.slug === slug);
  const p = projects[index];

  return (
    <OpenRecordContext.Provider value={openRecord}>
      {children}

      <div className={`preview${open ? " is-open" : ""}${swapping ? " is-swapping" : ""}`} role="dialog" aria-modal="true" aria-label={p?.name} aria-hidden={!open}>
        <div className="preview-backdrop" onClick={close} />
        <button ref={closeButton} type="button" className="preview-close" onClick={close}>
          close <Arrow dir="close" />
        </button>

        {p && (
          <div className="preview-stage" ref={stage} onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="gatefold">
              {/* the record, tucked behind the right panel until it slides out; clicking it opens the
                  case study (mouse only: "Read the case study" is the keyboard / screen reader route) */}
              <Link className="gatefold-disc" href={`/work/${p.slug}`} onClick={close} tabIndex={-1} aria-hidden="true" title="Read the case study">
                <RecordLabel project={p} />
              </Link>

              {/* inside right: screenshot + tracklist */}
              <div className="gatefold-panel gatefold-right">
                {p.image ? (
                  <figure className="gatefold-shot">
                    <Image src={p.image} alt={`${p.name} screenshot`} width={1600} height={1000} sizes="(max-width: 820px) 90vw, 520px" />
                    {p.imageNote && <figcaption className="cap">{p.imageNote}</figcaption>}
                  </figure>
                ) : (
                  <div className="gatefold-shot gatefold-noshot" aria-hidden="true" style={{ "--len": p.name.length } as React.CSSProperties}>
                    <div className="gatefold-noshot-name">{p.name}</div>
                    <div className="gatefold-noshot-stack cap">
                      {p.stack.map((s) => (
                        <div key={s}>{s}</div>
                      ))}
                    </div>
                  </div>
                )}
                <Tracklist project={p} />
              </div>

              {/* left leaf: liner notes inside, cover outside; swings open on the spine */}
              <div className="gatefold-leaf">
                <div className="gatefold-panel gatefold-face gatefold-inside">
                  <div className="gatefold-top cap">
                    <span>{p.cat}</span>
                    <span>{p.years}</span>
                  </div>
                  <h2 className="fit" style={fitStyle(p.name)}>
                    {p.name}
                  </h2>
                  <p className="gatefold-kind">{p.kind}</p>
                  <p className="gatefold-summary">{p.summary}</p>
                  <p className="gatefold-credits">
                    <span className="cap">Personnel</span>
                    Jack Mechem: {p.stack.join(", ")}
                  </p>
                  <div className="gatefold-links">
                    <Link className="btn solid" href={`/work/${p.slug}`} onClick={close}>
                      Read the case study <Arrow />
                    </Link>
                    {p.links.map((l) => (
                      <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label} <Arrow dir="out" />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="gatefold-face gatefold-cover" aria-hidden="true">
                  <Cover project={p} index={sleeveIndex[p.slug] ?? index} sizes="520px" />
                </div>
              </div>
            </div>

            {siblings.length > 1 && (
              <nav className="preview-nav" aria-label="Records in this crate">
                <button type="button" className="btn" onClick={() => step(-1)} disabled={pos <= 0} title={name(siblings[pos - 1])}>
                  <Arrow dir="left" /> Prev
                </button>
                <span className="cap">
                  {pad2(pos + 1)} / {pad2(siblings.length)}
                </span>
                <button type="button" className="btn" onClick={() => step(1)} disabled={pos >= siblings.length - 1} title={name(siblings[pos + 1])}>
                  Next <Arrow />
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </OpenRecordContext.Provider>
  );
}
