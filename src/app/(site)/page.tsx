import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { getClips, getShelves, getUpcomingGigs } from "@/lib/content";
import { RecordPlayer } from "@/components/RecordPlayer";
import { Schedule } from "@/components/Schedule";
import { Crate } from "@/components/Crate";
import { Gigs } from "@/components/Gigs";
import { Clip } from "@/components/Clip";
import { CopyEmail } from "@/components/CopyEmail";
import { SectionPager } from "@/components/SectionPager";

// Re-render hourly so past gigs drop off; /admin refreshes it instantly on save.
export const revalidate = 3600;

export default async function Home() {
  const [{ shelves, projects }, gigs, clips] = await Promise.all([getShelves(), getUpcomingGigs(), getClips()]);

  return (
    <RecordPlayer projects={projects} sleeves={Object.fromEntries(shelves.flatMap((s) => s.projects.map((p, i) => [p.slug, i])))}>
      <SectionPager />
      <section className="hero snap">
        <div className="stage" data-theme="dark">
          <div className="halftone">
            <Image src="/headshot.jpg" alt="Jack Mechem at the drums" fill priority sizes="67vw" />
          </div>
          <div className="scan" />
          <div className="tag cap">
            <span>● Live</span>
            <span>Northridge, CA</span>
          </div>
          <h1>
            Jack
            <br />
            Mechem
          </h1>
        </div>
        <Schedule projects={projects} total={projects.length} />
        <div className="strip">
          <p>
            {site.hero} <span>{site.heroSub}</span>
          </p>
          <a href="#crate" className="cap">
            Dig through the crate <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="s snap" id="crate">
        <div className="sh">
          <h2>{shelves.length > 1 ? "The crates" : "The crate"}</h2>
          <span className="cap">
            {String(projects.length).padStart(2, "0")} records{shelves.length > 1 && ` in ${shelves.length} crates`}
            <br />
            scroll or use the arrows to flip · click a record to open it
          </span>
        </div>
        {shelves.length > 0 && <Crate shelves={shelves} />}
      </section>

      <section className="s snap" id="gigs">
        <div className="sh">
          <h2>On stage</h2>
          <span className="cap">
            jazz · funk · soul · r&amp;b
            <br />
            around Los Angeles
          </span>
        </div>
        <div className="sub-head">
          <h3>Upcoming</h3>
          <span className="cap">{gigs?.length ? `${gigs.length} date${gigs.length > 1 ? "s" : ""} on the books` : "dates as they come in"}</span>
        </div>
        <Gigs gigs={gigs} />
      </section>

      {clips.length > 0 && (
        <section className="s snap" id="archive">
          <div className="sh">
            <h2>Archive</h2>
            <span className="cap">
              recordings from past shows
              <br />
              {clips.length} {clips.length === 1 ? "clip" : "clips"}
            </span>
          </div>
          <Clip clips={clips} />
        </section>
      )}

      <div className="snap">
        <section className="s" id="about">
          <div className="sh">
            <h2>About</h2>
            <span className="cap">
              background · skills
              <br />
              full history on the CV page
            </span>
          </div>
          <div className="notes about">
            <div>
              <h3 className="cap">About me</h3>
              <p className="lead">{site.bio[0]}</p>
              <p>{site.bio[1]}</p>
              <div className="links">
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
              <dl>
                {Object.entries(site.skills).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <span className="cap">Requests line: no forms, just email. Click to copy.</span>
          <CopyEmail email={site.email} />
          <div className="row">
            <a className="btn" href={`mailto:${site.email}`}>
              Email ↗
            </a>
            <a className="btn" href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a className="btn" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </section>
      </div>
    </RecordPlayer>
  );
}
