/**
 * The paper label in the middle of a record: the project name (sized to fit
 * the circle) and its catalogue number. Place it inside a disc element.
 * Styles: styles/records.css (.record-label)
 */
import { fitStyle } from "@/lib/format";
import type { Project } from "@/lib/types";

export function RecordLabel({ project: p }: { project: Project }) {
  return (
    <div className="spin">
      <div className="record-label" style={fitStyle(p.name)}>
        <div>
          {p.name}
          <small>{p.cat} · 33⅓</small>
        </div>
      </div>
    </div>
  );
}
