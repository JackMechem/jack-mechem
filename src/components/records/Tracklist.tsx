/**
 * A project's highlights as an LP tracklist: Side A and Side B, numbered
 * A1, A2… (the sideA / sideB fields edited in /admin).
 * Styles: styles/records.css (.tracklist)
 */
import type { Project } from "@/lib/types";

function Side({ letter, tracks }: { letter: "A" | "B"; tracks: string[] }) {
  return (
    <div>
      <h4 className="cap">Side {letter}</h4>
      <ol>
        {tracks.map((track, i) => (
          <li key={track}>
            <span>
              {letter}
              {i + 1}
            </span>
            {track}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Tracklist({ project }: { project: Project }) {
  return (
    <div className="tracklist">
      <Side letter="A" tracks={project.sideA} />
      <Side letter="B" tracks={project.sideB} />
    </div>
  );
}
