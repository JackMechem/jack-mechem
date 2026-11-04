/**
 * A record playing on a turntable, with its sleeve propped up behind it.
 * Used at the top of case-study pages (app/(site)/work/[slug]).
 *
 * Drawn like the milk crate: flat paper with ink outlines, in the theme's two
 * colours; only the record itself is black vinyl. The deck's top is tilted
 * back in 3D, so the record spins flat on the platter. The hardware (tonearm,
 * buttons, pitch slider, printed labels) is one SVG laid over the top, in the
 * same plane; its 130 × 100 viewBox matches the top's 1.3 : 1 shape.
 * Hovering the page's "Put it back" link lifts the arm off and stops the
 * record (styles/case-study.css).
 * Styles: styles/turntable.css (.turntable-…)
 */
import type { Project } from "@/lib/types";
import { Cover } from "./Cover";
import { RecordLabel } from "./RecordLabel";

export function Turntable({ project, index }: { project: Project; index: number }) {
  return (
    <div className="turntable" aria-hidden="true">
      <div className="turntable-sleeve">
        <Cover project={project} index={index} sizes="320px" />
      </div>

      <div className="turntable-deck">
        <div className="turntable-top">
          <div className="turntable-platter" />
          <div className="turntable-record">
            <RecordLabel project={project} />
          </div>
          <svg className="turntable-hw" viewBox="0 0 130 100">
            <rect x="3" y="3" width="124" height="94" className="turntable-line" />
            <text x="6.5" y="9.5" className="turntable-print">DIRECT DRIVE</text>

            {/* start / stop, 33, 45 */}
            <rect x="6" y="83" width="11" height="6" className="turntable-key" />
            <rect x="19.5" y="83" width="7" height="6" className="turntable-key is-on" />
            <rect x="29" y="83" width="7" height="6" className="turntable-key" />
            <text x="6" y="94" className="turntable-print">START</text>
            <text x="20.5" y="94" className="turntable-print">33</text>
            <text x="30" y="94" className="turntable-print">45</text>

            {/* pitch slider, with tick marks */}
            <path d="M115 50 H117 M115 58 H117 M114 66 H117 M115 74 H117 M115 82 H117" className="turntable-line" />
            <rect x="119" y="47" width="3.5" height="38" className="turntable-line" />
            <rect x="117" y="63" width="7.5" height="4.5" className="turntable-key is-on" />

            {/* tonearm: base, then the arm (pivots at 110.5, 18), then the pivot cap */}
            <circle cx="110.5" cy="18" r="7.5" className="turntable-key" />
            <circle cx="110.5" cy="18" r="4.5" className="turntable-line" />
            <g className="turntable-arm">
              <line x1="110.5" y1="18" x2="111.6" y2="9" className="turntable-tube" />
              <rect x="107.6" y="2" width="8" height="7" className="turntable-key" />
              <polyline points="110.5,18 107,50 84,66.5" className="turntable-tube" />
              <polygon points="85.8,64.6 87.6,68.4 80.6,73.4 78.4,70" className="turntable-key" />
            </g>
            <circle cx="110.5" cy="18" r="2" className="turntable-key is-on" />
          </svg>
        </div>
        <div className="turntable-front">
          <span className="cap">33⅓</span>
        </div>
      </div>
    </div>
  );
}
