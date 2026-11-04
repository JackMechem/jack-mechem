"use client";

/**
 * The Work section's "shelf" layout (see WorkViewSwitch): every record
 * face-out on a ledge, one shelf per crate, for visitors who'd rather scan
 * everything at once than flip through. Clicking a record opens its preview.
 * On narrow screens each shelf scrolls sideways.
 * Styles: styles/shelf.css (.shelf-…)
 */
import { pad2 } from "@/lib/format";
import type { Shelf } from "@/lib/types";
import { Cover } from "@/components/records/Cover";
import { useOpenRecord } from "@/components/records/RecordPreview";

export function RecordShelf({ shelves }: { shelves: Shelf[] }) {
  const openRecord = useOpenRecord();

  return (
    <div className="record-shelf">
      {shelves.map((s) => (
        <div key={s.id} className="shelf-row">
          <h3 className="shelf-name">
            {s.name}
            <span className="cap">{pad2(s.projects.length)} records</span>
          </h3>
          <ul className="shelf-records">
            {s.projects.map((p, i) => (
              <li key={p.slug}>
                <button type="button" className="shelf-record" onClick={() => openRecord(p.slug)} aria-label={`${p.name}: open record`}>
                  <Cover project={p} index={i} sizes="240px" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
