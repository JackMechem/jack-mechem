"use client";

/**
 * The screenshots on a case study (/work/<slug>): the project's main image
 * followed by its gallery.
 *
 * On the page: one large image with ← / → buttons, its caption and position,
 * and a strip of thumbnails. Swipe on phones; arrow keys once it has focus.
 * Clicking the image opens it full screen, where a click / tap zooms in (drag
 * or scroll to look around, tap again to zoom out). Phones can also pinch.
 * Escape closes.
 *
 * Styles: styles/viewer.css (.viewer-…)
 */
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { pad2 } from "@/lib/format";
import { useSwipe } from "@/hooks/useSwipe";
import { Arrow } from "@/components/layout/Arrow";

export type Shot = { src: string; alt: string; caption?: string };

const Chevron = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
  </svg>
);
const LEFT = "M15 4 L7 12 L15 20";
const RIGHT = "M9 4 L17 12 L9 20";

export function ScreenshotViewer({ shots }: { shots: Shot[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  // width of the full-screen image while zoomed in (null = fitted to the screen)
  const [zoomWidth, setZoomWidth] = useState<number | null>(null);

  const stage = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const zoomArea = useRef<HTMLDivElement>(null);
  // where the zoom click landed, so that spot stays under the pointer after zooming
  const zoomAnchor = useRef<{ fx: number; fy: number; x: number; y: number } | null>(null);

  const count = shots.length;
  const many = count > 1;
  const shot = shots[index];

  const step = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + count) % count);
      setZoomWidth(null);
    },
    [count],
  );

  useSwipe(stage, step, many);
  useSwipe(zoomArea, step, many && open && zoomWidth === null);

  // keep the current thumbnail in view (scrolls the strip only, never the page)
  useEffect(() => {
    const list = strip.current;
    const thumb = list?.children[index] as HTMLElement | undefined;
    if (list && thumb) list.scrollTo({ left: thumb.offsetLeft - (list.clientWidth - thumb.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);

  // Full screen: a native <dialog> (focus, Escape and the backdrop come for free).
  useEffect(() => {
    const d = dialog.current;
    if (!d || !open) return;
    if (!d.open) d.showModal();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  // while full screen, load the neighbours so flipping is instant
  useEffect(() => {
    if (!open || !many) return;
    for (const i of [index + 1, index - 1]) new window.Image().src = shots[(i + count) % count].src;
  }, [open, many, index, shots, count]);

  const close = () => dialog.current?.close(); // fires onClose below

  const toggleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomWidth !== null) return setZoomWidth(null);
    const img = e.currentTarget;
    const box = img.getBoundingClientRect();
    const area = zoomArea.current!.getBoundingClientRect();
    zoomAnchor.current = { fx: (e.clientX - box.left) / box.width, fy: (e.clientY - box.top) / box.height, x: e.clientX - area.left, y: e.clientY - area.top };
    // screenshots are high-res: show them at their real size, and at least twice the fitted size
    setZoomWidth(Math.max(img.naturalWidth / devicePixelRatio, box.width * 2));
  };

  // after zooming in, scroll so the clicked spot stays where it was
  useLayoutEffect(() => {
    const area = zoomArea.current;
    const anchor = zoomAnchor.current;
    const img = area?.querySelector("img");
    if (!area || !img || zoomWidth === null || !anchor) return;
    area.scrollLeft = img.offsetLeft + anchor.fx * img.offsetWidth - anchor.x;
    area.scrollTop = img.offsetTop + anchor.fy * img.offsetHeight - anchor.y;
    zoomAnchor.current = null;
  }, [zoomWidth]);

  if (!shot) return null;

  const position = many && (
    <span className="cap viewer-count">
      {pad2(index + 1)} / {pad2(count)}
    </span>
  );

  return (
    <div
      className="viewer"
      onKeyDown={(e) => {
        if (open || !many) return;
        if (e.key === "ArrowRight") step(1);
        else if (e.key === "ArrowLeft") step(-1);
        else return;
        e.preventDefault();
      }}
    >
      <div className="viewer-stage" ref={stage}>
        <button type="button" className="viewer-open" onClick={() => setOpen(true)} aria-label={`View full screen: ${shot.caption ?? shot.alt}`}>
          <Image key={shot.src} src={shot.src} alt={shot.alt} fill sizes="(max-width: 980px) 100vw, 1400px" priority={index === 0} />
        </button>
        {many && (
          <>
            <button type="button" className="viewer-nav prev" onClick={() => step(-1)} aria-label="Previous screenshot">
              <Chevron d={LEFT} />
            </button>
            <button type="button" className="viewer-nav next" onClick={() => step(1)} aria-label="Next screenshot">
              <Chevron d={RIGHT} />
            </button>
          </>
        )}
      </div>

      <div className="viewer-bar">
        <p className="viewer-caption" aria-live="polite">
          {position}
          {shot.caption && <span className="cap">{shot.caption}</span>}
        </p>
        <button type="button" className="btn viewer-full" onClick={() => setOpen(true)}>
          Full screen ⤢
        </button>
      </div>

      {many && (
        <ul className="viewer-thumbs" ref={strip} aria-label="Screenshots">
          {shots.map((s, i) => (
            <li key={s.src}>
              <button type="button" aria-current={i === index} aria-label={s.caption ?? s.alt} onClick={() => (setIndex(i), setZoomWidth(null))}>
                <Image src={s.src} alt="" fill sizes="160px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* full screen; always dark, whatever the site theme */}
      <dialog
        ref={dialog}
        className="viewer-dialog"
        data-theme="dark"
        aria-label="Screenshots"
        onClose={() => (setOpen(false), setZoomWidth(null))}
      >
        {open && (
          <>
            <div className="viewer-dialog-top">
              {position}
              <span className="cap viewer-hint">{zoomWidth === null ? "Tap the image to zoom" : "Drag around · tap to zoom out"}</span>
              <button type="button" className="viewer-close cap" onClick={close}>
                Close <Arrow dir="close" />
              </button>
            </div>

            {/* clicking the empty space around the image closes */}
            <div
              className={`viewer-zoom${zoomWidth !== null ? " is-zoomed" : ""}`}
              ref={zoomArea}
              onClick={(e) => e.target === e.currentTarget && zoomWidth === null && close()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- full-size original, so zooming shows every pixel */}
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                onClick={toggleZoom}
                style={zoomWidth !== null ? { width: zoomWidth } : undefined}
              />
            </div>

            {many && (
              <>
                <button type="button" className="viewer-nav prev" onClick={() => step(-1)} aria-label="Previous screenshot">
                  <Chevron d={LEFT} />
                </button>
                <button type="button" className="viewer-nav next" onClick={() => step(1)} aria-label="Next screenshot">
                  <Chevron d={RIGHT} />
                </button>
              </>
            )}

            {shot.caption && <p className="cap viewer-dialog-caption">{shot.caption}</p>}
          </>
        )}
      </dialog>
    </div>
  );
}
