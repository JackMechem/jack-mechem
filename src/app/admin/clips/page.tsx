/**
 * /admin/clips: add, edit, reorder and delete the Archive video clips.
 * Editing uses ?edit=<id>, which loads that clip into the form at the top.
 */
import Link from "next/link";
import { api } from "@convex/_generated/api";
import { isAdmin } from "@/lib/auth";
import { convex } from "@/lib/convex-admin";
import { deleteClip, moveClip } from "../_actions/clips";
import { ClipForm } from "../_components/ClipForm";
import { ConfirmDelete, MoveButtons, Notices } from "../_components/ListControls";

export default async function ClipsAdmin({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  if (!(await isAdmin())) return null;
  const { edit, saved } = await searchParams;
  const clips = await convex()
    .query(api.clips.list, {})
    .catch(() => null);
  const editing = edit ? clips?.find((c) => c._id === edit) : undefined;

  return (
    <>
      <Notices saved={!!saved} error={clips ? undefined : "Couldn't reach Convex."} />
      <h2 className="cap">{editing ? `Editing: ${editing.title}` : "Add a clip"}</h2>
      <ClipForm initial={editing ? { ...editing, id: editing._id } : { title: "", detail: "", alt: "" }} />

      <h2 className="cap">On the site ({clips?.length ?? 0})</h2>
      {!clips?.length ? (
        <p className="admin-empty">No clips yet.</p>
      ) : (
        <ul className="admin-list">
          {clips.map((c, i) => (
            <li key={c._id}>
              <div className="admin-media">
                {c.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                  <img src={c.poster} alt="" />
                ) : (
                  <span className="placeholder" />
                )}
                <div>
                  <b>{c.title}</b>
                  <div>
                    <small>{c.detail}</small>
                  </div>
                </div>
              </div>
              <div className="admin-actions">
                <MoveButtons action={moveClip} id={c._id} index={i} count={clips.length} label="clip" />
                <Link className="btn" href={`/admin/clips?edit=${c._id}`}>
                  Edit
                </Link>
                <ConfirmDelete action={deleteClip} id={c._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
