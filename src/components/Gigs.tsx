import type { Gig } from "@/lib/types";
import { fmtDate } from "@/lib/format";
import { site } from "@/content/site";

export function Gigs({ gigs }: { gigs: Gig[] | null }) {
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
      {gigs.map((g, i) => {
        const body = (
          <>
            <div className="d">
              {fmtDate(g.date, { weekday: "short" })} {fmtDate(g.date, { day: "numeric" })}
              <small>{fmtDate(g.date, { month: "long", year: "numeric" })}</small>
            </div>
            <div>
              <div className="a">{g.act}</div>
              <div className="v">
                {g.venue}, {g.city}
              </div>
            </div>
            <div className="t cap">{g.time ?? ""}</div>
            <div className="next cap">
              {i === 0 && (
                <>
                  <span className="eq" aria-hidden="true">
                    <i /><i /><i /><i /><i />
                  </span>
                  Next up
                </>
              )}
            </div>
          </>
        );
        return g.url ? (
          <a key={g._id} className="gig" href={g.url} target="_blank" rel="noopener noreferrer">
            {body}
          </a>
        ) : (
          <div key={g._id} className="gig">
            {body}
          </div>
        );
      })}
    </div>
  );
}
