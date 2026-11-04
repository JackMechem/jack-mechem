/**
 * The home page: one long page of sections, each its own component in
 * components/home/.
 *
 *   Hero      photo, featured records, pitch
 *   Work      #crate    the record crates (or the shelf layout)
 *   Gigs      #gigs     upcoming gigs
 *   Archive   #archive  video clips (hidden when there are none)
 *   About     #about    bio + skills   ┐ one page stop
 *   Contact   #contact  email + links  ┘
 *
 * Content comes from Convex (lib/content.ts), cached for an hour and
 * refreshed instantly when you save in /admin.
 */
import { getClips, getShelves, getUpcomingGigs } from "@/lib/content";
import { pad2 } from "@/lib/format";
import { SectionHead } from "@/components/layout/SectionHead";
import { RecordPreview } from "@/components/records/RecordPreview";
import { Hero } from "@/components/home/Hero";
import { CrateBrowser } from "@/components/home/CrateBrowser";
import { RecordShelf } from "@/components/home/RecordShelf";
import { WorkViewSwitch } from "@/components/home/WorkViewSwitch";
import { GigList } from "@/components/home/GigList";
import { ClipPlayer } from "@/components/home/ClipPlayer";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";

// Re-render at least hourly so past gigs drop off.
export const revalidate = 3600;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function Home() {
  const [{ shelves, projects }, gigs, clips] = await Promise.all([getShelves(), getUpcomingGigs(), getClips()]);

  // each record's sleeve colour alternates by its position within its crate
  const sleeveIndex = Object.fromEntries(shelves.flatMap((s) => s.projects.map((p, i) => [p.slug, i])));

  return (
    <RecordPreview projects={projects} sleeveIndex={sleeveIndex} crates={shelves.map((s) => s.projects.map((q) => q.slug))}>
      <Hero projects={projects} />

      {/* Both layouts are rendered; styles/shelf.css shows the one picked with the switch. */}
      <section className="section" id="crate">
        <SectionHead
          title="Work"
          caption={[
            `${pad2(projects.length)} projects${shelves.length > 1 ? ` in ${shelves.length} crates` : ""}`,
            <>
              <span className="work-only-crate">
                {shelves.length > 1 ? "pick a crate · then scroll or use the arrows to flip" : "scroll or use the arrows to flip · click a record to open it"}
              </span>
              <span className="work-only-shelf">click a record to open it</span>
            </>,
          ]}
        >
          <WorkViewSwitch />
        </SectionHead>
        {shelves.length > 0 && (
          <>
            <div className="work-only-crate">
              <CrateBrowser shelves={shelves} />
            </div>
            <div className="work-only-shelf">
              <RecordShelf shelves={shelves} />
            </div>
          </>
        )}
      </section>

      <section className="section" id="gigs">
        <SectionHead title="Gigs" caption={["jazz · funk · soul · r&b", "around Los Angeles"]} />
        <div className="subsection-head">
          <h3>Upcoming</h3>
          <span className="cap">{gigs?.length ? `${plural(gigs.length, "date")} on the books` : "dates as they come in"}</span>
        </div>
        <GigList gigs={gigs} />
      </section>

      {clips.length > 0 && (
        <section className="section" id="archive">
          <SectionHead title="Archive" caption={["recordings from past shows", plural(clips.length, "clip")]} />
          <ClipPlayer clips={clips} />
        </section>
      )}

      <About />
      <Contact />
    </RecordPreview>
  );
}
