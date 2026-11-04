/**
 * About: the bio, links (CV, GitHub, LinkedIn) and the skills list, all from
 * content/site.ts. Styles: styles/about.css
 */
import Link from "next/link";
import { site } from "@/content/site";
import { SectionHead } from "@/components/layout/SectionHead";

export function About() {
  const [lead, ...rest] = site.bio;
  return (
    <section className="section" id="about">
      <SectionHead title="About" caption={["background · skills", "full history on the CV page"]} />
      <div className="about-grid">
        <div>
          <h3 className="cap">About me</h3>
          <p className="about-lead">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="about-links">
            <Link className="btn solid" href="/cv">
              View CV →
            </Link>
            <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
        <div>
          <h3 className="cap">Skills</h3>
          <dl className="skills">
            {Object.entries(site.skills).map(([area, list]) => (
              <div key={area}>
                <dt>{area}</dt>
                <dd>{list}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
