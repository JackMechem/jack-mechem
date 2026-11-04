/**
 * /admin: the gigs page (the first thing you see after signing in).
 * Add a gig with the form; upcoming gigs are listed soonest first, past
 * ones are tucked into a "Past" drop-down. Editing uses ?edit=<id>.
 */
import Link from "next/link";
import { api } from "@convex/_generated/api";
import { isAdmin } from "@/lib/auth";
import { adminSecret, convex } from "@/lib/convex-admin";
import { fmtDate, todayInLA } from "@/lib/format";
import { deleteGig } from "./_actions/gigs";
import { GigForm } from "./_components/GigForm";
import { ConfirmDelete, Notices } from "./_components/ListControls";

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
      <Notices saved={!!saved} error={loadError} />

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
  if (!gigs.length) return <p className="admin-empty">Nothing here.</p>;
  return (
    <ul className="admin-list">
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
          <div className="admin-actions">
            <Link className="btn" href={`/admin?edit=${g._id}`}>
              Edit
            </Link>
            <ConfirmDelete action={deleteGig} id={g._id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
