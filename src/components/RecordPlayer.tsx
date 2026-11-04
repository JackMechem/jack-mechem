"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { Cover, Sides } from "./Record";
import { fitStyle } from "@/lib/format";

const OpenRecord = createContext<(slug: string) => void>(() => {});

/** Call with a project slug to pull its record out of the sleeve. */
export const useOpenRecord = () => useContext(OpenRecord);

/** Provides useOpenRecord() to the page and renders the record preview overlay. */
export function RecordPlayer({
  projects,
  sleeves = {},
  children,
}: {
  projects: Project[];
  /** sleeve colour index per slug (position within its crate) */
  sleeves?: Record<string, number>;
  children: React.ReactNode;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((s: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(false);
    setSlug(s);
    // two frames so the closed state paints first and the slide-out animates
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const i = projects.findIndex((p) => p.slug === slug);
  const p = projects[i];

  return (
    <OpenRecord.Provider value={show}>
      {children}
      <div className={`vy${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label={p?.name} aria-hidden={!open}>
        <div className="vy-back" onClick={close} />
        <button ref={closeBtn} type="button" className="vy-close" onClick={close}>
          close ✕
        </button>
        {p && (
          <div className="vy-stage" onClick={(e) => e.target === e.currentTarget && close()}>
            {/* A gatefold sleeve: the cover is the outside of the left leaf, which swings open on the spine */}
            <div className="gf">
              <div className="gf-disc" aria-hidden="true">
                <div className="vy-spin">
                  <div className="vy-label" style={fitStyle(p.name)}>
                    <div>
                      {p.name}
                      <small>{p.cat} · 33⅓</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gf-panel gf-right">
                {p.image ? (
                  <figure className="gf-shot">
                    <Image src={p.image} alt={`${p.name} screenshot`} width={1600} height={1000} sizes="(max-width: 820px) 90vw, 520px" />
                    {p.imageNote && <figcaption className="cap">{p.imageNote}</figcaption>}
                  </figure>
                ) : (
                  <div className="gf-shot gf-noshot" aria-hidden="true" style={{ "--len": p.name.length } as React.CSSProperties}>
                    <div className="gf-noshot-type">{p.name}</div>
                    <div className="gf-noshot-stack cap">
                      {p.stack.map((s) => (
                        <div key={s}>{s}</div>
                      ))}
                    </div>
                  </div>
                )}
                <Sides p={p} />
              </div>

              <div className="gf-leaf">
                <div className="gf-panel gf-face gf-inside">
                  <div className="gf-top cap">
                    <span>{p.cat}</span>
                    <span>{p.years}</span>
                  </div>
                  <h2 className="fit" style={fitStyle(p.name)}>
                    {p.name}
                  </h2>
                  <p className="gf-kind">{p.kind}</p>
                  <p className="gf-sum">{p.summary}</p>
                  <p className="gf-credits">
                    <span className="cap">Personnel</span>
                    Jack Mechem: {p.stack.join(", ")}
                  </p>
                  <div className="gf-links">
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
                <div className="gf-face gf-cover" aria-hidden="true">
                  <Cover p={p} index={sleeves[p.slug] ?? i} sizes="520px" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OpenRecord.Provider>
  );
}
