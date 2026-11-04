import { api } from "../../../../convex/_generated/api";
import { convex, isAdmin } from "@/lib/admin";
import { deleteClip, moveClip } from "../actions";
import { ClipForm } from "./clip-form";

export default async function ClipsAdmin({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  if (!(await isAdmin())) return null;
  const { edit, saved } = await searchParams;
  let clips: Awaited<ReturnType<typeof load>> = [];
  let loadError = "";
  try {
    clips = await load();
  } catch {
    loadError = "Couldn't reach Convex.";
  }
  const editing = edit ? clips.find((c) => c._id === edit) : undefined;

  return (
    <>
      {saved && <p className="cap adm-ok">Saved. The site is updated.</p>}
      {loadError && <p className="adm-err">{loadError}</p>}
      <h2 className="cap">{editing ? `Editing: ${editing.title}` : "Add a clip"}</h2>
      <ClipForm initial={editing ? { ...editing, id: editing._id } : { title: "", detail: "", alt: "" }} />

      <h2 className="cap">On the site ({clips.length})</h2>
      {clips.length === 0 ? (
        <p className="adm-empty">No clips yet.</p>
      ) : (
        <ul className="adm-list">
          {clips.map((c, i) => (
            <li key={c._id}>
              <div className="adm-media">
                {c.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.poster} alt="" />
                ) : (
                  <span className="ph" />
                )}
                <div>
                  <b>{c.title}</b>
                  <div>
                    <small>{c.detail}</small>
                  </div>
                </div>
              </div>
              <div className="adm-actions">
                <Move id={c._id} dir="up" disabled={i === 0} />
                <Move id={c._id} dir="down" disabled={i === clips.length - 1} />
                <a className="btn" href={`/admin/clips?edit=${c._id}`}>
                  Edit
                </a>
                <Confirm id={c._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const load = () => convex().query(api.clips.list, {});

function Move({ id, dir, disabled }: { id: string; dir: "up" | "down"; disabled: boolean }) {
  return (
    <form action={moveClip}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button className="btn" disabled={disabled} aria-label={`Move ${dir}`}>
        {dir === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}

function Confirm({ id }: { id: string }) {
  return (
    <details className="adm-confirm">
      <summary className="btn">Delete</summary>
      <form action={deleteClip}>
        <input type="hidden" name="id" value={id} />
        <button className="btn solid">Yes, delete</button>
      </form>
    </details>
  );
}
