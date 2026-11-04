/**
 * A sleeve with its record sticking out to the right and spinning.
 * Used at the top of case-study pages. Styles: styles/records.css (.deck-…)
 */
import type { Project } from "@/lib/types";
import { Cover } from "./Cover";
import { RecordLabel } from "./RecordLabel";

export function Deck({ project, index }: { project: Project; index: number }) {
  return (
    <div className="deck">
      <div className="deck-disc" aria-hidden="true">
        <RecordLabel project={project} />
      </div>
      <div className="deck-sleeve">
        <Cover project={project} index={index} />
      </div>
    </div>
  );
}
