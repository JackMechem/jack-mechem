/**
 * The home page: one long page of sections, each its own component in
 * components/home/. On desktop the SectionPager moves one section per scroll
 * gesture (sections marked `page-stop`).
 *
 *   Hero      photo, featured records, pitch
 *   Work      #crate    the record crates
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
import { GigList } from "@/components/home/GigList";
import { ClipPlayer } from "@/components/home/ClipPlayer";
import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { SectionPager } from "@/components/home/SectionPager";

// Re-render at least hourly so past gigs drop off.
export const revalidate = 3600;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default async function Home() {
  const [{ shelves, projects }, gigs, clips] = await Promise.all([getShelves(), getUpcomingGigs(), getClips()]);

  // each record's sleeve colour alternates by its position within its crate
  const sleeveIndex = Object.fromEntries(shelves.flatMap((s) => s.projects.map((p, i) => [p.slug, i])));

  return (
    <RecordPreview projects={projects} sleeveIndex={sleeveIndex}>
      <SectionPager />

      <Hero projects={projects} />

      <section className="section page-stop" id="crate">
        <SectionHead
          title={shelves.length > 1 ? "The crates" : "The crate"}
          caption={[
            `${pad2(projects.length)} records${shelves.length > 1 ? ` in ${shelves.length} crates` : ""}`,
            "scroll or use the arrows to flip · click a record to open it",
          ]}
        />
        {shelves.length > 0 && <CrateBrowser shelves={shelves} />}
      </section>

      <section className="section page-stop" id="gigs">
        <SectionHead title="On stage" caption={["jazz · funk · soul · r&b", "around Los Angeles"]} />
        <div className="subsection-head">
          <h3>Upcoming</h3>
          <span className="cap">{gigs?.length ? `${plural(gigs.length, "date")} on the books` : "dates as they come in"}</span>
        </div>
        <GigList gigs={gigs} />
      </section>

      {clips.length > 0 && (
        <section className="section page-stop" id="archive">
          <SectionHead title="Archive" caption={["recordings from past shows", plural(clips.length, "clip")]} />
          <ClipPlayer clips={clips} />
        </section>
      )}

      <div className="page-stop">
        <About />
        <Contact />
      </div>
    </RecordPreview>
  );
}
