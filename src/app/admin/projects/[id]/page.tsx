/**
 * /admin/projects/<id>: the project editor. /admin/projects/new starts a new,
 * unpublished project with a suggested catalogue number.
 */
import { notFound } from "next/navigation";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { isAdmin } from "@/lib/auth";
import { adminSecret, convex } from "@/lib/convex-admin";
import { ProjectForm } from "../../_components/ProjectForm";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return null;
  const { id } = await params;
  const crates = (await convex().query(api.crates.list, {})).map((c) => ({ id: c._id as string, name: c.name }));
  if (id === "new") {
    const all = await convex().query(api.projects.all, { secret: adminSecret() });
    const n = String(all.length + 1).padStart(3, "0");
    return (
      <>
        <h2 className="cap">New project</h2>
        <ProjectForm
          crates={crates}
          initial={{ crate: crates[0]?.id, slug: "", name: "", cat: `NEW-${n}`, years: String(new Date().getFullYear()), kind: "", stack: [], summary: "", sideA: [], sideB: [], links: [], body: "## Overview\n\n", published: false }}
        />
      </>
    );
  }
  const p = await convex()
    .query(api.projects.get, { secret: adminSecret(), id: id as Id<"projects"> })
    .catch(() => null);
  if (!p) notFound();
  return (
    <>
      <h2 className="cap">Editing: {p.name}</h2>
      <ProjectForm crates={crates} initial={{ ...p, id: p._id, crate: p.crate }} />
    </>
  );
}
