import Image from "next/image";
import { fitStyle } from "@/lib/format";
import type { Project } from "@/lib/types";

/** Sleeve screenshots: true = full colour, false = black-and-white halftone print. */
const COLOR_ART = true;

/** Sleeve art. Alternates ink/paper by position so the crate has rhythm. */
export function Cover({ p, index, sizes = "420px" }: { p: Project; index: number; sizes?: string }) {
  return (
    <div className={`cover ${index % 2 ? "nor" : "inv"}`}>
      <div className="t">
        <b style={{ "--len": p.name.length } as React.CSSProperties}>{p.name}</b>
        <span>
          {p.cat}
          <br />
          {p.years}
        </span>
      </div>
      <div className="k">{p.kind}</div>
      <div className="art">
        {p.image ? (
          <div className={COLOR_ART ? "cover-shot" : "halftone"}>
            <Image src={p.image} alt="" fill sizes={sizes} />
          </div>
        ) : (
          <>
            <div className="stack">
              {p.stack.map((s) => (
                <div key={s}>{s}</div>
              ))}
            </div>
            <div className="typo" aria-hidden="true">
              <span>{p.name}</span>
              <span>{p.name}</span>
              <span>{p.name}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Sleeve with the record behind it. Animation is driven by the parent's classes. */
export function Deck({ p, index }: { p: Project; index: number }) {
  return (
    <div className="vy-deck">
      <div className="vy-disc" aria-hidden="true">
        <div className="vy-spin">
          <div className="vy-label" style={fitStyle(p.name)}>
            <div>
              {p.name}
              <small>{p.cat} · 33⅓</small>
            </div>
          </div>
        </div>
      </div>
      <div className="vy-sleeve">
        <Cover p={p} index={index} />
      </div>
    </div>
  );
}

export function Sides({ p }: { p: Project }) {
  const list = (side: string, tracks: string[]) => (
    <ol>
      {tracks.map((t, i) => (
        <li key={t}>
          <span>
            {side}
            {i + 1}
          </span>
          {t}
        </li>
      ))}
    </ol>
  );
  return (
    <div className="sides">
      <div>
        <h4 className="cap">Side A</h4>
        {list("A", p.sideA)}
      </div>
      <div>
        <h4 className="cap">Side B</h4>
        {list("B", p.sideB)}
      </div>
    </div>
  );
}
