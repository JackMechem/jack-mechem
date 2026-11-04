/**
 * Upcoming gigs (edited in /admin). Each row links to the gig's ticket or
 * event page when it has one. Shows a "nothing booked" note when empty, or
 * when Convex couldn't be reached (gigs === null).
 * Styles: styles/music.css (.gig-…)
 */
import { site } from "@/content/site";
import { fmtDate } from "@/lib/format";
import type { Gig } from "@/lib/types";

function GigRow({ gig, isNext }: { gig: Gig; isNext: boolean }) {
  const content = (
    <>
      <div className="gig-date">
        {fmtDate(gig.date, { weekday: "short" })} {fmtDate(gig.date, { day: "numeric" })}
        <small>{fmtDate(gig.date, { month: "long", year: "numeric" })}</small>
      </div>
      <div>
        <div className="gig-act">{gig.act}</div>
        <div className="gig-venue">
          {gig.venue}, {gig.city}
        </div>
      </div>
      <div className="gig-time cap">{gig.time ?? ""}</div>
      <div className="gig-next cap">
        {isNext && (
          <>
            <span className="eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            Next up
          </>
        )}
      </div>
    </>
  );
  return gig.url ? (
    <a className="gig" href={gig.url} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <div className="gig">{content}</div>
  );
}

export function GigList({ gigs }: { gigs: Gig[] | null }) {
  if (!gigs?.length)
    return (
      <div className="gigs-empty">
        <b>Nothing on the books right now</b>
        <span className="cap">
          Gigs pop up last minute. Booking: <a href={`mailto:${site.email}`}>{site.email}</a>
        </span>
      </div>
    );

  return (
    <div>
      {gigs.map((gig, i) => (
        <GigRow key={gig._id} gig={gig} isNext={i === 0} />
      ))}
    </div>
  );
}
