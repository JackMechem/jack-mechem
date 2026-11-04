/**
 * A record sleeve for a project: name and catalogue number across the top, the
 * project type, then its screenshot (or the name set large if it has none).
 * Used in the crate, the featured list, the gatefold and case-study pages.
 * Styles: styles/records.css (.cover-…)
 */
import Image from "next/image";
import { fitStyle } from "@/lib/format";
import type { Project } from "@/lib/types";

/** Sleeve screenshots: true = full colour, false = black-and-white halftone print. */
const COLOR_ART = true;

type Props = {
  project: Project;
  /** Position in its crate. Sleeves alternate ink / paper so a stack has rhythm. */
  index: number;
  /** `sizes` hint for the screenshot (how wide the sleeve is shown). */
  sizes?: string;
};

export function Cover({ project: p, index, sizes = "420px" }: Props) {
  return (
    <div className={`cover ${index % 2 ? "cover--paper" : "cover--ink"}`}>
      <div className="cover-head">
        <b className="cover-name" style={{ "--len": p.name.length } as React.CSSProperties}>
          {p.name}
        </b>
        <span className="cover-cat">
          {p.cat}
          <br />
          {p.years}
        </span>
      </div>
      <div className="cover-kind">{p.kind}</div>
      <div className="cover-art">
        {p.image ? (
          <div className={COLOR_ART ? "cover-shot" : "halftone"}>
            <Image src={p.image} alt="" fill sizes={sizes} />
          </div>
        ) : (
          <>
            <div className="cover-stack">
              {p.stack.map((s) => (
                <div key={s}>{s}</div>
              ))}
            </div>
            <div className="cover-type" style={fitStyle(p.name)} aria-hidden="true">
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
