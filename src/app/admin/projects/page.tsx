/**
 * /admin/projects: projects grouped by crate (category). Create, rename,
 * reorder and delete crates; reorder projects within a crate; open the
 * editor (/admin/projects/<id>, or /new). Crates can only be deleted when
 * empty. Errors from crate actions arrive as ?error=.
 */
import Link from "next/link";
import { api } from "@convex/_generated/api";
import type { Doc } from "@convex/_generated/dataModel";
import { isAdmin } from "@/lib/auth";
import { adminSecret, convex } from "@/lib/convex-admin";
import { createCrate, deleteCrate, moveCrate, renameCrate } from "../_actions/crates";
import { deleteProject, moveProject } from "../_actions/projects";
import { ConfirmDelete, MoveButtons, Notices } from "../_components/ListControls";
import { Arrow } from "@/components/layout/Arrow";

type Project = Doc<"projects">;

async function load() {
  try {
    const [projects, crates] = await Promise.all([convex().query(api.projects.all, { secret: adminSecret() }), convex().query(api.crates.list, {})]);
    return { projects, crates, error: undefined };
  } catch {
    return { projects: [], crates: [], error: "Couldn't reach Convex." };
  }
}

export default async function ProjectsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  if (!(await isAdmin())) return null;
  const { saved, error } = await searchParams;
  const { projects, crates, error: loadError } = await load();

  // projects whose crate is missing are shown in an "Other" crate on the site
  const crateIds = new Set(crates.map((c) => c._id as string));
  const loose = projects.filter((p) => !p.crate || !crateIds.has(p.crate));

  return (
    <>
      <Notices saved={!!saved} error={loadError || error} />
      <div className="admin-top" style={{ marginTop: 26 }}>
        <h2 className="cap" style={{ margin: 0 }}>
          {projects.length} projects in {crates.length} crates
        </h2>
        <Link className="btn solid" href="/admin/projects/new">
          + New project
        </Link>
      </div>

      {crates.map((crate, i) => {
        const inside = projects.filter((p) => p.crate === crate._id);
        return (
          <section key={crate._id} className="admin-crate">
            <div className="admin-crate-head">
              <form action={renameCrate} className="admin-rename">
                <input type="hidden" name="id" value={crate._id} />
                <input name="name" defaultValue={crate.name} aria-label="Crate name" required />
                <button className="btn">Rename</button>
              </form>
              <div className="admin-actions">
                <MoveButtons action={moveCrate} id={crate._id} index={i} count={crates.length} label="crate" />
                {inside.length === 0 && (
                  <form action={deleteCrate}>
                    <input type="hidden" name="id" value={crate._id} />
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
        <section className="admin-crate">
          <div className="admin-crate-head">
            <b className="cap">Not in a crate (shown as “Other”)</b>
          </div>
          <ProjectList projects={loose} />
        </section>
      )}

      <form action={createCrate} className="admin-rename" style={{ marginTop: 24 }}>
        <input name="name" placeholder="New crate name, e.g. Games" aria-label="New crate name" required />
        <button className="btn solid">+ Add crate</button>
      </form>
    </>
  );
}

function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects.length) return <p className="admin-empty">Empty. Assign projects to this crate in their editor.</p>;
  return (
    <ul className="admin-list">
      {projects.map((p, i) => (
        <li key={p._id}>
          <div>
            <b>{p.name}</b> {!p.published && <span className="admin-badge">Draft</span>}
            <div>
              <small>
                {p.cat} · {p.kind}
              </small>
            </div>
          </div>
          <div className="admin-actions">
            <MoveButtons action={moveProject} id={p._id} index={i} count={projects.length} label="project" />
            <Link className="btn" href={`/admin/projects/${p._id}`}>
              Edit
            </Link>
            {p.published && (
              <a className="btn" href={`/work/${p.slug}`} target="_blank">
                View <Arrow dir="out" />
              </a>
            )}
            <ConfirmDelete action={deleteProject} id={p._id} label={`Yes, delete ${p.name}`} fields={{ image: p.image ?? "" }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
