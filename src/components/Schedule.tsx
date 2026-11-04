"use client";

import type { Project } from "@/lib/types";
import { useOpenRecord } from "./RecordPlayer";
import { Cover } from "./Record";
import { fitStyle } from "@/lib/format";

const SLOTS = [
  ["On now", "now"],
  ["Up next", ""],
  ["Later", "later"],
] as const;

/**
 * The hero's featured records: the first three, each with its sleeve art and the record
 * peeking out. They share the column's height under a "Featured records" header.
 */
export function Schedule({ projects, total }: { projects: Project[]; total: number }) {
  const openRecord = useOpenRecord();
  return (
    <div className="sched">
      <div className="sched-head">
        <span className="sched-title">Featured records</span>
        <a className="cap" href="#crate">
          {Math.min(3, projects.length)} of {total} · All records ↓
        </a>
      </div>
      {SLOTS.map(([when, cls], i) => {
        const p = projects[i];
        if (!p) return null;
        return (
          <button key={p.slug} type="button" className={`slot ${cls}`} onClick={() => openRecord(p.slug)}>
            <span className="shelf-art" aria-hidden="true">
              <span className="shelf-disc">
                <span className="shelf-label" />
              </span>
              <span className="shelf-sleeve">
                <Cover p={p} index={i} sizes="220px" />
              </span>
            </span>
            <span className="slot-text">
              <span className="row">
                <span className="cap">{when}</span>
                {cls === "now" ? (
                  <span className="eq" aria-hidden="true">
                    <i /><i /><i /><i /><i />
                  </span>
                ) : (
                  <span className="cap">{p.cat}</span>
                )}
              </span>
              <b className="fit" style={fitStyle(p.name)}>
                {p.name}
              </b>
              <span className="slot-kind">
                {p.kind}
                {cls !== "later" && `. ${p.stack.slice(0, 3).join(", ")}`}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
