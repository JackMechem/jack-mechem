import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { adminSecret, convex, isAdmin } from "@/lib/admin";
import { createCrate, deleteCrate, deleteProject, moveCrate, moveProject, renameCrate } from "../actions";

type P = Doc<"projects">;

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  if (!(await isAdmin())) return null;
  const { saved, error } = await searchParams;
  let projects: P[] = [];
  let crates: Doc<"crates">[] = [];
  let loadError = "";
  try {
    [projects, crates] = await Promise.all([
      convex().query(api.projects.all, { secret: adminSecret() }),
      convex().query(api.crates.list, {}),
    ]);
  } catch {
    loadError = "Couldn't reach Convex.";
  }
  const known = new Set(crates.map((c) => c._id as string));
  const loose = projects.filter((p) => !p.crate || !known.has(p.crate));

  return (
    <>
      {saved && <p className="cap adm-ok">Saved. The site is updated.</p>}
      {(loadError || error) && <p className="adm-err">{loadError || error}</p>}
      <div className="adm-top" style={{ marginTop: 26 }}>
        <h2 className="cap" style={{ margin: 0 }}>
          {projects.length} projects in {crates.length} crates
        </h2>
        <a className="btn solid" href="/admin/projects/new">
          + New project
        </a>
      </div>

      {crates.map((c, ci) => {
        const inside = projects.filter((p) => p.crate === c._id);
        return (
          <section key={c._id} className="adm-crate">
            <div className="adm-crate-head">
              <form action={renameCrate} className="adm-rename">
                <input type="hidden" name="id" value={c._id} />
                <input name="name" defaultValue={c.name} aria-label="Crate name" required />
                <button className="btn">Rename</button>
              </form>
              <div className="adm-actions">
                <MoveButton action={moveCrate} id={c._id} dir="up" disabled={ci === 0} label="crate" />
                <MoveButton action={moveCrate} id={c._id} dir="down" disabled={ci === crates.length - 1} label="crate" />
                {inside.length === 0 && (
                  <form action={deleteCrate}>
                    <input type="hidden" name="id" value={c._id} />
                    <button className="btn">Delete crate</button>
                  </form>
                )}
              </div>
            </div>
            <ProjectList projects={inside} />
          </section>
        );
      })}

      {loose.length > 0 && (
        <section className="adm-crate">
          <div className="adm-crate-head">
            <b className="cap">Not in a crate (shown as “Other”)</b>
          </div>
          <ProjectList projects={loose} />
        </section>
      )}

      <form action={createCrate} className="adm-rename" style={{ marginTop: 24 }}>
        <input name="name" placeholder="New crate name, e.g. Games" aria-label="New crate name" required />
        <button className="btn solid">+ Add crate</button>
      </form>
    </>
  );
}

function ProjectList({ projects }: { projects: P[] }) {
  if (!projects.length) return <p className="adm-empty">Empty. Assign projects to this crate in their editor.</p>;
  return (
    <ul className="adm-list">
      {projects.map((p, i) => (
        <li key={p._id}>
          <div>
            <b>{p.name}</b> {!p.published && <span className="adm-badge">Draft</span>}
            <div>
              <small>
                {p.cat} · {p.kind}
              </small>
            </div>
          </div>
          <div className="adm-actions">
            <MoveButton action={moveProject} id={p._id} dir="up" disabled={i === 0} label="project" />
            <MoveButton action={moveProject} id={p._id} dir="down" disabled={i === projects.length - 1} label="project" />
            <a className="btn" href={`/admin/projects/${p._id}`}>
              Edit
            </a>
            {p.published && (
              <a className="btn" href={`/work/${p.slug}`} target="_blank">
                View ↗
              </a>
            )}
            <details className="adm-confirm">
              <summary className="btn">Delete</summary>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={p._id} />
                <input type="hidden" name="image" value={p.image ?? ""} />
                <button className="btn solid">Yes, delete {p.name}</button>
              </form>
            </details>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MoveButton({ action, id, dir, disabled, label }: { action: (f: FormData) => Promise<void>; id: string; dir: "up" | "down"; disabled: boolean; label: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button className="btn" disabled={disabled} aria-label={`Move ${label} ${dir}`}>
        {dir === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}
