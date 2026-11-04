"use client";

/**
 * The record preview: clicking a record anywhere on the home page opens it as
 * a gatefold LP sleeve, with liner notes on the left and the screenshot +
 * tracklist on the right, while the record slides out and spins.
 *
 * <RecordPreview> wraps the home page and provides useOpenRecord(); any
 * component inside can call `openRecord(slug)` to show a project.
 * Styles: styles/gatefold.css (.preview-…, .gatefold-…)
 */
import Link from "next/link";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { fitStyle } from "@/lib/format";
import type { Project } from "@/lib/types";
import { Cover } from "./Cover";
import { RecordLabel } from "./RecordLabel";
import { Tracklist } from "./Tracklist";

const OpenRecordContext = createContext<(slug: string) => void>(() => {});

/** Returns `openRecord(slug)`, which opens that project's preview. */
export const useOpenRecord = () => useContext(OpenRecordContext);

type Props = {
  projects: Project[];
  /** Sleeve colour per slug (the project's position within its crate), so it matches the crate. */
  sleeveIndex?: Record<string, number>;
  children: React.ReactNode;
};

export function RecordPreview({ projects, sleeveIndex = {}, children }: Props) {
  const [slug, setSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const focusBeforeOpen = useRef<HTMLElement | null>(null);

  const openRecord = useCallback((s: string) => {
    focusBeforeOpen.current = document.activeElement as HTMLElement;
    setOpen(false);
    setSlug(s);
    // wait two frames so the closed state paints first and the opening animates
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    focusBeforeOpen.current?.focus({ preventScroll: true });
  }, []);

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

  const index = projects.findIndex((p) => p.slug === slug);
  const p = projects[index];

  return (
    <OpenRecordContext.Provider value={openRecord}>
      {children}

      <div className={`preview${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label={p?.name} aria-hidden={!open}>
        <div className="preview-backdrop" onClick={close} />
        <button ref={closeButton} type="button" className="preview-close" onClick={close}>
          close ✕
        </button>

        {p && (
          <div className="preview-stage" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="gatefold">
              {/* the record, tucked behind the right panel until it slides out */}
              <div className="gatefold-disc" aria-hidden="true">
                <RecordLabel project={p} />
              </div>

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
                      Read the case study →
                    </Link>
                    {p.links.map((l) => (
                      <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
                <div className="gatefold-face gatefold-cover" aria-hidden="true">
                  <Cover project={p} index={sleeveIndex[p.slug] ?? index} sizes="520px" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OpenRecordContext.Provider>
  );
}
