"use client";

/**
 * The hero's right column: the first three projects as "Featured records"
 * (On now / Up next / Later), each showing its sleeve with the record peeking
 * out. Clicking one opens its preview. The order comes from the crates in
 * /admin: the first three records across all crates.
 * Styles: styles/hero.css (.featured-…)
 */
import { fitStyle } from "@/lib/format";
import type { Project } from "@/lib/types";
import { Cover } from "@/components/records/Cover";
import { useOpenRecord } from "@/components/records/RecordPreview";

const SLOTS = [
  { label: "On now", modifier: "is-now" },
  { label: "Up next", modifier: "" },
  { label: "Later", modifier: "is-later" },
];

export function FeaturedRecords({ projects }: { projects: Project[] }) {
  const openRecord = useOpenRecord();
  const featured = projects.slice(0, SLOTS.length);

  return (
    <div className="featured">
      <div className="featured-head">
        <span className="featured-title">Featured records</span>
        <a className="cap" href="#crate">
          {featured.length} of {projects.length} · All records ↓
        </a>
      </div>

      {featured.map((p, i) => {
        const { label, modifier } = SLOTS[i];
        return (
          <button key={p.slug} type="button" className={`featured-item ${modifier}`} onClick={() => openRecord(p.slug)}>
            <span className="featured-art" aria-hidden="true">
              <span className="featured-disc">
                <span className="featured-label" />
              </span>
              <span className="featured-sleeve">
                <Cover project={p} index={i} sizes="220px" />
              </span>
            </span>

            <span className="featured-text">
              <span className="featured-meta">
                <span className="cap">{label}</span>
                {modifier === "is-now" ? (
                  <span className="eq" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <span className="cap">{p.cat}</span>
                )}
              </span>
              <b className="featured-name fit" style={fitStyle(p.name)}>
                {p.name}
              </b>
              <span className="featured-kind">
                {p.kind}
                {modifier !== "is-later" && `. ${p.stack.slice(0, 3).join(", ")}`}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
