import { api } from "../../../convex/_generated/api";
import { adminSecret, convex, isAdmin } from "@/lib/admin";
import { fmtDate, todayInLA } from "@/lib/format";
import { deleteGig } from "./actions";
import { GigForm } from "./forms";

export default async function Admin({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  if (!(await isAdmin())) return null;

  const { edit, saved } = await searchParams;
  let gigs: Awaited<ReturnType<typeof loadGigs>> = [];
  let loadError = "";
  try {
    gigs = await loadGigs();
  } catch {
    loadError = "Couldn't reach Convex. Check NEXT_PUBLIC_CONVEX_URL and ADMIN_SECRET.";
  }
  const today = todayInLA();
  const upcoming = gigs.filter((g) => g.date >= today).reverse();
  const past = gigs.filter((g) => g.date < today);
  const editing = edit ? gigs.find((g) => g._id === edit) : undefined;

  return (
    <>
      {saved && <p className="cap adm-ok">Saved. The site is updated.</p>}
      {loadError && <p className="adm-err">{loadError}</p>}

      <h2 className="cap">{editing ? `Editing: ${editing.act}` : "Add a gig"}</h2>
      <GigForm
        editing={!!editing}
        initial={editing ? { ...editing, id: editing._id } : { date: today, time: "8 PM", act: "", venue: "", city: "Los Angeles, CA" }}
      />

      <h2 className="cap">Upcoming ({upcoming.length})</h2>
      <GigList gigs={upcoming} />
      {past.length > 0 && (
        <details>
          <summary className="cap">Past ({past.length})</summary>
          <GigList gigs={past} />
        </details>
      )}
    </>
  );
}

async function loadGigs() {
  return await convex().query(api.gigs.all, { secret: adminSecret() });
}

function GigList({ gigs }: { gigs: Awaited<ReturnType<typeof loadGigs>> }) {
  if (!gigs.length) return <p className="adm-empty">Nothing here.</p>;
  return (
    <ul className="adm-list">
      {gigs.map((g) => (
        <li key={g._id}>
          <div>
            <b>{fmtDate(g.date, { weekday: "short", month: "short", day: "numeric" })}</b>
            {g.time && <span> · {g.time}</span>}
            <div>{g.act}</div>
            <small>
              {g.venue}, {g.city}
            </small>
          </div>
          <div className="adm-actions">
            <a className="btn" href={`/admin?edit=${g._id}`}>
              Edit
            </a>
            <form action={deleteGig}>
              <input type="hidden" name="id" value={g._id} />
              <button className="btn">Delete</button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
